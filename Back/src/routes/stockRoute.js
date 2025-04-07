import { Router } from 'express';
import StockController from '@/controllers/StockController.js';

const router = Router();
router.post("/Stock",StockController.getStock);

export default router;
