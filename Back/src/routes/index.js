import { Router } from 'express';
import produit from './produit.js';
import fournisseur from './fournisseur.js';
import vente from './vente.js';
import stock from './stock.js';
import categorie from './categorie.js';
const router = Router();
router.use("/", produit);
router.use("/", fournisseur);
router.use("/", vente);
router.use("/", stock);
router.use("/", categorie);

export default router;
