import db from "@/database/models";
import StockService from "@/services/StockService";
import path from 'path';
import PdfService from "@/services/PdfService";

class VenteService {
    async getAllVentes(options = {}) {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'ASC' } = options;

        // Calcul de l'offset pour la pagination
        const offset = (page - 1) * limit;

        // Configuration des options de recherche
        const whereClause = search
            ? {
                [db.Sequelize.Op.or]: [
                    { '$client.nom$': { [db.Sequelize.Op.like]: `%${search}%` } },
                    { '$ventedetails.produit.nom$': { [db.Sequelize.Op.like]: `%${search}%` } }
                ]
            }
            : {};

        // Validation des paramètres de tri pour éviter les injections SQL
        const validSortColumns = ['id', 'nom', 'prix', 'seuilAlerte', 'totalQuantite', 'totalPrix', 'createdAt', 'updatedAt'];
        const validSortOrders = ['ASC', 'DESC'];
        const orderBy = validSortColumns.includes(sortBy) ? sortBy : 'id';
        const orderDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'ASC';

        // Configuration des options pour findAndCountAll
        const queryOptions = {
            where: whereClause,
            include: [
                {
                    model: db.Ventedetail,
                    as: 'ventedetails',
                    required: false,
                    include: [
                        {
                            model: db.Produit,
                            as: 'produit',
                            required: false,
                            attributes: ['nom']
                        }
                    ]
                }
            ],
            attributes: [
                'id',
                'dateVente',
                [db.Sequelize.literal('(SELECT SUM(quantite) FROM ventedetails WHERE ventedetails.venteId = Vente.id)'), 'totalQuantite'],
                [db.Sequelize.literal('(SELECT SUM(quantite * prix) FROM ventedetails WHERE ventedetails.venteId = Vente.id)'), 'totalPrix']
            ],
            order: [[orderBy === 'totalQuantite' || orderBy === 'totalPrix' ? db.Sequelize.literal(orderBy) : orderBy, orderDirection]],
            limit,
            offset,
            distinct: true,
            subQuery: false
        };

        // Exécution de la requête
        const { count, rows } = await db.Vente.findAndCountAll(queryOptions);

        return {
            rows: rows,
            count: count
        };
    }
    async createVentes(products, res) {

        const transaction = await db.sequelize.transaction();
        try {
            for (const produit of products) {
                const stockActuel = await StockService.getStockRestant(produit.produitId);




                if (stockActuel < produit.quantite) {
                    throw new Error(`Stock insuffisant pour le produit ${produit.nom}`);
                }
            }

            let lastVenteId = null;

            const createdVentesDetails = await Promise.all(products.map(async (produit) => {
                await db.Stock.create({
                    produitId: produit.produitId,
                    quantite: -1 * produit.quantite,
                    date_stock: new Date(),
                    type_mouvement: "SORTIE"
                }, { transaction });

                const produitCopie = { ...produit, dateVente: new Date() };

                const vente = await db.Vente.create(produitCopie, { transaction });

                lastVenteId = vente.id;

                const venteDetails = { ...produit, venteId: vente.id };

                return await db.Ventedetail.create(venteDetails, { transaction });
            }));

            await transaction.commit();
            let pdf = null;

            if (res && lastVenteId) {
                pdf = this.printFacture(lastVenteId, res);
            }

            return pdf;

        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    }

    async updateVente(id, data) {
        const vente = await db.Vente.findByPk(id);
        if (!vente) throw new Error("Vente introuvable");
        return await vente.update(data);
    }

    async deleteVente(id) {
        const vente = await db.Vente.findByPk(id);
        if (!vente) throw new Error("Vente introuvable");
        await vente.destroy();
    }

    async printFacture(id, res) {
        try {
            const vente = await db.Vente.findByPk(id, {
                include: [
                    {
                        model: db.Ventedetail,
                        as: 'ventedetails',
                        required: false,
                        include: [
                            {
                                model: db.Produit,
                                as: 'produit',
                                required: false,
                                include: [
                                    {
                                        model: db.Categorie,
                                        as: 'categorie',
                                        required: false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            if (!vente) {
                throw new Error(`Vente avec l'ID ${id} non trouvée`);
            }

            // Calcul de la date d'échéance (30 jours après la date de vente)
            const dateVente = new Date(vente.dateVente || Date.now());
            const dateEcheance = new Date(dateVente);
            dateEcheance.setDate(dateEcheance.getDate() + 30);


            // Construction des données pour le template
            const factureData = {
                // Informations de la facture
                numFacture: `${vente.id}-${new Date().getFullYear()}`,
                dateFacture: dateVente.toLocaleDateString('fr-FR'),
                dateEcheance: dateEcheance.toLocaleDateString('fr-FR'),

                // Informations de l'entreprise
                entreprise: {
                    nom: 'VOTRE ENTREPRISE',
                    adresse: 'Adresse de l\'entreprise',
                    ville: 'Ville',
                    codePostal: 'Code Postal',
                    telephone: 'Téléphone',
                    email: 'email@entreprise.com',
                    siret: 'SIRET de l\'entreprise'
                },

                // Informations du client
                client: {
                    nom: vente.client?.nom || 'Client non spécifié',
                    adresse: vente.client?.adresse || 'Adresse non spécifiée',
                    ville: vente.client?.ville || 'Ville non spécifiée',
                    codePostal: vente.client?.codePostal || '',
                    email: vente.client?.email || '',
                    siret: vente.client?.siret || ''
                },

                // Informations de paiement
                paiement: {
                    iban: 'IBAN de l\'entreprise',
                    bic: 'BIC de l\'entreprise',
                    banque: 'Nom de la banque'
                },

                // Lignes de facturation depuis les détails de vente
                lignes: vente.ventedetails.map(detail => ({
                    description: detail.produit?.nom || 'Produit inconnu',
                    quantite: detail.quantite || 0,
                    prixUnitaire: detail.prixUnitaire || detail.produit?.prixVente || 0
                })),

                // Taux de TVA (en pourcentage)
                tauxTVA: 20
            };

            // Chemin vers le template HTML
            const templatePath = path.join(process.cwd(), 'templates', 'facture.html');

            // Génération du PDF
            return await PdfService.buildPDFFromTemplate(templatePath, factureData, res);
        } catch (error) {
            console.error('Erreur lors de la génération de la facture:', error);
            res.status(500).send('Erreur lors de la génération de la facture');
        }
    }
}

export default new VenteService();
