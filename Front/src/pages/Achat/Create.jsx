import React, { useEffect, useState } from "react";
import { createProduit, getProduits } from "@/services/Produit";
import {  getFournisseurs,getCategories} from "@/services";
import toastify from "@/utils/toastify"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProduitSchema } from "@/validations/ProduitSchema";

export function Create() {
  const [produits, setProduits] = useState([]);
  const [fournisseurs, setFournisseur] = useState([]);
  const [categories, setCategorie] = useState([]);


  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prix: "",
    description: "",
    fournisseurId: "",
    categorieId:"",
    image: "",
    qte:"",
    seuilAlerte:0
  });

  useEffect(() => {
    fetchProduits();
    fecthFournisseurs();
    fetchCategorie();
  }, []);

  const fetchProduits = async () => {
    const response = await getProduits();
    setProduits(response.data);
    console.log(response)
  };

  const fecthFournisseurs = async () => {
    const response = await getFournisseurs();
    setFournisseur(response.data);
    
  };

  const fetchCategorie = async () => {
    const response = await getCategories();
    setCategorie(response.data);
    
  };



  const methods = useForm({
    resolver: yupResolver(ProduitSchema),
  });

  const { register, handleSubmit, reset, formState: { errors } } = methods;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onchangeImage = (e) => {
    let file = e.target.files[0];
    setImage(file);
  };

  const onSubmit = async () => {
    try {
        const form = new FormData();
        form.append("image", image);
        for (let key in formData) {
            form.append(key, formData[key]);
        }

        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const response = await createProduit(form, config);
        
        toastify.success(response.message || "Produit créé avec succès");
        fecthFournisseurs(); 
        reset();
    } catch (error) {
        console.error("Erreur lors de la soumission :", error);

        if (error.response) {
            // Erreurs renvoyées par le backend
            const errorMessage = error.response.data.errors || "Une erreur s'est produite";
            toastify.error(errorMessage);
        } else if (error.request) {
            // Problème de connexion au serveur
            toastify.error("Le serveur ne répond pas. Vérifiez votre connexion.");
        } else {
            // Autres erreurs (ex: erreur de syntaxe)
            toastify.error(error.message);
        }
    }
};


  return (
    <section className="bg-white dark:bg-gray-900 p-4">
      <div className="mx-auto max-w-6xl lg:py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire d'ajout */}
        <div className="shaow-lg p-4 ">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Ajouter un Produit
          </h2>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <div className="grid grid-cols-1 gap-6">
                {/* Image Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {image && (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Produit"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <label
                    htmlFor="image"
                    className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Image
                  </label>
                  <input
                    onChange={onchangeImage}
                    type="file"
                    id="image"
                    name="image"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>

                {/* Champs du formulaire */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Nom du produit</label>
                    <input
                      {...register("nom")}
                      value={formData.nom}
                      name="nom"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={handleChange}
                    />
                    {errors.nom && <p className="text-red-500 text-xs">{errors.nom.message}</p>}
                  </div>

                  <div>
              <label className="block mb-2 text-sm font-medium">Fournisseur</label>
              <select
                  name="fournisseurId"
                  id="fournisseurId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  {...register("fournisseurId")}
                  onChange={handleChange}
                  value={formData.fournisseurId}
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map((fournisseur) => (
                    <option key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.nom}
                    </option>
                  ))}
                </select>

                    {errors.fournisseur && <p className="text-red-500 text-xs">{errors.fournisseur.message}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">Categorie</label>
                    <select
                        name="categorieId"
                        id="categorieId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        {...register("categorieId")}
                        onChange={handleChange}
                        value={formData.categorieId}
                      >
                        <option value="">Sélectionner un categorie</option>
                        {categories.map((categorie) => (
                          <option key={categorie.id} value={categorie.id}>
                            {categorie.nom}
                          </option>
                        ))}
                      </select>

                    {errors.categorie && <p className="text-red-500 text-xs">{errors.categorie.message}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">Prix</label>
                    <input
                      {...register("prix")}
                      value={formData.prix}
                      name="prix"
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={handleChange}
                    />
                    {errors.prix && <p className="text-red-500 text-xs">{errors.prix.message}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">seuilAlerte</label>
                    <input
                      {...register("seuilAlerte")}
                      value={formData.seuilAlerte}
                      name="seuilAlerte"
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={handleChange}
                    />
                    {errors.seuilAlerte && <p className="text-red-500 text-xs">{errors.seuilAlerte.message}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">Quantité</label>
                    <input
                      {...register("qte")}
                      value={formData.qte}
                      name="qte"
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={handleChange}
                    />
                    {errors.qte && <p className="text-red-500 text-xs">{errors.qte.message}</p>}
                  </div>

                 

                  <div className="col-span-2">
                    <label className="block mb-2 text-sm font-medium">Description</label>
                    <textarea
                      {...register("description")}
                      value={formData.description}
                      name="description"
                      rows="3"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={handleChange}
                    />
                    {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                  </div>
                </div>
              </div>

              {/* Bouton Submit */}
              <div className="flex justify-center mt-6">
                <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-primary-700">
                  Ajouter
                </button>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Tableau des Produits */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Liste des Produits</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Nom</th>
                  <th className="border px-4 py-2">Quantité</th>
                  <th className="border px-4 py-2">Prix</th>
                  <th className="border px-4 py-2">Action</th>

                </tr>
              </thead>
              <tbody>
                {produits.length > 0 ? (
                  produits.map((produit) => (
                    <tr key={produit.id} className="text-center">
                      <td className="border px-4 py-2">{produit.nom}</td>
                      <td className="border px-4 py-2">{produit.stock.quantite}</td>
                      <td className="border px-4 py-2">{produit.prix} Ar</td>
                      <td className="border px-4 py-2">
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">Aucun produit disponible</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </section>
  );
}

export default Create;
