import { Router } from 'express';
import multer from 'multer';
import ProduitController from '@/controllers/ProduitController.js';

const router = Router();

// Configurer multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
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
router.post("/produits/upload", upload.single('file'), ProduitController.importCsvOrXlsx);

export default router;
