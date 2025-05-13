import db from "@/database/models"; // Ajustez le chemin selon votre structure de dossiers

class FournisseurController {
    async getAll(req, res) {
        try {
            const fournisseurs = await db.Fournisseur.findAll();
            res.json(fournisseurs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des fournisseurs" });
        }
    }

    async create(req, res) {
        try {
            const fournisseur = await db.Fournisseur.create(req.body);
            res.json(fournisseur);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la création du fournisseur",error:error });
        }
    }

    async getById(req, res) {
        try {
            const fournisseur = await db.Fournisseur.findByPk(req.params.id);
            if (!fournisseur) return res.status(404).json({ message: "Fournisseur introuvable" });
            res.json(fournisseur);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération du fournisseur" });
        }
    }

    async update(req, res) {
        try {
            const fournisseur = await db.Fournisseur.findByPk(req.params.id);
            if (!fournisseur) return res.status(404).json({ message: "Fournisseur introuvable" });
            await fournisseur.update(req.body);
            res.json(fournisseur);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du fournisseur" });
        }
    }

    async delete(req, res) {
        try {
            const fournisseur = await db.Fournisseur.findByPk(req.params.id);
            if (!fournisseur) return res.status(404).json({ message: "Fournisseur introuvable" });
            await fournisseur.destroy();
            res.json({ message: "Fournisseur supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la suppression du fournisseur" });
        }
    }
}

export default new FournisseurController(); // Utilisation de export default pour exporter la classe
