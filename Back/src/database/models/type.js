import { Model ,DataTypes} from "sequelize";
export default (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Type.init({
    type: DataTypes.STRING,
    desription: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Type',
  });
  return Type;
};