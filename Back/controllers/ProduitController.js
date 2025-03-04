const { Produit } = require("../models");
const {Stock}=require("../models")
const sequelize = require('../models').sequelize
const { ValidationError } = require("sequelize"); 

class ProduitController{
    async getAllProduits(req, res){
        try {
            const Produits = await Produit.findAll({
                include: [
                    {
                        model: Stock,        
                        as: 'stock',       
                        required: false,    
                        attributes: ['quantite'],  
                    },
                ],
            });
            res.json(Produits);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des Produits" });
        }
    }

    async create(req, res) {
        const transaction = await sequelize.transaction(); // Début de transaction
        try {
            const imagePath = req.file ? req.file.path : null;
    
            // Vérifier si des champs obligatoires sont manquants
            if (!req.body.nom || !req.body.prix) {
                return res.status(400).json({ message: "Le nom et le prix sont obligatoires" });
            }
    
            // Création du produit avec une transaction
            const produit = await Produit.create(
                {
                    nom: req.body.nom,
                    prix: req.body.prix,
                    description: req.body.description || "", // Gérer une description optionnelle
                    image: imagePath,
                    qte: req.body.qte,
                    fournisseurId: req.body.fournisseurId
                },
                { transaction }
            );
    
            // Initialiser le stock avec la quantité fournie ou 0 par défaut
            const quantiteInitiale = req.body.qte ? parseInt(req.body.qte, 10) : 0;
    
            await Stock.create(
                {
                    produitId: produit.id,
                    quantite: quantiteInitiale
                },
                { transaction }
            );
    
            await transaction.commit(); // Valider la transaction
    
            res.status(201).json({ message: "Produit créé avec succès", produit });
        } catch (error) {
            await transaction.rollback(); // Annuler en cas d'erreur
    
            if (error instanceof ValidationError) {
                return res.status(400).json({ 
                    message: "Erreur de validation", 
                    errors: error.errors.map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }
    
            // 🛑 Autres erreurs
            console.error("Erreur lors de la création du produit :", error);
            res.status(500).json({ message: "Erreur lors de la création du produit" });
        }
    }
    


    async update(req, res){
        try {
            const Produit = await Produit.findByPk(req.params.id);
            if (!Produit) return res.status(404).json({ message: "Produit introuvable" });
            await Produit.update(req.body);
            res.json(Produit);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du Produit" });
        }
    }

    async delete(req, res){
        try {
            const Produit = await Produit.findByPk(req.params.id);
            if (!Produit) return res.status(404).json({ message: "Produit introuvable" });
            await Produit.destroy();
            res.json({ message: "Produit supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la suppression du Produit" });
        }
    }
}

module.exports=new ProduitController();