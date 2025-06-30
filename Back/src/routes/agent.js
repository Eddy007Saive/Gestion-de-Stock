import { Router } from 'express';
import AgentController from '@/controllers/AgentController';


const router = Router();

router.post("/agent", AgentController.askAI);


export default router;
