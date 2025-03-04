const express = require("express");
const router = express.Router();
const fournisseurController = require("../controllers/fournisseurController");

router.get("/fournisseurs", fournisseurController.getAllFournisseurs);
router.post("/fournisseur/create", fournisseurController.create);

module.exports = router;
