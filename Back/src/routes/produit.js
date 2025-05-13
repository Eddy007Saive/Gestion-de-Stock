import { Router } from 'express';
import multer from 'multer';
import ProduitController from '@/controllers/ProduitController.js';

const router = Router();

// Configurer multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

router.get("/produits", ProduitController.getAll);
router.post("/produits", upload.single('image'), ProduitController.create);
router.get("/produits/:id", ProduitController.getById);
router.put("/produits/:id", upload.single('image'), ProduitController.update);
router.delete("/produits/:id", ProduitController.delete);

export default router;
