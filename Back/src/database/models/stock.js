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
      quantite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        }
      },
      produitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Produits',
          key: 'id'
        }
      },
      type_mouvement: {
        type: DataTypes.ENUM('ENTREE', 'SORTIE'),
        allowNull: false,
        defaultValue: 'ENTREE'
      },
      date_stock: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Stock',
    }
  );

  return Stock;
};
