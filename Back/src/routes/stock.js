import { Router } from 'express';
import StockController from '@/controllers/StockController.js';

const router = Router();
router.get("/stocks/:produitId", StockController.getStockRestant);
router.post("/stocks", StockController.createStock);

export default router;
