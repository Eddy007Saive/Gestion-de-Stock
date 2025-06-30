import apiClient from "@/utils/ApiClient";
const url="/ventes"

// Fonction pour récupérer tous les utilisateurs
export const getVentes = ({ page = 1, limit = 10, search = "", sortBy = "id", sortOrder = "ASC" } = {}) => {
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

export const findVente =async  (id) =>{
    try {
        const response=await apiClient.get(`${url}/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
// Fonction pour créer un utilisateur
export const createVente= async (data,config) => {
    try {
        const response=await apiClient.post(url, data,config);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const getVenteById=async (id)=>{
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



