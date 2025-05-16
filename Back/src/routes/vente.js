import { Router } from 'express';
import VenteController from '@/controllers/VenteController.js';

const router = Router();

router.get("/ventes", VenteController.getAll);
router.post("/ventes", VenteController.create);


export default router;
