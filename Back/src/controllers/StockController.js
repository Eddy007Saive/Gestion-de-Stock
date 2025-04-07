// import { Stock } from "../database/models";

class StockController {
  async getStock(req, res) {
    const { produitId } = req.params; // Utiliser les paramètres de l'URL (notamment pour RESTful)

    try {
      const stock = await Stock.findOne({ where: { produitId } });

      // Vérifier si le produit existe en stock
      if (!stock) {
        return res.status(404).json({ message: "Produit non trouvé en stock." });
      }

      return res.status(200).json({ stock: stock.quantite });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la récupération du stock." });
    }
  }
}

export default new StockController();
