import apiClient from "@/utils/ApiClient";
const url="/stocks"

export const getStock = async (id) => {
    
    try {
        const response = await apiClient.get(`${url}/${id}`);
        return response.data; 
    } catch (error) {
        console.error("Erreur lors de la récupération du stock :", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Impossible de récupérer le stock.");
    }
};

