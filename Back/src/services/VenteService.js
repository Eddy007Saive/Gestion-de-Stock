import db from "@/database/models";
import StockService from "@/services/StockService";

class VenteService {
    async getAllVentes() {
    return await db.Vente.findAll({
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
}
    async createVentes(products) {
        const transaction = await db.sequelize.transaction();
        try {
            for (const produit of products) {
                const stockActuel = await StockService.getStockRestant(req.params.produitId);
                

                if (!entrees && !sorties) {
                    throw new Error(`Produit ID ${produit.produitId} non trouvé en stock`);
                }

                if (stockActuel < produit.quantite) {
                    throw new Error(`Stock insuffisant pour le produit ${produit.nom}`);
                }
            }

            const createdVentesDetails = await Promise.all(products.map(async (produit) => {
                await db.Stock.create({
                    produitId: produit.produitId,
                    quantite: -1 * produit.quantite,
                    date_stock: new Date(),
                    type_mouvement: "SORTIE"
                }, { transaction });

                const produitCopie = { ...produit, dateVente: new Date() };

                const vente = await db.Vente.create(produitCopie, { transaction });

                const venteDetails = { ...produit, venteId: vente.id };

                return await db.Ventedetail.create(venteDetails, { transaction });
            }));

            await transaction.commit();

            return createdVentesDetails;

        } catch (error) {
            await transaction.rollback();
            throw error;
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

export default new VenteService();
