'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      quantite: {
        allowNull: false,
        type: Sequelize.INTEGER

      },

      date_stock: {
        type: Sequelize.DATE,
        allowNull: false
      },

      type_mouvement: {
        type: Sequelize.ENUM('ENTRÉE', 'SORTIE', 'AJUSTEMENT'),
        allowNull: false
      },

      produitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Produits", key: "id" },
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
    await queryInterface.dropTable('Stocks');
  }
};