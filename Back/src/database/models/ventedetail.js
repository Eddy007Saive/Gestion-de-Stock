import { Model ,DataTypes} from "sequelize";
export default(sequelize ) => {
  class VenteDetail extends Model {

    static associate(models) {
        VenteDetail.belongsTo(models.Produit, { foreignKey: "produitId", as: "produit" });
        VenteDetail.belongsTo(models.Vente, { foreignKey: "venteId", as: "vente" });
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