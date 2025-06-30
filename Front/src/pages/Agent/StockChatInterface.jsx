import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Package, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { AskAgent,getProduits } from '@/services';

export const StockChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Bonjour ! Je suis votre assistant IA pour la gestion de stock. Je peux vous aider à analyser vos produits, identifier les alertes de stock faible, suggérer des réapprovisionnements et répondre à vos questions. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [produits, setProduits] = useState([]);

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const response = await getProduits();
        setProduits(response.data.produits);
        console.log(response);
    } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
    }
};



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeStock = () => {
    const lowStock = produits.filter(p => p.stock.quantite <= p.seuilAlerte);
    const totalValue = produits.reduce((sum, p) => sum + (p.stock.quantite * p.prix), 0);
    const outOfStock = produits.filter(p => p.stock.quantite === 0);
    
    return { lowStock, totalValue, outOfStock, totalProducts: produits.length };
  };

  const callAIAPI = async (message) => {
    try {
      const analysis = analyzeStock();
      
      // Préparer le contexte avec les données de stock pour l'IA
      const stockContext = `
Contexte du stock actuel:
- Nombre total de produits: ${analysis.totalProducts}
- Valeur totale du stock: ${analysis.totalValue.toLocaleString()} Ar
- Produits en stock faible: ${analysis.lowStock.length}

Liste des produits:
${produits.map(p => 
  `- ${p.nom}: ${p.stock.quantite} unités (seuil: ${p.seuilAlerte}), Prix: ${p.prix.toLocaleString()} Ar, Fournisseur: ${p.fournisseur}`
).join('\n')}

Produits en alerte (stock <= seuil):
${analysis.lowStock.map(p => 
  `- ${p.nom}: ${p.stock.quantite}/${p.seuilAlerte} unités`
).join('\n') || 'Aucun produit en alerte'}
      `;

      const systemPrompt = `Tu es un assistant IA spécialisé dans la gestion de stock et d'inventaire. Tu aides les utilisateurs à analyser leur stock, identifier les problèmes, et donner des recommandations.

${stockContext}

Réponds de manière professionnelle et utile. Utilise des emojis pour rendre tes réponses plus visuelles. Donne des conseils pratiques basés sur les données fournies.`;

      const response = await AskAgent({ 
        message: message,
        systemPrompt: systemPrompt 
      });

      
      const data = response.data.reply;

      return data;

    } catch (error) {
      console.error('Erreur API:', error);
      return "😔 Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.";
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Appeler l'API de l'IA
    try {
      const aiResponse = await callAIAPI(inputMessage);
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: "😔 Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: "Stock faible", icon: AlertTriangle, action: () => setInputMessage("Quels produits ont un stock faible ?") },
    { label: "Valeur inventaire", icon: TrendingUp, action: () => setInputMessage("Quelle est la valeur totale de mon stock ?") },
    { label: "Recommandations", icon: Package, action: () => setInputMessage("Quelles sont vos recommandations ?") },
    { label: "Rechercher produit", icon: Search, action: () => setInputMessage("Chercher un produit spécifique") }
  ];

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Assistant IA - Gestion de Stock</h1>
            <p className="text-sm opacity-90">Analysez et optimisez votre inventaire</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-50 border-b">
        <p className="text-sm text-gray-600 mb-2">Actions rapides :</p>
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question sur le stock..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="1"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === '' || isTyping}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockChatInterface;