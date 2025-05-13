import { Router } from 'express';
import CategorieController from '@/controllers/categorieController';

const router = Router();

router.get("/categories", CategorieController.getAll);
router.post("/categories", CategorieController.create);
router.get("/categories/:id", CategorieController.getById);
router.put("/categories/:id", CategorieController.update);
router.delete("/categories/:id", CategorieController.delete);

export default router;
