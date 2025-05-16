import apiClient from "@/utils/ApiClient";
const url="/achats"

// Fonction pour récupérer tous les utilisateurs
export const getAchats = () => apiClient.get(url);

export const findAchats =async  (id) =>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
// Fonction pour créer un utilisateur
export const createAchat= async (data) => {
    
    try {
        const response=await apiClient.post(url, data);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const getAchatById=async (id)=>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response.data
    } catch (error) {
        
        console.log(error);
        
    }
}

// Fonction pour mettre à jour un utilisateur
export const updateVente  = (id, data,config) => apiClient.put(`${url}/${id}`,data,config);

// Fonction pour supprimer un utilisateur
export const deleteVente  = (id) => apiClient.delete(`${url}/${id}`);



