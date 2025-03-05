const express = require("express");
const router = express.Router();
const StockController = require("../controllers/StockController");


router.post("/Stock",StockController.getStock);

module.exports = router;
