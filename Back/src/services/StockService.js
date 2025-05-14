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
}

export default new StockService();
