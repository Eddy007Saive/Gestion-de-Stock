import db from "@/database/models";
class ProduitController {

    async getAllProduits(req, res) {
        try {
            const Produits = await db.Produit.findAll({
                include: [
                    {
                        model: db.Stock,        
                        as: 'stock',      
                        required: false,    
                        attributes: ['quantite'],  
                    },
                ],
            });
            res.json(Produits);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des Produits" });
        }
    }

    async create(req, res) {
        const transaction = await db.sequelize.transaction();
        try {
            const imagePath = req.file ? req.file.path : null;
   
            if (!req.body.nom || !req.body.prix) {
                return res.status(400).json({ message: "Le nom et le prix sont obligatoires" });
            }
   
            const produit = await db.Produit.create(
                {
                    nom: req.body.nom,
                    prix: req.body.prix,
                    description: req.body.description || "",
                    image: imagePath,
                    qte: req.body.qte,
                    fournisseurId: req.body.fournisseurId
                },
                { transaction }
            );
   
            const quantiteInitiale = req.body.qte ? parseInt(req.body.qte, 10) : 0;
   
            await db.Stock.create(
                {
                    produitId: produit.id,
                    quantite: quantiteInitiale,
                    type:"Entree"
                },
                { transaction }
            );
   
            await transaction.commit();
   
            res.status(201).json({ message: "Produit créé avec succès", produit });
        } catch (error) {
            await transaction.rollback();
   
            if (error instanceof db.Sequelize.ValidationError) {
                return res.status(400).json({
                    message: "Erreur de validation",
                    errors: error.errors.map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }
   
            console.error("Erreur lors de la création du produit :", error);
            res.status(500).json({ message: "Erreur lors de la création du produit" });
        }
    }
   
    async update(req, res) {
        try {
            const produit = await db.Produit.findByPk(req.params.id);
            if (!produit) return res.status(404).json({ message: "Produit introuvable" });
            await produit.update(req.body);
            res.json(produit);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du Produit" });
        }
    }

    async delete(req, res) {
        try {
            const produit = await db.Produit.findByPk(req.params.id);
            if (!produit) return res.status(404).json({ message: "Produit introuvable" });
            await produit.destroy();
            res.json({ message: "Produit supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la suppression du Produit" });
        }
    }
}

export default new ProduitController();