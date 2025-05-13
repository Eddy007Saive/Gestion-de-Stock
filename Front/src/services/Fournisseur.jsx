import apiClient from "@/utils/ApiClient";
const url="/fournisseurs"

// Fonction pour récupérer tous les utilisateurs
export const getFournisseurs = () => apiClient.get(`${url}`);

export const findFournisseur =async  (id) =>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response
        
    } catch (error) {
        console.log(error);
    }
}
// Fonction pour créer un utilisateur
export const createFournisseur= async (data,config) => {
    try {
        const response=await apiClient.post(`${url}`, data,config);
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
export const updateFournisseur  = (id, data) => apiClient.put(`${url}/${id}`,data);

// Fonction pour supprimer un utilisateur
export const deleteFournisseur  = (id) => apiClient.delete(`${url}/${id}`);



