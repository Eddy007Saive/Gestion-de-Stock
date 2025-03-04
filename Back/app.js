const express = require('express');
const cors = require('cors');
const app = express();

const venteRoute=require("./routes/venteRoute")
const produitRoute=require("./routes/produitRoute")
const fournisseurRoute=require("./routes/fournisseurRoute")


// Options CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Autorise seulement le frontend local
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Appliquer CORS avant les routes
app.use(cors(corsOptions));
app.options('*', cors()); // Gérer les requêtes OPTIONS

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/', fournisseurRoute);
app.use('/api/', produitRoute);
app.use('/api/', venteRoute);

// Test CORS sur la route principale
app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Forcer l’en-tête CORS
  res.send('Bienvenue sur mon serveur Express !');
});

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
