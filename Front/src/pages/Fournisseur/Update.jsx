import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FournisseurSchema } from "@/validations/FournisseurSchema";
import { updateFournisseur,getFournisseurById } from "@/services/Fournisseur";
import { useParams ,useNavigate} from "react-router-dom";
import toastify from "@/utils/toastify"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function Update() {
  const {id} = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    adresse:"",
    contact: "",
    nom: "",
  });

  const [fournisseurs, setFournisseurs] = useState([]);

  const methods = useForm({
    resolver: yupResolver(FournisseurSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFournisseurById(id);
        console.log(response);      
          setFormData({
              // adresse: response.data.adresse,
              contact: response.contact,
              nom: response.nom,
          });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        toastify.error("Erreur lors de la récupération des données");
      }
     
    };
    fetchData();
  },[])

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
      const response = await updateFournisseur(id,formData);
      toastify.success(response.message || "Fournisseur mis à jour avec succès");
      setTimeout(() => {
        navigate("/fournisseurs"); // Ajustez le chemin selon votre routage
      }, 1500);
    } catch (err) {
      toastify.error(response.message || "Erreur pendant la  mis à jour du fournisseur");
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-4">
      <div className="mx-auto bg-red-199 lg:py-16  gap-10">
        {/* Formulaire à gauche */}
        <div className="shadow-lg bg-primary-2000">
          <h2 className="mb-8  text-2xl font-bold text-gray-900 dark:text-white">
            Ajouter un Fournisseur
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
                    Contact
                  </label>
                  <input
                    {...register("contact")}
                    value={formData.contact}
                    name="contact"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Adresse
                  </label>
                  <input
                    {...register("adresse")}
                    value={formData.adresse}
                    name="adresse"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                    onChange={handleChange}
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
            <ToastContainer />
      
    </section>
  );
}

export default Update;