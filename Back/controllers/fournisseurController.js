const { Fournisseur } = require("../models");

class fournisseurController{
    async getAllFournisseurs(req, res){
        try {
            const fournisseurs = await Fournisseur.findAll();
            res.json(fournisseurs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des fournisseurs" });
        }
    }

    async create(req,res){
        try {
            const fournisseur=await Fournisseur.create(req.body)
            res.json(fournisseur)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des fournisseurs" });
        }
    }


    async update(req, res){
        try {
            const fournisseur = await Fournisseur.findByPk(req.params.id);
            if (!fournisseur) return res.status(404).json({ message: "Fournisseur introuvable" });
            await fournisseur.update(req.body);
            res.json(fournisseur);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du fournisseur" });
        }
    }

    async delete(req, res){
        try {
            const fournisseur = await Fournisseur.findByPk(req.params.id);
            if (!fournisseur) return res.status(404).json({ message: "Fournisseur introuvable" });
            await fournisseur.destroy();
            res.json({ message: "Fournisseur supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la suppression du fournisseur" });
        }
    }
}

module.exports=new fournisseurController();