'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Vente.associate = (models) => {
        Vente.hasMany(models.VenteDetail, { foreignKey: "venteId", as: "details" });
      };
    }
  }
  Vente.init({
    dateVente: DataTypes.DATE,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Vente',
  });
  return Vente;
};