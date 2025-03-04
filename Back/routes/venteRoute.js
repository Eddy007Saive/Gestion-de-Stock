const express = require("express");
const router = express.Router();
const VenteController = require("../controllers/VenteController");

router.get("/Ventes", VenteController.getAllVentes);
router.post("/Vente/create", VenteController.create);

module.exports = router;
