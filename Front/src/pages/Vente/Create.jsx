import React, { useEffect, useState } from "react";
import { getProduits } from "@/services/Produit";
import { getStock } from "@/services/Stock";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VenteSchema } from "@/validations/venteSchema";
import ProduitSelect from "@/components/ProduitSelect";
import toastify from "@/utils/toastify"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createVente } from "@/services/Vente";

import {
 TrashIcon,
 CreditCardIcon,PlusCircleIcon
  
} from "@heroicons/react/24/solid";


export function Create() {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);

  useEffect(() => {
    fetchProduits();
  }, []);


  const getStockProduit= async (id) =>{
    try {
      const response=await getStock(id)
      return response.stockRestant;
    } catch (error) {
      toastify.error("Erreur lors de la récupération du stock")
    }
  }


  const fetchProduits = async () => {
    try {
      const response = await getProduits();
      setProduits(response.data);
    } catch (error) {
      toastify.error("Erreur lors de la récupération des produits");
    }
  };

  const methods = useForm({
    resolver: yupResolver(VenteSchema),
    defaultValues: {
      dateVente: new Date().toISOString().split("T")[0],
      produitId: "",
      quantite: "",
      prixUnitaire: "",
      total: "",
      nom: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = methods;

  const [quantite,produitId,prixUnitaire,total] = watch(["quantite","produitId","prixUnitaire","total"]);
  const isFormFilled=quantite && produitId && prixUnitaire && total



  // Au selection du selecteur on ajoute les info du produit selectionner dans les input
  const addProduit = (produit) => {

    if (produit) {
      setValue("produitId", produit.id);
      setValue("prixUnitaire", produit.prix);
      setValue("nom", produit.label);
      setValue("total", quantite ? quantite * produit.prix : 0);
    }
  };

  //On surveille si le prix ou la quntité change pour pouvoire calculer le totale
  useEffect(() => {
    const prixUnitaire = watch("prixUnitaire");

    if (quantite && prixUnitaire) {
      setValue("total", quantite * prixUnitaire);
    }
  }, [quantite, watch("prixUnitaire")]);

  const onSubmit = async (formData) => {
    //Récuperer le stock de produit disponible dans la base 
    const stockDispo= await getStockProduit(formData.produitId);



    if(formData.quantite > stockDispo){
      toast.error("Stock insuffisant !")
      return;
    }

    //On cherhe si le produit est eja ans le panier
    let produit = panier.find((prod) => prod.produitId == formData.produitId);

    if (produit) {
      if(produit.quantite + formData.quantite>stockDispo){
        toast.error("Stock insuffisant pour cette quantité !")
        return;
      }
      //On augmente sa quantité
      produit.quantite += formData.quantite;
      produit.total +=formData.total
      return
    } 

      //Sinon on ajoute le produit
      const { produitId, quantite, prixUnitaire, total, nom } = formData;
      setPanier((prevData) => [
        ...prevData,
        { produitId, quantite, prixUnitaire, total, nom },
      ]);
    
    //Réinitialisation u formulaire
    reset();
  };

  const deleteProdInPanier=(produitId)=>{
      let newProduit =panier.filter(prod =>prod.produitId !==produitId)
      setPanier(newProduit)
  }

    //Effectuer le vente 
  const confirmSale =async ()=>{
      try {
        const response= await createVente(panier);
        toastify.success("Vente valider")
        reset();
        setPanier([]);

      } catch (error) {
        toastify.error("Commande non  valider")

      }
  }

  return (
    <section className="bg-white dark:bg-gray-900 p-4">
      <div className="lg:py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="shadow-lg p-4 w-full">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Ajouter une commande
          </h2>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="col-span-2">
                  <ProduitSelect onSelectChange={addProduit} />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Date de vente
                  </label>
                  <input
                    {...register("dateVente")}
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  />
                  {errors.dateVente && (
                    <p className="text-red-500 text-xs">
                      {errors.dateVente.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Quantité
                  </label>
                  <input
                    {...register("quantite")}
                    type="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  />
                  {errors.quantite && (
                    <p className="text-red-500 text-xs">
                      {errors.quantite.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Prix unitaire
                  </label>
                  <input
                    {...register("prixUnitaire")}
                    type="number"
                    disabled
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Total
                  </label>
                  <input
                    {...register("total")}
                    type="number"
                    disabled
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  />
                </div>
              </div>
             
             {isFormFilled && <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  <PlusCircleIcon className="h-5 w-5" >Panier</PlusCircleIcon>
                  
                </button>
              </div>}
            </form>
          </FormProvider>
        </div>

        <div className="shadow-lg p-4 w-full" >
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Panier
          </h2>

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Produit</th>
                <th className="px-4 py-2 text-left">QTE</th>
                <th className="px-4 py-2 text-left">Prix(MGA)</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Action</th>
                
              
              </tr>
            </thead>
            <tbody>
              {panier.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.nom}</td>
                  <td className="px-4 py-2">{item.quantite}</td>
                  <td className="px-4 py-2">{item.prixUnitaire}</td>
                  <td className="px-4 py-2">{item.total}</td>
                  <td className="px-4 py-2">
                  <button onClick={() => deleteProdInPanier(item.produitId)}><TrashIcon className="h-5 w-5" /></button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  hidden={panier.length === 0} 
                  onClick={()=>{confirmSale()}}
                >
                  <CreditCardIcon className="h-5 w-5" />
                </button>
              </div>
      </div>
          
        </div>
      <ToastContainer />
    </section>
  );
}

export default Create;
