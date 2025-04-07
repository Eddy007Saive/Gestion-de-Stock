'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fournisseur extends Model {
  
    static associate(models) {
      Fournisseur.hasMany(models.Produit,{ foreignKey: "fournisseurId", as: "Produits" })
    }
  }
  Fournisseur.init({
    nom: DataTypes.STRING,
    contact: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Fournisseur',
  });
  return Fournisseur;
};