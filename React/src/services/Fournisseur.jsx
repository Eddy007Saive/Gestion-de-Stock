import apiClient from "../utils/ApiClient";
const url="/fournisseur"

// Fonction pour récupérer tous les utilisateurs
export const getFournisseurs = () => apiClient.get(`${url}s`);

export const findFournisseur =async  (id) =>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
// Fonction pour créer un utilisateur
export const createFournisseur= async (data,config) => {
    try {
        const response=await apiClient.post(`${url}/create`, data,config);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const getFournisseurById=async (id)=>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response.data
    } catch (error) {
        
        console.log(error);
        
    }
}

// Fonction pour mettre à jour un utilisateur
export const updateFournisseur  = (id, data,config) => apiClient.put(`${url}/${id}`,data,config);

// Fonction pour supprimer un utilisateur
export const deleteFournisseur  = (id) => apiClient.delete(`${url}/${id}`);



