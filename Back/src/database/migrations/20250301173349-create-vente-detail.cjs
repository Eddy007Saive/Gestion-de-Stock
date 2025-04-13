'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VenteDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantite: {
        type: Sequelize.INTEGER
      },
      prixUnitaire: {
        type: Sequelize.FLOAT
      },
      produitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Produits", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      venteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Ventes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable('VenteDetails');
  }
};