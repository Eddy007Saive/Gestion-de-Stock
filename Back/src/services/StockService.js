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

    if (!entrees && !sorties) {
      throw new Error(`Produit non trouvé en stock`);
    }

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

     /**
     * Crée ou met à jour plusieurs un stock 
     * @param {int} produitId - identifiant du produit
     * @param {int} qte - quantité à ajouter
     * @param {object} transaction - transaction Sequelize
     * @returns {void} Résultats de l insertion
     */
  async createOrUpdateStock(produitId, qte, transaction) {
    const stock = await db.Stock.findOne({ where: { produitId }, transaction });

    if (stock) {
      const newQuantity = (Number(qte) || 0) + (Number(stock.quantite) || 0);
      await stock.update({
        quantite: newQuantity,
        date_stock: new Date(),
        type_mouvement: "ENTREE"
      }, { transaction });
    } else {
      await db.Stock.create({
        produitId,
        quantite: qte,
        date_stock: new Date(),
        type_mouvement: "ENTREE"
      }, { transaction });
    }
  }

}

export default new StockService();
