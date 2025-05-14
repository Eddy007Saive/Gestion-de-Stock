import StockService from "@/services/StockService.js";

class StockController {
  async getStock(req, res) {
    try {
      const stock = await StockService.getStock(req.params.produitId);
      if (!stock) return res.status(404).json({ message: "Produit non trouvé en stock." });
      res.status(200).json({ stock: stock.quantite });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération du stock." });
    }
  }

  async getStockRestant(req, res) {
    try {
      const stockRestant = await StockService.getStockRestant(req.params.produitId);
      if (stockRestant === null) return res.status(404).json({ message: "Produit non trouvé en stock." });
      res.status(200).json({ stockRestant });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération du stock restant." });
    }
  }
}

export default new StockController();
