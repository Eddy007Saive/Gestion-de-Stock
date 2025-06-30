import apiClient from "@/utils/ApiClient";
const url="/agent"

// Fonction pour récupérer tous les utilisateurs
export const AskAgent = (data) => {
  return apiClient.post(url,data);
};
