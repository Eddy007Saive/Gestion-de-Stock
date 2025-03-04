import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FournisseurSchema } from "../../validations/FournisseurSchema";
import { createFournisseur } from "../../services/Fournisseur";
import { getFournisseurs } from "../../services/Fournisseur";

function Create() {
  const [formData, setFormData] = useState({
    contact: "",
    nom: "",
  });

  const [fournisseurs, setFournisseurs] = useState([]);

  const methods = useForm({
    resolver: yupResolver(FournisseurSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFournisseurs();
      setFournisseurs(response.data);
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
      const response = await createFournisseur(formData);
      console.log(response);
      setFournisseurs([...fournisseurs, formData]); 
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-4">
      <div className="mx-auto max-w-6xl bg-red-199 lg:py-16 grid grid-cols-2 gap-10">
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
              </div>
              <div className="flex justify-center mt-6 p-4 ">
                <button type="submit" className="bg-green-600 text-black py-2 px-4 rounded-md hover:bg-primary-700">
                  Ajouter
                </button>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Tableau des fournisseurs à droite */}
        <div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Nom</th>
                <th className="border border-gray-300 p-2">Contact</th>
                <th className="border border-gray-300 p-2">Action</th>

              </tr>
            </thead>
            <tbody>
              {fournisseurs.length > 0 ? (
                fournisseurs.map((fournisseur, index) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="border border-gray-300 p-2">{fournisseur.nom}</td>
                    <td className="border border-gray-300 p-2">{fournisseur.contact}</td>
                    <td className="border border-gray-300 p-2">
                      <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        Modifier
                      </button>{" "}
                      <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                        Supprimer
                      </button>{" "}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-2 text-gray-500">
                    Aucun fournisseur ajouté.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Create;