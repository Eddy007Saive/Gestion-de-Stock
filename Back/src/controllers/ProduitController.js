import ProduitService from "@/services/ProduitService.js";
import db from "@/database/models";

class ProduitController {
    async getAll(req, res) {
        try {
            // Récupération des paramètres de pagination depuis la requête
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const sortBy = req.query.sortBy || 'id';
            const sortOrder = req.query.sortOrder || 'ASC';
            // Appel du service avec les paramètres de pagination
            const result = await ProduitService.getAllProduits({
                page,
                limit,
                search,
                sortBy,
                sortOrder
            });

            res.json({
                produits: result.rows,
                totalItems: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: page
            });
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

            const produit = await ProduitService.createProduit(req.body, imagePath, transaction);
            await transaction.commit();
            res.status(201).json({ message: "Produit créé avec succès", produit });
        } catch (error) {
            await transaction.rollback();

            if (error instanceof db.Sequelize.ValidationError) {
                console.error("Erreur de validation :", error);
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
            const produit = await ProduitService.updateProduit(req.params.id, req.body);
            if (!produit) return res.status(404).json({ message: "Produit introuvable" });
            res.json(produit);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du Produit" });
        }
    }

    async getById(req, res) {
        try {
            const produit = await ProduitService.getProduitById(req.params.id);
            if (!produit) return res.status(404).json({ message: "Produit introuvable" });
            res.json(produit);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération du Produit" });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await ProduitService.deleteProduit(req.params.id);
            if (!deleted) return res.status(404).json({ message: "Produit introuvable" });
            res.json({ message: "Produit supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la suppression du Produit" });
        }
    }

    async importCsvOrXlsx(req, res) {
        const transaction = await db.sequelize.transaction();

        try {
            const file = req.file;
             const mapping = req.body.mapping ? JSON.parse(req.body.mapping) : null;
            if (!file) {
                return res.status(400).json({ message: "Aucun fichier fourni" });
            }
            const result = await ProduitService.importCsvOrXlsx(file,mapping,transaction);
            transaction.commit();
            res.status(201).json({ message: "Produits importés avec succès", result });
        } catch (error) {
            transaction.rollback();
            console.error(error);
            res.status(500).json({ message: "Erreur lors de l'importation des Produits" });
        }
    }
}

export default new ProduitController();
