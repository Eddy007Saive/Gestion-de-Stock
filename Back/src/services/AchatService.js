import db from "@/database/models";
import StockService from "@/services/StockService";

class AchatService {
    async getAllAchat(options = {}) {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'ASC' } = options;

        // Calcul de l'offset pour la pagination
        const offset = (page - 1) * limit;


        // Configuration des options de recherche
        const whereClause = search
            ? {
                [db.Sequelize.Op.or]: [
                    { 'fournisseur.nom': { [db.Sequelize.Op.like]: `%${search}%` } },
                    { 'produit.nom': { [db.Sequelize.Op.like]: `%${search}%` } }
                ]
            }
            : {};

        // Validation des paramètres de tri pour éviter les injections SQL
        const validSortColumns = ['id', 'nom', 'prix', 'seuilAlerte', 'totalQuantite', 'createdAt', 'updatedAt'];
        const validSortOrders = ['ASC', 'DESC'];

        const orderBy = validSortColumns.includes(sortBy) ? sortBy : 'id';
        const orderDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'ASC';

        // Configuration des options pour findAndCountAll
        const queryOptions = {
            where: whereClause,
            include: [
                {
                    model: db.Fournisseur,
                    as: 'fournisseur',
                    required: false,
                    attributes: ['nom'],
                },
                {
                    model: db.ApprovisionnementProduit,
                    as: 'lignes',
                    required: false,
                    include: [
                        {
                            model: db.Produit,
                            as: 'produit',
                            required: false,
                            attributes: ['nom'],
                        }
                    ]
                }
            ],
            attributes: [
                'id',
                'date',
                'fournisseurId',
                'remarque'
            ],
            order: [[orderBy === 'totalQuantite' ? db.Sequelize.literal('totalQuantite') : orderBy, orderDirection]],
            distinct: true,
            subQuery: false
        };
        // Ajout des options de pagination
        queryOptions.limit = limit;
        queryOptions.offset = offset;

        // Exécution de la requête avec pagination
        const { count, rows } = await db.Approvisionnement.findAndCountAll(queryOptions);


        return {
            rows: rows, count: count
        }
    }

    
    async createAchat(product) {
        console.log(product);

        const transaction = await db.sequelize.transaction();
        try {
            const approvisionnement = await db.Approvisionnement.create({
                date: new Date(),
                fournisseurId: product.fournisseurId,
                remarque: product.remarque
            }, { transaction });

            await db.ApprovisionnementProduit.create({
                approvisionnementId: approvisionnement.id,
                produitId: product.produitId,
                quantite: product.quantite,
                prix_unitaire: product.prixUnitaire
            }, { transaction });

            await db.Stock.create({
                produitId: product.produitId,
                quantite: product.quantite,
                date_stock: new Date(),
                type_mouvement: "ENTRÉE",
            }, { transaction });

            await transaction.commit();

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
}

export default new AchatService();
