import db from "@/database/models";
import { error, log } from "console";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import sequelize from 'sequelize';
import StockService from "./StockService";


class ProduitService {
    async getAllProduits(options = {}) {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'ASC' } = options;

        // Calcul de l'offset pour la pagination
        const offset = (page - 1) * limit;

        // Configuration des options de recherche
        const whereClause = search
            ? {
                [Op.or]: [
                    { nom: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        // Validation des paramètres de tri pour éviter les injections SQL
        const validSortColumns = ['id', 'nom', 'prix', 'seuilAlerte', 'totalQuantite', 'createdAt', 'updatedAt'];
        const validSortOrders = ['ASC', 'DESC'];

        const orderBy = validSortColumns.includes(sortBy) ? sortBy : 'id';
        const orderDirection = validSortOrders.includes(sortOrder) ? sortOrder : 'ASC';

        // Configuration des options pour findAndCountAll
        const queryOptions = {
            where: whereClause,
            include: [
                {
                    model: db.Categorie,
                    as: 'categorie',
                    required: false,
                    attributes: ['nom'],
                },
                {
                    model: db.Stock,
                    as: 'stock',
                    required: false,
                    attributes: [],
                }
            ],
            attributes: [
                'id',
                'nom',
                'description',
                'prix',
                'image',
                'categorieId',
                'seuilAlerte',
                [db.Sequelize.fn('SUM', db.Sequelize.col('stock.quantite')), 'totalQuantite']
            ],
            group: ['Produit.id', 'categorie.id'],
            order: [[orderBy === 'totalQuantite' ? db.Sequelize.literal('totalQuantite') : orderBy, orderDirection]],
            distinct: true,
            subQuery: false
        };

        // Ajout des options de pagination
        if (limit > 0) {
            queryOptions.limit = limit;
            queryOptions.offset = offset;
        }

        // Exécution de la requête avec findAndCountAll
        const result = await db.Produit.findAndCountAll(queryOptions);

        // Ajustement du count car avec le group by, count est un tableau d'objets
        const count = Array.isArray(result.count) ? result.count.length : result.count;

        return {
            rows: result.rows,
            count: count
        };
    }


    async createProduit(data, imagePath, transaction) {
        const produit = await db.Produit.create({
            nom: data.nom,
            prix: data.prix,
            description: data.description || "",
            image: imagePath,
            qte: data.qte,
            seuilAlerte: data.seuilAlerte,
            categorieId: data.categorieId
        }, { transaction });

        const quantiteInitiale = data.qte ? parseInt(data.qte, 10) : 0;

        if (quantiteInitiale > 0) {
            StockService.createOrUpdateStock(produit.id, quantiteInitiale, transaction);
            const approvisionnement = await db.Approvisionnement.create({
                date: new Date(),
                fournisseurId: data.fournisseurId,
            }, { transaction });

            await db.ApprovisionnementProduit.create({
                produitId: produit.id,
                quantite: quantiteInitiale,
                approvisionnementId: approvisionnement.id,
                prix_unitaire: data.prix
            }, { transaction });
        }

        return produit;
    }

    async getProduitById(id) {
        return await db.Produit.findByPk(id, {
            include: [
                {
                    model: db.Stock,
                    as: 'stock',
                    required: false,
                    attributes: [],
                },
                {
                    model: db.Categorie,
                    as: 'categorie',
                    required: false,
                    attributes: ['nom'],
                }
            ],

            attributes: [
                'id',
                'nom',
                'description',
                'prix',
                'image',
                'categorieId',
                'seuilAlerte',
                [db.Sequelize.fn('SUM', db.Sequelize.col('stock.quantite')), 'totalQuantite']
            ],
            group: ['Produit.id', 'categorie.id']
        });
    }

    async updateProduit(id, data) {
        const produit = await db.Produit.findByPk(id);
        if (!produit) return null;
        await produit.update(data);
        return produit;
    }

    async deleteProduit(id) {
        const produit = await db.Produit.findByPk(id);
        if (!produit) return null;
        await produit.destroy();
        return true;
    }


    /**
     * Importe des produits à partir d'un fichier CSV ou XLSX
     * @param {Object} file - Le fichier uploadé via multer
     * @param {Object} mapping - Mapping des colonnes du fichier vers les champs du modèle
     * @returns {Promise<Array>} Liste des produits importés
     */
    async importCsvOrXlsx(file, mapping = null, transaction) {
        try {
            // Déterminer le type de fichier
            const fileExtension = path.extname(file.originalname).toLowerCase();
            let data = [];

            if (fileExtension === '.csv') {
                // Traiter le fichier CSV
                // data = await this.parseCSV(file.path);
            } else if (['.xlsx', '.xls'].includes(fileExtension)) {
                // Traiter le fichier Excel
                data = await this.parseExcel(file.path);
            } else {
                throw new Error('Format de fichier non supporté. Utilisez CSV, XLS ou XLSX.');
            }


            // Si pas de données à importer
            if (!data || data.length === 0) {
                throw new Error('Aucune donnée trouvée dans le fichier.');
            }

            // Traiter le mapping si fourni
            if (mapping) {
                data = await this.applyMapping(data, mapping);
            }

            // Valider les données
            const validatedData = await this.validateProductData(data);
            console.log("Données validées:", validatedData);
            // Importer les produits en base de données
            const importedProducts = await this.createManyProducts(validatedData, transaction);

            // Optionnel: Supprimer le fichier temporaire après traitement
            fs.unlinkSync(file.path);

            return importedProducts;
        } catch (error) {
            // Supprimer le fichier temporaire en cas d'erreur également
            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }

    /**
     * Parse un fichier CSV
     * @param {string} filePath - Chemin vers le fichier CSV
     * @returns {Promise<Array>} Données du CSV sous forme d'objets
     */
    parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];

            fs.createReadStream(filePath)
                .pipe(csv({
                    skipLines: 0,
                    headers: true,
                    trim: true
                }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    /**
     * Parse un fichier Excel
     * @param {string} filePath - Chemin vers le fichier Excel
     * @returns {Array} Données de l'Excel sous forme d'objets
     */
    async parseExcel(filePath) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir la feuille en JSON
        return  XLSX.utils.sheet_to_json(worksheet, { defval: null, raw: false });
    }

    /**
     * Applique le mapping des colonnes aux données
     * @param {Array} data - Données brutes du fichier
     * @param {Object} mapping - Correspondance entre les colonnes du fichier et les champs de l'application
     * @returns {Array} Données transformées selon le mapping
     */
    async applyMapping(data, mapping) {
        return data.map(row => {
            const newRow = {};

            // Pour chaque champ de notre modèle, prendre la valeur de la colonne correspondante
            for (const [field, column] of Object.entries(mapping)) {
                if (column && row[column] !== undefined) {
                    newRow[field] = row[column];
                }
            }

            return newRow;
        });
    }

    /**
     * Valide les données des produits avant importation
     * @returns {Promise<Array>} Données validées et nettoyées
     */
    async validateProductData(data) {
        const validatedData = [];
        const errors = [];

        console.log(data, "ato am validate data");


        // Récupérer les IDs valides des fournisseurs et catégories pour la validation
        const categorieIds = (await db.Categorie.findAll()).map(c => c.id.toString());

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNum = i + 2; // +2 car la ligne 1 est l'en-tête
            const product = {};

            // Validation des champs obligatoires
            if (!row.nom) {
                errors.push(`Ligne ${rowNum}: Le nom du produit est requis`);
                continue;
            }

            product.nom = row.nom.trim();

            // Validation du prix
            if (!row.prix || isNaN(Number(row.prix))) {
                errors.push(`Ligne ${rowNum}: Le prix du produit doit être un nombre valide`);
                continue;
            }

            product.prix = Number(row.prix);

            // Validation de la quantité
            if (!row.qte || isNaN(Number(row.qte))) {
                errors.push(`Ligne ${rowNum}: La quantité du produit doit être un nombre valide`);
                continue;
            }

            product.qte = Number(row.qte);


            // Validation optionnelle de la catégorie si elle est fournie
            if (row.categorieId) {
                if (!categorieIds.includes(row.categorieId.toString())) {
                    errors.push(`Ligne ${rowNum}: La catégorie avec l'ID ${row.categorieId} n'existe pas`);
                    continue;
                }
                product.categorieId = row.categorieId;
            }

            // Autres champs optionnels
            if (row.description) product.description = row.description.trim();
            if (row.seuilAlerte && !isNaN(Number(row.seuilAlerte))) {
                product.seuilAlerte = Number(row.seuilAlerte);
            } else {
                product.seuilAlerte = 0; // Valeur par défaut
            }


            validatedData.push(product);
        }

        // Si des erreurs ont été détectées, les retourner
        if (errors.length > 0) {
            throw new Error(`Erreurs de validation:\n${errors.join('\n')}`);
        }

        return validatedData;
    }

    /**
     * Crée plusieurs produits en base de données
     * @param {Array} products - Liste des produits à créer
     * @returns {Promise<Array>} Liste des produits créés
     */
    /**
     * Crée ou met à jour plusieurs produits en base de données
     * @param {Array} products - Liste des produits à créer ou mettre à jour
     * @returns {Promise<Object>} Résultats de l'importation
     */
    async createManyProducts(products, transaction) {
        const result = {
            created: 0,
            updated: 0,
            failed: 0,
            details: []
        };

        try {
            let counter = 0;
            const totalProducts = products.length;

            for (const product of products) {
                counter++;
                // Log de progression tous les 10 produits ou tous les x% de progression
                if (counter % 10 === 0 || counter === totalProducts) {
                    const progressPercent = Math.round((counter / totalProducts) * 100);
                    console.log(`Progression: ${counter}/${totalProducts} produits traités (${progressPercent}%)`);
                }

                try {
                    console.log(`Traitement du produit: "${product.nom}"`);

                    const existingProduct = await db.Produit.findOne({
                        where: { nom: product.nom },
                        transaction
                    });

                    if (existingProduct) {
                        await existingProduct.update(product, { transaction });
                        await StockService.createOrUpdateStock(existingProduct.id, product.qte, transaction);
                        result.updated++;
                        result.details.push({ status: 'updated', nom: product.nom });
                    } else {

                        const newProduct = await db.Produit.create(product, { transaction });
                        await StockService.createOrUpdateStock(newProduct.id, product.qte, transaction);
                        result.created++;
                        result.details.push({ status: 'created', nom: product.nom });
                    }
                } catch (error) {
                    result.failed++;
                    result.details.push({
                        status: 'failed',
                        nom: product.nom,
                        error: error.message
                    });
                }
            }

            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default new ProduitService();
