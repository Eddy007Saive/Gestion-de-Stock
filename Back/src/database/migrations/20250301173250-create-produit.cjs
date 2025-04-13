'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true

      },
      prix: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      image:{
        type:Sequelize.STRING,
        allowNull: false
      },
      fournisseurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Fournisseurs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      stockActuel: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      categorieId: {
        type: Sequelize.INTEGER,
        references: { model: "Categories", key: "id" },
        onUpdate: "CASCADE"
      },

      seuilAlerte: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },

      categorieId: {
        type: Sequelize.INTEGER,
        references: { model: "Categories", key: "id" },
        onUpdate: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Produits');
  }
};