import { Router } from 'express';
import fournisseurController from '@/controllers/fournisseurController.js';

const router = Router();

router.get("/fournisseurs", fournisseurController.getAll);
router.post("/fournisseurs", fournisseurController.create);
router.get("/fournisseurs/:id", fournisseurController.getById);
router.put("/fournisseurs/:id", fournisseurController.update);
router.delete("/fournisseurs/:id", fournisseurController.delete);

export default router;
