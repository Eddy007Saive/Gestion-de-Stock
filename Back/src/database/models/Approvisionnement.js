import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Approvisionnement extends Model {
    static associate(models) {
      Approvisionnement.belongsTo(models.Fournisseur, {
        foreignKey: 'fournisseurId',
        as: 'fournisseur',
      });

      Approvisionnement.hasMany(models.ApprovisionnementProduit, {
        foreignKey: 'approvisionnementId',
        as: 'lignes',
      });
    }
  }

  Approvisionnement.init(
    {
      date: DataTypes.DATE,
      fournisseurId: DataTypes.INTEGER,
      remarque: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Approvisionnement',
    }
  );

  return Approvisionnement;
};
