import apiClient from "@/utils/ApiClient";
const url="/produits"

// Fonction pour récupérer tous les utilisateurs
export const getProduits = ({ page = 1, limit = 10, search = "", sortBy = "id", sortOrder = "ASC" } = {}) => {
  return apiClient.get(url, {
    params: {
      page,
      limit,
      search,
      sortBy,
      sortOrder
    }
  });
};

export const findProduit =async  (id) =>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response
    } catch (error) {
        console.log(error);
    }
}

// Fonction pour importer un fichier CSV ou XLSX
export const importFile = async (file, config) => {
    try {
        const response = await apiClient.post(`${url}/upload`, file, config);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Erreur provenant du serveur avec un code d'état HTTP
            throw new Error(error.response.data.message || "Une erreur s'est produite lors de l'importation du fichier");
        } else if (error.request) {
            // Erreur de requête (ex: pas de réponse du serveur)
            throw new Error("Aucune réponse du serveur. Veuillez vérifier votre connexion.");
        } else {
            // Autres erreurs (ex: erreur de configuration)
            throw new Error(error);
        }
    }
};
// Fonction pour créer un utilisateur
export const createProduit = async (data, config) => {
    try {
        const response = await apiClient.post(`${url}`, data, config);
        return response.data; 
    } catch (error) {
        if (error.response) {
            // Erreur provenant du serveur avec un code d'état HTTP
            throw new Error(error.response.data.message || "Une erreur s'est produite lors de la création du produit");
        } else if (error.request) {
            // Erreur de requête (ex: pas de réponse du serveur)
            throw new Error("Aucune réponse du serveur. Veuillez vérifier votre connexion.");
        } else {
            // Autres erreurs (ex: erreur de configuration)
            throw new Error(error);
        }
    }
};
export const getProduitById=async (id)=>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response.data
    } catch (error) {
        
        console.log(error);
        
    }
}

// Fonction pour mettre à jour un utilisateur
export const updateProduit  = (id, data,config) => apiClient.put(`${url}/${id}`,data,config);

// Fonction pour supprimer un utilisateur
export const deleteProduit  = (id) => apiClient.delete(`${url}/${id}`);



