const { Vente } = require("../models");

class VenteController{
    async getAllVentes(req, res){
        try {
            const Ventes = await Vente.findAll();
            res.json(Ventes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des Ventes" });
        }
    }

    async create(req,res){
        try {
            const Vente=await Vente.create(req.body)
            res.json(Vente)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des Ventes" });
        }
    }


    async update(req, res){
        try {
            const Vente = await Vente.findByPk(req.params.id);
            if (!Vente) return res.status(404).json({ message: "Vente introuvable" });
            await Vente.update(req.body);
            res.json(Vente);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du Vente" });
        }
    }

    async delete(req, res){
        try {
            const Vente = await Vente.findByPk(req.params.id);
            if (!Vente) return res.status(404).json({ message: "Vente introuvable" });
            await Vente.destroy();
            res.json({ message: "Vente supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la suppression du Vente" });
        }
    }
}

module.exports=new VenteController();