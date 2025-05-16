import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Fournisseur extends Model {
    static associate(models) {
      // Un fournisseur peut faire plusieurs approvisionnements
      Fournisseur.hasMany(models.Approvisionnement, {
        foreignKey: 'fournisseurId',
        as: 'approvisionnements'
      });
    }
  }

  Fournisseur.init(
    {
      nom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Fournisseur'
    }
  );

  return Fournisseur;
};
