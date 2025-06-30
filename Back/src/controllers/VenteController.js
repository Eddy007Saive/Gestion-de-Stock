import VenteService from "@/services/VenteService";

class VenteController {
    async getAll(req, res) {
        try {

             // Récupération des paramètres de pagination depuis la requête
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const sortBy = req.query.sortBy || 'id';
            const sortOrder = req.query.sortOrder || 'ASC';

            // Appel du service avec les paramètres de pagination
            const result = await VenteService.getAllVentes({
                page,
                limit,
                search,
                sortBy,
                sortOrder
            });


            res.status(200).json({
                ventes: result.rows,
                totalItems: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: page
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des ventes" });
        }
    }

    async create(req, res) {
        try {
            const pdf = await VenteService.createVentes(req.body,res);
             // Renvoyer le PDF en réponse HTTP
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition':`attachment; filename=facture.pdf`,
                'Content-Length':pdf.length

            })
            res.end(pdf);

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
