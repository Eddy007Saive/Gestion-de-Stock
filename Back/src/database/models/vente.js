import { Model ,DataTypes} from "sequelize";
export default(sequelize) => {
  class Vente extends Model {

    static associate(models) {
        // Vente.hasMany(models.VenteDetail, { foreignKey: "venteId", as: "details" });
        Vente.hasMany(models.Ventedetail, {
            foreignKey: "venteId",
            as: "ventedetails",
            onDelete: "CASCADE", // Supprime les détails de la vente si la vente est supprimée
        });
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