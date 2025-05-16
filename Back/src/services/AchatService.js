import db from "@/database/models";
import StockService from "@/services/StockService";

class AchatService {
    async getAllAchat() {
        return await db.Approvisionnement.findAll({
            include: [
                {
                    model: db.Fournisseur,
                    as: 'fournisseur'
                },
                {
                    model: db.ApprovisionnementProduit,
                    as: 'lignes',
                    include: [
                        {
                            model: db.Produit,
                            as: 'produit',
                            include: [
                                {
                                    model: db.Categorie,
                                    as: 'categorie'
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
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
                  produitId:product.produitId,
                  quantite: product.quantite,
                  date_stock: new Date(),
                  type_mouvement: "ENTRÉE",
                },{transaction});

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
