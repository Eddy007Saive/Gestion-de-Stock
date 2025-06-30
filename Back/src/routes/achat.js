import { Router } from 'express';
import AchatController from '@/controllers/AchatController';


const router = Router();

router.get("/achats", AchatController.getAll);
router.post("/achats", AchatController.create);


export default router;
