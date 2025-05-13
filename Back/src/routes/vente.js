import { Router } from 'express';
import VenteController from '@/controllers/VenteController.js';

const router = Router();

router.get("/Ventes", VenteController.getAllVentes);
router.post("/Vente/create", VenteController.create);

export default router;
