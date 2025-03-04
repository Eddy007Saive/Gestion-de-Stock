'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Produit.belongsTo(models.Fournisseur, { foreignKey: "fournisseurId", as: "fournisseur" });
      Produit.hasOne(models.Stock, { foreignKey: "produitId", as: "stock" });
    }
  }
  Produit.init( {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:{
        args:true,
        message:"Le produit existe deja"
      }, 
      validate: {
        notEmpty: {
          msg: 'Le nom du produit ne peut pas être vide'
        },
        len: {
          args: [3, 100], // Le nom doit être entre 3 et 100 caractères
          msg: 'Le nom du produit doit avoir entre 3 et 100 caractères'
        }
      }
    },
    prix: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Le prix doit être un nombre entier'
        },
        min: {
          args: [1], // Le prix doit être supérieur à 0
          msg: 'Le prix doit être positif'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La description ne peut pas être vide'
        },
        len: {
          args: [10, 500], // La description doit avoir entre 10 et 500 caractères
          msg: 'La description doit avoir entre 10 et 500 caractères'
        }
      }
    },
    fournisseurId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Le fournisseurId doit être un nombre entier'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // L'image peut être optionnelle
    }
  }, {
    sequelize,
    modelName: 'Produit',
    hooks: {
      beforeSave: (produit) => {
        // Convertir le nom en minuscule avant de sauvegarder
        produit.nom = produit.nom.toUpperCase();
      }
    }
  });
  return Produit;
};