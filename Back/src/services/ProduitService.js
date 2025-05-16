import db from "@/database/models";

class ProduitService {
    async getAllProduits() {
        return await db.Produit.findAll({
            include: [
                {
                    model: db.Categorie,
                    as: 'categorie',
                    required: false,
                    attributes: ['nom'],
                }
                ,
                {
                    model: db.Fournisseur,
                    as: 'fournisseur',
                    required: false,
                    attributes: ['nom'],
                },
                {
                    model: db.Stock,
                    as: 'stock',
                    required: false,
                    attributes: [],
                }
            ],
            attributes: [
                'id',
                'nom',
                'description',
                'prix',
                'image',
                'categorieId',
                'fournisseurId',
                'seuilAlerte',
                [db.Sequelize.fn('SUM', db.Sequelize.col('stock.quantite')), 'totalQuantite']
            ],
            group: ['Produit.id', 'categorie.id', 'fournisseur.id']
            
        });
    }


    async createProduit(data, imagePath, transaction) {
        const produit = await db.Produit.create({
            nom: data.nom,
            prix: data.prix,
            description: data.description || "",
            image: imagePath,
            qte: data.qte,
            fournisseurId: data.fournisseurId,
            categorieId: data.categorieId
        }, { transaction });

        const quantiteInitiale = data.qte ? parseInt(data.qte, 10) : 0;

        await db.Stock.create({
            produitId: produit.id,
            quantite: quantiteInitiale,
            date_stock: new Date(),
            type: "ENTRÉE"
        }, { transaction });

        return produit;
    }

    async getProduitById(id) {
        return await db.Produit.findByPk(id, {
            include: [
                {
                    model: db.Stock,
                    as: 'stock',
                    required: false,
                    attributes: [],
                },
                {
                    model: db.Categorie,
                    as: 'categorie',
                    required: false,
                    attributes: ['nom'],
                },
                {
                    model: db.Fournisseur,
                    as: 'fournisseur',
                    required: false,
                    attributes: ['nom'],
                },
            ],

            attributes: [
                'id',
                'nom',
                'description',
                'prix',
                'image',
                'categorieId',
                'fournisseurId',
                'seuilAlerte',
                [db.Sequelize.fn('SUM', db.Sequelize.col('stock.quantite')), 'totalQuantite']
            ],
            group: ['Produit.id', 'categorie.id', 'fournisseur.id']
        });
    }

    async updateProduit(id, data) {
        const produit = await db.Produit.findByPk(id);
        if (!produit) return null;
        await produit.update(data);
        return produit;
    }

    async deleteProduit(id) {
        const produit = await db.Produit.findByPk(id);
        if (!produit) return null;
        await produit.destroy();
        return true;
    }
}

export default new ProduitService();
