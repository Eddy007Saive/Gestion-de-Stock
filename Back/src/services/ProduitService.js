import db from "@/database/models";


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
        await db.Stock.create({
            produitId: produit.id,
            quantite: quantiteInitiale,
            date_stock: new Date(),
            type_mouvement: "ENTREE"
        }, { transaction });

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
}

export default new ProduitService();
