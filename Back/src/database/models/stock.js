'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stock.associate = (models) => {
        Stock.belongsTo(models.Produit, { foreignKey: "produitId", as: "produit" });
      };
    }
  }
  Stock.init({
    quantite: DataTypes.INTEGER,
    produitId: DataTypes.INTEGER,
    type_mouvement :DataTypes.STRING,
    date_stock:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};