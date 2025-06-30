import React, { useEffect, useState } from "react";
import {
   Card,
    CardHeader,
    CardBody,
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";
import { getVentes } from "@/services";
import { Link } from "react-router-dom";
import Pagination from "@/components/Pagination";




export function liste() {
  const [ventes, setVente] = useState([]);
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
  }, [currentPage, limit, sortBy, sortOrder])

  const fetchData = async () => {
    try {
      const response = await getVentes({
        page: currentPage,
        limit,
        search,
        sortBy,
        sortOrder
      });
      setVente(response.data.ventes);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
      setLoading(false);


    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setLoading(false);
    }

  }

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

  const columns = ["Date de vente", "total", "Edit"];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            <div className="flex justify-between">
              <span>

                Commandes
              </span>
              <Link to="/dashboard/nouveau/commande">
                Nouveau Commande
              </Link>
            </div>
          </Typography>
        </CardHeader>

        {/* Barre de recherche */}
        <div className="px-4 py-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="w-full">
              <Input
                type="text"
                label="Rechercher un ventes..."
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
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {columns.map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ventes.map((vente, key) => {
                const className = `py-3 px-5 ${key === ventes.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                return (
                  <tr key={vente.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {new Date(vente.dateVente).toLocaleDateString('fr-FR')}
                          </Typography>
                        </div>

                      </div>
                    </td>

                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {vente.totalPrix}
                          </Typography>

                        </div>
                      </div>
                    </td>

                    <td className={className}>
                      <Typography
                        as={Link}
                        to={`/dashboard/modifier/Vente/${vente.id}`}
                        className="text-xs font-semibold text-blue-gray-600"
                      >
                        voire
                      </Typography>
                    </td>
                  </tr>
                );
              }
              )}
            </tbody>
          </table>
        </CardBody>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          itemName="Commandes"
        />
      </Card>
    </div>
  );
}

export default liste
