import React, { useEffect, useState,useCallback } from "react";
import { getProduits } from "@/services/Produit";
import { getStock } from "@/services/Stock";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VenteSchema } from "@/validations/venteSchema";
import ProduitSelect from "@/components/ProduitSelect";
import toastify from "@/utils/toastify"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createVente } from "@/services/Vente";

import {
  TrashIcon,
  CreditCardIcon, PlusCircleIcon

} from "@heroicons/react/24/solid";


export function Create() {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);

  const [totalPanier, setTotalPanier] = useState(0);

  useEffect(() => {
    fetchProduits();
  }, []);


  const getStockProduit = useCallback(async (id) => {
    try {
      const response = await getStock(id)
      return response.stockRestant;
    } catch (error) {
      toastify.error("Erreur lors de la récupération du stock")
    }
  })


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

  const [quantite, produitId, prixUnitaire, total] = watch(["quantite", "produitId", "prixUnitaire", "total"]);
  const isFormFilled = quantite && produitId && prixUnitaire && total



  // Au selection du selecteur on ajoute les info du produit selectionner dans les input
  const addProduit = (produit) => {

    if (produit) {
      setValue("produitId", produit.id);
      setValue("prixUnitaire", produit.prix);
      setValue("nom", produit.label);
      setValue("total", quantite ? Number(quantite) * Number(produit.prix) : 0);
    }
  };

  //On surveille si le prix ou la quntité change pour pouvoire calculer le totale
  useEffect(() => {
    const prixUnitaire = watch("prixUnitaire");

    if (quantite && prixUnitaire) {
      const totalCalc = (Number(quantite) || 0) * (Number(prixUnitaire) || 0);
      setValue("total", totalCalc);
    }
  }, [quantite, watch("prixUnitaire")]);

  const onSubmit = async (formData) => {
    const id=toastify.loading("Ajout du produit au panier")
    //Récuperer le stock de produit disponible dans la base 
    const stockDispo = await getStockProduit(formData.produitId);



    if (formData.quantite > stockDispo) {
      toast.error("Stock insuffisant !")
      return;
    }

    //On cherhe si le produit est eja ans le panier
    let produit = panier.find((prod) => prod.produitId == formData.produitId);

    if (produit) {
      let Produitquantite = Number(produit.quantite)

      let formDataQuantite = Number(formData.quantite)

      if (Produitquantite + formDataQuantite > stockDispo) {

        toast.error("Stock insuffisant pour cette quantité !")

        return;
      }

      //On augmente sa quantité
      Produitquantite += formDataQuantite;

      produit.total += Number(formData.total)

      const totalPanier = panier.reduce((sum, item) => sum + item.total, 0);
      setTotalPanier(totalPanier);
      toastify.closeLoad(id);
      return
    }

    //Sinon on ajoute le produit
    const { produitId, quantite, prixUnitaire, total, nom } = formData;

    setPanier((prevData) => [

      ...prevData,

      { produitId, quantite, prixUnitaire, total, nom },

    ]);

    toastify.closeLoad(id);

    reset();
  };

  const deleteProdInPanier = (produitId) => {

    let newProduit = panier.filter(prod => prod.produitId !== produitId)

    setPanier(newProduit)
  }

  //Effectuer le vente 
  const confirmSale = async () => {

    const id = toastify.loading("Validation de la vente")

    try {
      const response = await createVente(panier);

      toastify.success("Vente valider")

      reset();

      setPanier([]);

      toastify.closeLoad(id);

    } catch (error) {
      toastify.error("Commande non  valider")

    }
  }

  return (
    <section className="bg-white dark:bg-gray-900 p-4">
      <div className="lg:py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="shadow-xl p-6 w-full bg-white dark:bg-gray-800 rounded-2xl">
          <h2 className="mb-6 text-3xl font-extrabold text-gray-900 dark:text-white text-center">
            ➕ Ajouter une commande
          </h2>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <ProduitSelect onSelectChange={addProduit} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    📅 Date de vente
                  </label>
                  <input
                    {...register("dateVente")}
                    type="date"
                    className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.dateVente && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dateVente.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    🔢 Quantité
                  </label>
                  <input
                    {...register("quantite")}
                    type="number"
                    className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.quantite && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.quantite.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    💵 Prix unitaire
                  </label>
                  <input
                    {...register("prixUnitaire")}
                    type="number"
                    disabled
                    className="w-full p-2.5 text-sm rounded-lg border bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    💰 Total
                  </label>
                  <input
                    {...register("total")}
                    type="number"
                    disabled
                    className="w-full p-2.5 text-sm rounded-lg border bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  />
                </div>
              </div>

              {isFormFilled && (
                <div className="flex justify-center mt-8">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 shadow-md transition flex items-center gap-2"
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                    Ajouter au panier
                  </button>
                </div>
              )}
            </form>
          </FormProvider>
        </div>


        <div className="shadow-xl p-6 w-full bg-white dark:bg-gray-800 rounded-2xl">
          <h2 className="mb-6 text-3xl font-extrabold text-gray-900 dark:text-white text-center">
            🛒 Mon Panier
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase">Produit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase">QTE</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase">Prix (MGA)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {panier.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-3 text-gray-800 dark:text-gray-100">{item.nom}</td>
                    <td className="px-6 py-3 text-gray-800 dark:text-gray-100">{item.quantite}</td>
                    <td className="px-6 py-3 text-gray-800 dark:text-gray-100">{item.prixUnitaire}</td>
                    <td className="px-6 py-3 text-gray-800 dark:text-gray-100">{item.total}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => deleteProdInPanier(item.produitId)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Supprimer"
                        aria-label="Supprimer le produit"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              {panier.length > 0 && (
                <tfoot className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <td className="px-6 py-3 font-bold text-gray-800 dark:text-gray-100" colSpan="3">Total</td>
                    <td className="px-6 py-3 font-bold text-green-600 dark:text-green-400">{totalPanier}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {panier.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={confirmSale}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 shadow-lg transition flex items-center gap-2"
              >
                <CreditCardIcon className="h-5 w-5" />
                Valider la vente
              </button>
            </div>
          )}
        </div>


      </div>
      <ToastContainer />
    </section>
  );
}

export default Create;
