import db from "@/database/models"; // Ajustez le chemin selon votre structure de dossiers

class CategorieController {
    async getAll(req, res) {
        try {
            const Categories = await db.Categorie.findAll();
            res.json(Categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des Categories" });
        }
    }

    async create(req, res) {
        try {
            const Categorie = await db.Categorie.create(req.body);
            res.json(Categorie);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la création du Categorie",error:error });
        }
    }

    async update(req, res) {
        try {
            const Categorie = await db.Categorie.findByPk(req.params.id);
            if (!Categorie) return res.status(404).json({ message: "Categorie introuvable" });
            await Categorie.update(req.body);
            res.json(Categorie);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du Categorie" });
        }
    }

    async delete(req, res) {
        try {
            const Categorie = await db.Categorie.findByPk(req.params.id);
            if (!Categorie) return res.status(404).json({ message: "Categorie introuvable" });
            await Categorie.destroy();
            res.json({ message: "Categorie supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la suppression du Categorie" });
        }
    }

    async getById(req, res) {
        try {
            const Categorie = await db.Categorie.findByPk(req.params.id);
            if (!Categorie) return res.status(404).json({ message: "Categorie introuvable" });
            res.json(Categorie);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération du Categorie" });
        }
    }
}

export default new CategorieController(); // Utilisation de export default pour exporter la classe
