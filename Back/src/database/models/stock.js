// models/stock.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Stock extends Model {
    static associate(models) {
      Stock.belongsTo(models.Produit, {
        foreignKey: 'produitId',
        as: 'produit',
      });
    }
  }

  Stock.init(
    {
      quantite: DataTypes.INTEGER,
      produitId: DataTypes.INTEGER,
      type_mouvement: DataTypes.STRING,
      date_stock: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Stock',
    }
  );

  return Stock;
};
