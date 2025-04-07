import { Router } from 'express';
import fournisseurController from '@/controllers/fournisseurController.js';

const router = Router();

router.get("/fournisseurs", fournisseurController.getAllFournisseurs);
router.post("/fournisseur/create", fournisseurController.create);

export default router;
