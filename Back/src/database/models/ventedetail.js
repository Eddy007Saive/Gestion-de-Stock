'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VenteDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VenteDetail.associate = (models) => {
        VenteDetail.belongsTo(models.Produit, { foreignKey: "produitId", as: "produit" });
        VenteDetail.belongsTo(models.Vente, { foreignKey: "venteId", as: "vente" });
      };
    }
  }
  VenteDetail.init({
    quantite: DataTypes.INTEGER,
    prixUnitaire: DataTypes.FLOAT,
    produitId: DataTypes.INTEGER,
    venteId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'VenteDetail',
  });
  return VenteDetail;
};