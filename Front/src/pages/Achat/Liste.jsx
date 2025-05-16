import React, { useEffect, useState } from "react";
import { getProduits,createStock } from "@/services";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { 
  AlertTriangle, 
  Search, 
  Plus, 
  RefreshCw, 
  File, 
  CheckCircle,
  X
} from "lucide-react";

// Composant principal pour la liste d'approvisionnement
export function ListeApprovisionnement() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantite, setQuantite] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'ascending' });

  // Récupération des données
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getProduits();
      setProduits(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setNotification({
        show: true,
        message: "Erreur lors du chargement des produits",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Logique de tri
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Application du tri
  const sortedProduits = [...produits].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filtrage par recherche
  const filteredProduits = sortedProduits.filter(produit =>
    produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produit.categorie.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produit.fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Produits nécessitant un approvisionnement
  const produitsAApprovisionner = filteredProduits.filter(
    produit => produit.totalQuantite <= produit.seuilAlerte
  );

  // Ouvrir modal d'approvisionnement
  const handleOpenApprovisionnement = (produit) => {
    setSelectedProduit(produit);
    setQuantite(Math.max(produit.seuilAlerte - produit.totalQuantite, 1));
    setIsModalOpen(true);
  };

  // Soumettre l'approvisionnement
  const handleSubmitApprovisionnement = async () => {
    try {

        const response=await createStock({
        produitId:selectedProduit.id,
        quantite:parseInt(quantite)
      })

      
      // Mise à jour locale pour la démo
      const updatedProduits = produits.map(p => {
        if (p.id === selectedProduit.id) {
          return { ...p, totalQuantite: parseInt(p.totalQuantite) + parseInt(quantite) };
        }
        return p;
      });
      
      setProduits(updatedProduits);
      setNotification({
        show: true,
        message: `Approvisionnement de ${quantite} ${selectedProduit.nom} effectué avec succès!`,
        type: "success"
      });
      
      setIsModalOpen(false);
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de l'approvisionnement:", error);
      setNotification({
        show: true,
        message: "Erreur lors de l'approvisionnement",
        type: "error"
      });
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="ml-4"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            <div className="flex justify-between">
              <span>
                Approvisionnement des Produits
              </span>
              <Link to="/dashboard/nouveau/produit">
                Nouveau Produit
              </Link>
            </div>
          </Typography>
        </CardHeader>

        {/* Contenu */}
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {/* Recherche et alerte */}
          <div className="px-6 py-3 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <button
                onClick={fetchData}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </button>
            </div>
            
            {produitsAApprovisionner.length > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {produitsAApprovisionner.length} produit(s) nécessite(nt) un approvisionnement
                </span>
              </div>
            )}
          </div>

          {/* Tableau */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-gray-500"></div>
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["nom", "prix", "stockActuel", "seuilAlerte", "categorie", "fournisseur", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left cursor-pointer"
                      onClick={() => requestSort(col === "nom" ? "nom" : 
                                              col === "prix" ? "prix" : 
                                              col === "stockActuel" ? "totalQuantite" :
                                              col === "seuilAlerte" ? "seuilAlerte" : null)}
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400 flex items-center gap-1"
                      >
                        {col}
                        {(sortConfig.key === "nom" && col === "nom") || 
                         (sortConfig.key === "prix" && col === "prix") ||
                         (sortConfig.key === "totalQuantite" && col === "stockActuel") ||
                         (sortConfig.key === "seuilAlerte" && col === "seuilAlerte") ? (
                          <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                        ) : null}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProduits.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <File className="h-12 w-12 text-gray-300" />
                        <Typography variant="small" className="font-normal">
                          Aucun produit trouvé
                        </Typography>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProduits.map(({ id, nom, prix, totalQuantite, seuilAlerte, categorie, fournisseur }, key) => {
                    const className = `py-3 px-5 ${
                      key === produits.length - 1 ? "" : "border-b border-blue-gray-50"
                    }`;
                    const needsRestock = totalQuantite <= seuilAlerte;
                    
                    return (
                      <tr key={id} className={needsRestock ? "bg-red-50" : ""}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {nom}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {prix}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className={`text-xs font-semibold ${needsRestock ? "text-red-600" : "text-blue-gray-600"} flex items-center gap-1`}>
                            {totalQuantite}
                            {needsRestock && <AlertTriangle className="h-3 w-3" />}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {seuilAlerte}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {categorie.nom}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {fournisseur.nom}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenApprovisionnement({ id, nom, prix, totalQuantite, seuilAlerte, categorie, fournisseur })}
                              className={`px-3 py-1 rounded text-white text-xs ${needsRestock ? "bg-red-500" : "bg-blue-gray-500"}`}
                            >
                              Approvisionner
                            </button>
                            <Typography
                              as={Link}
                              to={`/dashboard/modifier/produit/${id}`}
                              className="text-xs font-semibold text-blue-gray-600"
                            >
                              Détails
                            </Typography>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Modal d'approvisionnement */}
      {isModalOpen && selectedProduit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Approvisionnement de produit
              </h3>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-700">
                      {selectedProduit.nom.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">{selectedProduit.nom}</p>
                    <p className="text-sm text-blue-600">Fournisseur: {selectedProduit.fournisseur.nom}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Stock actuel</p>
                    <p className="text-lg font-bold text-gray-700">{selectedProduit.totalQuantite}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Seuil d'alerte</p>
                    <p className="text-lg font-bold text-gray-700">{selectedProduit.seuilAlerte}</p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité à approvisionner
                  </label>
                  <input
                    id="quantite"
                    type="number"
                    min="1"
                    value={quantite}
                    onChange={(e) => setQuantite(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400 mt-2">
                  <p className="text-sm text-yellow-800">
                    L'approvisionnement augmentera le stock actuel de <strong>{selectedProduit.nom}</strong> de <strong>{quantite}</strong> unités.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={handleSubmitApprovisionnement}
              >
                <Plus className="h-4 w-4" />
                Approvisionner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeApprovisionnement;