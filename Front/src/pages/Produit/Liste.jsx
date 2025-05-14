import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import { getProduits } from "@/services";
import { Link } from "react-router-dom";



export function liste() {
      const [produits, setProduit] = useState([]);
    useEffect(()=>{
        fetchData();
    },[])

    const fetchData=async()=>{
        const response= await getProduits();
        console.log(response.data);
        
        setProduit(response.data)
    }

    const columns = ["nom", "prix", "stockActuel","seuilAlerte", "categorie","fournisseur","Edit"];

  return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                <div className="flex justify-between">
                    <span>

                    Produits
                    </span>
                    <Link to="/dashboard/produit/nouveau">
                        Nouveau Produit
                    </Link>
                </div>
              </Typography>
            </CardHeader>
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
                {produits.map(({ id,nom, prix, seuilAlerte, categorie,fournisseur, totalQuantite}, key)=> {
                    const className = `py-3 px-5 ${
                      key === produits.length - 1 ? "" : "border-b border-blue-gray-50"
                    }`;
    
                      return (
                        <tr key={nom}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
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
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {prix}
                            </Typography>
                          </td>
    
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {totalQuantite}
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
                            <Typography
                              as={Link}
                              to={`/dashboard/modifier/produit/${id}`}
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
          </Card>
        </div>
      );
}

export default liste
