import AchatService from "@/services/AchatService";

class AchatController {
    async getAll(req, res) {
        try {
            const ventes = await AchatService.getAllAchat();
            res.status(200).json(ventes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des achats" });
        }
    }

    async create(req, res) {
        try {
            const created = await AchatService.createAchat(req.body);
            res.status(201).json({ message: "Ventes créées avec succès", data: created });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

  
}

export default new AchatController();
