import { Model, DataTypes } from 'sequelize';
export default(sequelize) => {
  class Categorie extends Model {

    static associate(models) {
      Categorie.hasMany(models.Produit,{
        foreignKey:"categorieId"
      })
    }
  }
  Categorie.init({
    nom: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:{
        args:true,
        msg:"La catégorie existe déja"
      }
    },
    description: {
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'Categorie',
  });
  return Categorie;
};