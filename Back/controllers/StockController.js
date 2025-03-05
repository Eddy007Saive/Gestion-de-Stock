const { where } = require("sequelize");
const { Stock } = require("../models");

class StockController{
    async getStock(req,res){
        const {productI}=req.body
        let stock = await Stock.findOne({ where: { produitId: productI } });
        return res.status(200).json({ stock: stock.quantite });
    }
}

module.exports=new StockController();