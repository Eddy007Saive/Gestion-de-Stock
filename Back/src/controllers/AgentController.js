import dotenv from 'dotenv';
dotenv.config();
import axios from "axios"

class AgentController {

    async askAI(req, res) {
        const { message, systemPrompt } = req.body;

        try {
            const messages = [
                { 
                    role: 'system', 
                    content: systemPrompt || 'Tu es un assistant IA spécialisé dans la gestion de stock et d\'inventaire. Tu aides les utilisateurs à analyser leur stock, identifier les problèmes, et donner des recommandations pratiques.'
                },
                { role: 'user', content: message }
            ];

            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: 'anthropic/claude-3-haiku',
                messages: messages,
                temperature: 0.7,
                max_tokens: 100
            }, {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json'
                }
            });

            const aiReply = response.data.choices[0].message.content;
            res.status(200).json({ reply: aiReply });

        } catch (error) {
            console.error('Erreur OpenRouter:', error.response ? error.response.data : error.message);
            
            // Gestion d'erreurs plus détaillée
            if (error.response?.status === 401) {
                res.status(500).json({ message: "Erreur d'authentification avec l'API IA" });
            } else if (error.response?.status === 429) {
                res.status(500).json({ message: "Limite de requêtes atteinte, veuillez réessayer plus tard" });
            } else {
                console.log(error);
                res.status(500).json({ message: error });
            }
        }
    }

    // Méthode pour récupérer le contexte de stock depuis la base de données
    async getStockContext(req, res) {
        try {
            // Ici vous pourriez récupérer les données depuis votre base de données
            // const produits = await getProduits();
            // const analysis = analyzeStock(produits);
            
            res.status(200).json({ 
                message: "Contexte de stock disponible",
                // context: analysis 
            });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du contexte" });
        }
    }
}

export default new AgentController();