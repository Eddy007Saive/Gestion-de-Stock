import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class ApprovisionnementProduit extends Model {
    static associate(models) {
      ApprovisionnementProduit.belongsTo(models.Approvisionnement, {
        foreignKey: 'approvisionnementId',
        as: 'approvisionnement',
      });

      ApprovisionnementProduit.belongsTo(models.Produit, {
        foreignKey: 'produitId',
        as: 'produit',
      });
    }
  }

  ApprovisionnementProduit.init(
    {
      approvisionnementId: DataTypes.INTEGER,
      produitId: DataTypes.INTEGER,
      quantite: DataTypes.INTEGER,
      prix_unitaire: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'ApprovisionnementProduit',
    }
  );

  return ApprovisionnementProduit;
};
