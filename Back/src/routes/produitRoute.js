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

router.get("/produits", ProduitController.getAllProduits);
router.post("/produit/create", upload.single('image'), ProduitController.create);

export default router;
