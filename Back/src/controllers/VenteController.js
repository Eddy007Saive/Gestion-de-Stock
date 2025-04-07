// import { Vente, VenteDetail, Stock } from "@/database/models"; // Utilisation des imports ES6

class VenteController {
    async getAllVentes(req, res) {
        try {
            const Ventes = await Vente.findAll();
            res.json(Ventes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des Ventes" });
        }
    }

    async create(req, res) {
        try {
            const products = req.body; // Assurez-vous que les produits arrivent en tableau dans le corps de la requête
            
            // Utilisation de Promise.all pour gérer les mises à jour asynchrones plus proprement
            await Promise.all(products.map(async (element) => {
                
                // Recherche du stock du produit
                const stock = await Stock.findOne({ where: { produitId: element.produitId } });

                if (!stock) {
                    throw new Error(`Produit ${element.produitId} non trouvé en stock.`);
                }

                // Calcul de la nouvelle quantité après vente
                const newQte = stock.quantite - element.quantite;

                // Mise à jour du stock
                await stock.update({ quantite: newQte });

                // Insertion de la vente dans la table des ventes
                const vente = await Vente.create(element);

                // Ajout de l'ID de la vente au détail de la vente
                const venteDetails = { ...element, venteId: vente.id };

                // Insertion des détails de la vente dans la table des détails
                await VenteDetail.create(venteDetails);
            }));

            // Réponse de succès
            res.json({ message: "Ventes créées avec succès" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message || "Erreur lors de la création des ventes" });
        }
    }

    async update(req, res) {
        try {
            const vente = await Vente.findByPk(req.params.id);

            if (!vente) {
                return res.status(404).json({ message: "Vente introuvable" });
            }

            await vente.update(req.body);
            res.json(vente);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour de la vente" });
        }
    }

    async delete(req, res) {
        try {
            const vente = await Vente.findByPk(req.params.id);

            if (!vente) {
                return res.status(404).json({ message: "Vente introuvable" });
            }

            await vente.destroy();
            res.json({ message: "Vente supprimée avec succès" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la suppression de la vente" });
        }
    }
}

export default new VenteController(); // Utilisation de export default pour exporter la classe
