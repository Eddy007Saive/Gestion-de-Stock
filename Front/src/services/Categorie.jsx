import apiClient from "@/utils/ApiClient";
const url="/categories"

// Fonction pour récupérer tous les utilisateurs
export const getCategories = () => apiClient.get(`${url}`);

export const findCategorie =async  (id) =>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
// Fonction pour créer un utilisateur
export const createCategorie = async (data) => {
    try {
        const response = await apiClient.post(`${url}`, data);
        return response.data; 
    } catch (error) {
        if (error.response) {
            // Erreur provenant du serveur avec un code d'état HTTP
            throw new Error(error.response.data.message || "Une erreur s'est Categoriee lors de la création du Categorie");
        } else if (error.request) {
            // Erreur de requête (ex: pas de réponse du serveur)
            throw new Error("Aucune réponse du serveur. Veuillez vérifier votre connexion.");
        } else {
            // Autres erreurs (ex: erreur de configuration)
            throw new Error(error);
        }
    }
};
export const getCategorieById=async (id)=>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response.data
    } catch (error) {
        
        console.log(error);
        
    }
}

// Fonction pour mettre à jour un utilisateur
export const updateCategorie  = (id, data,config) => apiClient.put(`${url}/${id}`,data,config);

// Fonction pour supprimer un utilisateur
export const deleteCategorie  = (id) => apiClient.delete(`${url}/${id}`);



