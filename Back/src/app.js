import express from 'express';
import cors from 'cors';

import venteRoute from '@/routes/venteRoute.js';
import produitRoute from '@/routes/produitRoute.js';
import fournisseurRoute from '@/routes/fournisseurRoute.js';
import stockRoute from '@/routes/stockRoute.js';

const app = express();

// CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/', fournisseurRoute);
app.use('/api/', produitRoute);
app.use('/api/', venteRoute);
app.use('/api/', stockRoute);

// Test route
app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send('Bienvenue sur mon serveur Express !');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
