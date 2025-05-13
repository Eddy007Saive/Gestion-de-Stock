import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import { getFournisseurs } from "@/services";
import { Link } from "react-router-dom";



export function liste() {
      const [Fournisseurs, setFournisseur] = useState([]);
    useEffect(()=>{
        fetchData();
    },[])

    const fetchData=async()=>{
        const response= await getFournisseurs();
        console.log(response.data);
        
        setFournisseur(response.data)
    }

    const columns = ["nom", "contact", "adresse","Action"];

  return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                <div className="flex justify-between">
                    <span>

                    Fournisseurs
                    </span>
                    <Link to="/dashboard/nouveau/fournisseur">
                        Nouveau Fournisseur
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
                {Fournisseurs.map(({ id,nom, contact}, key)=> {
                    const className = `py-3 px-5 ${
                      key === Fournisseurs.length - 1 ? "" : "border-b border-blue-gray-50"
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
                              {contact}
                            </Typography>
                          </td>
                      
              
                          <td className={className}>
                            <Typography
                              as={Link}
                              to={`/dashboard/modifier/fournisseur/${id}`}
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
