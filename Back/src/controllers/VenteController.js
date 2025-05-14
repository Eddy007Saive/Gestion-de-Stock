import VenteService from "@/services/VenteService";

class VenteController {
    async getAll(req, res) {
        try {
            const ventes = await VenteService.getAllVentes();
            res.status(200).json(ventes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des ventes" });
        }
    }

    async create(req, res) {
        try {
            const created = await VenteService.createVentes(req.body);
            res.status(201).json({ message: "Ventes créées avec succès", data: created });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await VenteService.updateVente(req.params.id, req.body);
            res.json(updated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await VenteService.deleteVente(req.params.id);
            res.json({ message: "Vente supprimée avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new VenteController();
