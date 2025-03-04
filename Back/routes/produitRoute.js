const express = require("express");
const router = express.Router();
const ProduitController = require("../controllers/ProduitController");
const multer =require('multer')
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


router.get("/produits",ProduitController.getAllProduits);
router.post("/produit/create", upload.single('image'), ProduitController.create);

module.exports = router;
