import apiClient from "@/utils/ApiClient";
const url="/Stock"

export const getStock = async (id) => {
    
    let formData=new FormData();
    formData.append('productI',id);
    try {
        const response = await apiClient.post(`${url}`,formData);
        return response.data; 
    } catch (error) {
        console.error("Erreur lors de la récupération du stock :", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Impossible de récupérer le stock.");
    }
};

