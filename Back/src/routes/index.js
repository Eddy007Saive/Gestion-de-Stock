import { Router } from 'express';
import produit from './produit.js';
import fournisseur from './fournisseur.js';
import vente from './vente.js';
import stock from './stock.js';
import categorie from './categorie.js';
import achat from './achat.js';
import agent from './agent.js';

const router = Router();
router.use("/", produit);
router.use("/", fournisseur);
router.use("/", vente);
router.use("/", stock);
router.use("/", categorie);
router.use("/", achat);
router.use("/", agent);


export default router;
