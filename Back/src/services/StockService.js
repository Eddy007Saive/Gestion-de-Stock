import db from "../database/models";

class StockService {
  async getStock(produitId) {
    return await db.Stock.findOne({ where: { produitId } });
  }

  async getStockRestant(produitId) {
    const entrees = await db.Stock.sum('quantite', {
      where: { produitId, type_mouvement: 'ENTRÉE' },
    });

    const sorties = await db.Stock.sum('quantite', {
      where: { produitId, type_mouvement: 'SORTIE' },
    });

    if (!entrees && !sorties) return null;

    return entrees - Math.abs(sorties);
  }

  async createStock(produitId, quantiteInitiale) {
    const produit = await db.Produit.findByPk(produitId);
    if (!produit) return null;

    const stock = await db.Stock.create({
      produitId,
      quantite: quantiteInitiale,
      date_stock: new Date(),
      type_mouvement: "ENTRÉE",
    },);

    return stock;
  }

}

export default new StockService();
