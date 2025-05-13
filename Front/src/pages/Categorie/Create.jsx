import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CategorieSchema } from "@/validations/CategorieSchema";
import { createCategorie } from "@/services/Categorie";
import toastify from "@/utils/toastify"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export function Create() {
  const [formData, setFormData] = useState({
    description: "",
    nom: "",
  });


  const methods = useForm({
    resolver: yupResolver(CategorieSchema),
  });


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    try {
      const response = await createCategorie(formData);
      toastify.success(response.message || "Catégorie  créé avec succès");
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-4">
      <div className="mx-auto bg-red-199 lg:py-16  gap-10">
        {/* Formulaire à gauche */}
        <div className="shadow-lg bg-primary-2000">
          <h2 className="mb-8  text-2xl font-bold text-gray-900 dark:text-white">
            Ajouter un Categorie
          </h2>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 p-4  ">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nom
                  </label>
                  <input
                    {...register("nom")}
                    value={formData.nom}
                    type="text"
                    name="nom"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                    onChange={handleChange}
                  />
                  {errors.nom && <p className="text-red-500 text-xs">{errors.nom.message}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea 
                  {...register("description")}
                  value={formData.description}
                  name="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  onChange={handleChange}
                  ></textarea>
                  <input
                    
                  />
                </div>
              </div>
              <div className="flex justify-center mt-6 p-4 ">
                <button type="submit" className="bg-green-600 text-black py-2 px-4 rounded-md hover:bg-primary-700">
                  Ajouter
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
            <ToastContainer/>
    </section>
  );
}

export default Create;