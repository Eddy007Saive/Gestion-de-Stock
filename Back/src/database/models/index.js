import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import process from 'process';
import Produit from '@/database/models/produit.js';
import Stock from '@/database/models/stock.js';
import Fournisseur from '@/database/models/fournisseur.js'; // Ajoute les autres modèles ici si nécessaire

// Utilisation de import.meta.url pour obtenir le répertoire du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const rootDir = path.resolve(__dirname, '..'); // On part de la racine du projet
const config = require(path.join(rootDir, 'src/config/config.json'))[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Ajout des modèles dans l'objet db
db.Produit = Produit(sequelize, Sequelize.DataTypes);
db.Stock = Stock(sequelize, Sequelize.DataTypes);
db.Fournisseur = Fournisseur(sequelize, Sequelize.DataTypes);

// Gestion des associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log("Clés dans db après chargement des modèles :", Object.keys(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
