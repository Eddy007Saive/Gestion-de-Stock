import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
    Input,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { getProduits } from "@/services";
import { Link } from "react-router-dom";
import Pagination from "@/components/Pagination";

export function liste() {
    // États pour les données et la pagination
    const [produits, setProduits] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // États pour les filtres et le tri
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("id");
    const [sortOrder, setSortOrder] = useState("ASC");

    useEffect(() => {
        fetchData();
    }, [currentPage, limit, sortBy, sortOrder]); // Rechargement lors du changement de pagination ou tri

    const fetchData = async () => {
        try {
            setLoading(true);
            // Construction de l'URL avec tous les paramètres de pagination et filtres
            const response = await getProduits({
                page: currentPage,
                limit,
                search,
                sortBy,
                sortOrder
            });
            
            // Mise à jour des états avec les données reçues
            setProduits(response.data.produits);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement des produits:", error);
            setLoading(false);
        }
    };

    // Fonction pour effectuer une recherche
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Retour à la première page lors d'une nouvelle recherche
        fetchData();
    };



        // Gestionnaire de changement de page pour le composant Pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Gestionnaire de changement de limite par page pour le composant Pagination
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setCurrentPage(1); 
    };

    // Fonction pour changer le tri
    const handleSort = (column) => {
        // Si on clique sur la colonne déjà triée, on inverse l'ordre
        if (sortBy === column) {
            setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
        } else {
            // Sinon on trie par la nouvelle colonne en ordre ascendant
            setSortBy(column);
            setSortOrder("ASC");
        }
    };

    const columns = [
        { key: "nom", label: "Nom" },
        { key: "prix", label: "Prix" },
        { key: "totalQuantite", label: "Stock Actuel" },
        { key: "seuilAlerte", label: "Seuil Alerte" },
        { key: "categorie", label: "Catégorie" },
        { key: "actions", label: "Actions" }
    ];

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <div className="flex justify-between items-center">
                        <Typography variant="h6" color="white">
                            Produits
                        </Typography>
                        <div>
                            <Link to="/dashboard/produit/import" className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all">
                            Importer Produit
                            </Link>
                            <Link to="/dashboard/nouveau/produit" className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all">
                                Nouveau Produit
                            </Link>
                        </div>
                    </div>
                </CardHeader>

                {/* Barre de recherche */}
                <div className="px-4 py-2">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="w-full">
                            <Input
                                type="text"
                                label="Rechercher un produit..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit" color="gray">
                            Rechercher
                        </Button>
                    </form>
                </div>

                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <p>Chargement...</p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column.key}
                                                className="border-b border-blue-gray-50 py-3 px-5 text-left cursor-pointer"
                                                onClick={() => column.key !== "actions" && handleSort(column.key)}
                                            >
                                                <div className="flex items-center">
                                                    <Typography
                                                        variant="small"
                                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                                    >
                                                        {column.label}
                                                    </Typography>
                                                    {sortBy === column.key && (
                                                        <span className="ml-1">
                                                            {sortOrder === "ASC" ? "↑" : "↓"}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {produits.length > 0 ? (
                                        produits.map(({ id, nom, prix, seuilAlerte, categorie, totalQuantite }, key) => {
                                            const className = `py-3 px-5 ${
                                                key === produits.length - 1 ? "" : "border-b border-blue-gray-50"
                                            }`;

                                            return (
                                                <tr key={id}>
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
                                                            {prix} €
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography 
                                                            className={`text-xs font-semibold ${
                                                                totalQuantite <= seuilAlerte ? "text-red-500" : "text-blue-gray-600"
                                                            }`}
                                                        >
                                                            {totalQuantite || 0}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {seuilAlerte}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                                            {categorie?.nom || "Non catégorisé"}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Link
                                                            to={`/dashboard/modifier/produit/${id}`}
                                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                                        >
                                                            Voir
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={columns.length} className="py-4 px-5 text-center">
                                                <Typography variant="small" className="text-blue-gray-500">
                                                    Aucun produit trouvé
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                             <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                limit={limit}
                                onPageChange={handlePageChange}
                                onLimitChange={handleLimitChange}
                                itemName="produits"
                            />
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

export default liste;