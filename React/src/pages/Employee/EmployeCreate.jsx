import React, { useEffect, useState } from "react";
import { createEmploye } from "../../services/Employee";
import { getPostes } from "../../services/Poste";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmployeSchema } from "../../validations/EmployeSchema";

function EmployeCreate() {
  const [postes, setPoste] = useState([]);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    adresse: "",
    tel: "",
    date_embauche: "",
    statut: "",
    dateN: "",
    sexe: "",
    leave_solde: "",
    posteId: "",
    image: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPostes();
      setPoste(response.data);
    };
    fetchData();
  }, []);

  const methods = useForm({
    resolver: yupResolver(EmployeSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
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
  const onchangeImage=(e)=> {
    let file=e.target.files[0]
    setImage(file)
  }
  const onSubmit = async (e) => {
    try {
      const form = new FormData();
      form.append("image", image);
      for (let key in formData) {
        form.append(key, formData[key]);
      }
      const config = { headers: { "Content-Type": "multipart/form-data" } };


      const response = await createEmploye(form,config);
      console.log(response);
      reset()
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 p-4">
      <div className="mx-auto max-w-4xl lg:py-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Ajouter un Employé
        </h2>

        {/* FormProvider wrapper */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} encType={"multipart/form-data"}>
            <div className="grid grid-cols-1 gap-6">
              {/* Left: Image Upload */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Employé"
                      className="w-full h-full"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>

              {/* Right: Form Inputs */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* Matricule */}
                <div className="w-full">
                  <label
                    htmlFor="matricule"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Matricule
                  </label>
                  <input
                    {...register("matricule")}
                    value={formData.matricule}
                    name="matricule"
                    id="matricule"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  />
                  {errors.matricule && <p className="text-red-500 text-xs">{errors.matricule.message}</p>}
                </div>

                {/* Nom */}
                <div className="w-full">
                  <label
                    htmlFor="nom"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nom
                  </label>
                  <input
                    {...register("nom")}
                    value={formData.nom}
                    type="text"
                    name="nom"
                    id="nom"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  />
                  {errors.nom && <p className="text-red-500 text-xs">{errors.nom.message}</p>}
                </div>

                {/* Adresse */}
                <div className="w-full">
                  <label
                    htmlFor="adresse"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Adresse
                  </label>
                  <input
                    {...register("adresse")}
                    value={formData.adresse}
                    name="adresse"
                    id="adresse"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  />
                </div>

                {/* Téléphone */}
                <div className="w-full">
                  <label
                    htmlFor="tel"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Téléphone
                  </label>
                  <input
                    {...register("tel")}
                    value={formData.tel}
                    name="tel"
                    id="tel"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  />
                  {errors.tel && <p className="text-red-500 text-xs">{errors.tel.message}</p>}
                </div>

                {/* Date Embauche */}
                <div className="w-full">
                  <label
                    htmlFor="date_embauche"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date d'embauche
                  </label>
                  <input
                    {...register("date_embauche")}
                    value={formData.date_embauche}
                    name="date_embauche"
                    id="date_embauche"
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  />
                  {errors.date_embauche && <p className="text-red-500 text-xs">{errors.date_embauche.message}</p>}
                </div>

                {/* Statut */}
                <div className="w-full">
                  <label
                    htmlFor="statut"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Statut
                  </label>
                  <select
                    {...register("statut")}
                    value={formData.statut}
                    name="statut"
                    id="statut"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  >
                    <option value="Permanant">Permanant</option>
                    <option value="Contractuel">Contractuel</option>
                  </select>
                  {errors.statut && <p className="text-red-500 text-xs">{errors.statut.message}</p>}
                </div>

                {/* Date de Naissance */}
                <div className="w-full">
                  <label
                    htmlFor="dateN"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date de naissance
                  </label>
                  <input
                    {...register("dateN")}
                    value={formData.dateN}
                    name="dateN"
                    id="dateN"
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  />
                  {errors.dateN && <p className="text-red-500 text-xs">{errors.dateN.message}</p>}
                </div>

                {/* Sexe */}
                <div className="w-full">
                  <label
                    htmlFor="sexe"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Sexe
                  </label>
                  <select
                    {...register("sexe")}
                    value={formData.sexe}
                    name="sexe"
                    id="sexe"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  >
                    <option value="masculin">Masculin</option>
                    <option value="féminin">Féminin</option>
                  </select>
                  {errors.sexe && <p className="text-red-500 text-xs">{errors.sexe.message}</p>}
                </div>

                {/* Poste */}
                <div className="w-full">
                  <label
                    htmlFor="posteId"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Poste
                  </label>
                  <select
                    {...register("posteId")}
                    value={formData.posteId}
                    name="posteId"
                    id="posteId"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  >
                    <option  value="">
                        Choisir un poste
                      </option>
                    {postes.map((poste) => (
                      <option key={poste.id} value={poste.id}>
                        {poste.nom}
                      </option>
                    ))}
                  </select>
                  {errors.posteId && <p className="text-red-500 text-xs">{errors.posteId.message}</p>}
                </div>

                {/* Solde des congés */}
                <div className="w-full">
                  <label
                    htmlFor="leave_solde"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Solde des congés
                  </label>
                  <input
                    {...register("leave_solde")}
                    value={formData.leave_solde}
                    name="leave_solde"
                    id="leave_solde"
                    type="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Submit Button */}
            </div>
              <div className="flex justify-center mt-6 ">
                <button
                  type="submit"
                  className="bg-primary-600 text-black py-2 px-4 rounded-md hover:bg-primary-700"
                >
                  Ajouter
                </button>
              </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}

export default EmployeCreate;
