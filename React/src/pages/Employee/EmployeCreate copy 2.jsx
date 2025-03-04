import React, { useEffect, useState } from "react";
import { createEmploye } from "../../services/Employee";
import { getPostes } from "../../services/Poste";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmployeSchema } from "../../validations/EmployeSchema";

function EmployeCreate() {
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    const config = {headers: {'Content-Type': 'multipart/form-data'}}

    try{
        const data = await createEmploye(formData, config)
      
    }
    catch(err) {
        console.log(err);
    }
    
}
  return (
    <section className="bg-white dark:bg-gray-900 p-4">
      <div className="mx-auto max-w-4xl lg:py-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Ajouter un Employé
        </h2>

        {/* FormProvider wrapper */}
      
          <form onSubmit={handleSubmit} encType={"multipart/form-data"}>
            <div className="grid grid-cols-1 gap-6">

              <input type="file" name="image" onChange={(e)=>{setImage(e.target.files[0])}} />
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
     
      </div>
    </section>
  );
}

export default EmployeCreate;
