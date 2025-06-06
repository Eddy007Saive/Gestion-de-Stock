import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Produit extends Model {
    static associate(models) {
      // Relation avec le stock
      Produit.hasOne(models.Stock, {
        foreignKey: 'produitId',
        as: 'stock',
      });

      // Relation avec la catégorie
      Produit.belongsTo(models.Categorie, {
        foreignKey: 'categorieId',
        as: 'categorie',
      });

      // Historique des approvisionnements
      Produit.hasMany(models.ApprovisionnementProduit, {
        foreignKey: 'produitId',
        as: 'approvisionnements'
      });
    }
  }

  Produit.init(
    {
      seuilAlerte: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Le produit existe déjà',
        },
        validate: {
          notEmpty: {
            msg: 'Le nom du produit ne peut pas être vide',
          },
          len: {
            args: [3, 100],
            msg: 'Le nom du produit doit avoir entre 3 et 100 caractères',
          },
        },
      },

      prix: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Le prix doit être un nombre entier',
          },
          min: {
            args: [1],
            msg: 'Le prix doit être positif',
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La description ne peut pas être vide',
          },
          len: {
            args: [10, 500],
            msg: 'La description doit avoir entre 10 et 500 caractères',
          },
        },
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      categorieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Produit',
      hooks: {
        beforeSave: (produit) => {
          produit.nom = produit.nom.toUpperCase(); // Nom en majuscules avant sauvegarde
        },
      },
    }
  );

  return Produit;
};
