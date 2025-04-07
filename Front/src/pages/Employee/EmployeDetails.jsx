import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findEmploye } from '../../services/Employee';

export function EmployeDetails() {
  const { id } = useParams();
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await findEmploye(id)
        .then(employe => {
          setEmploye(employe.data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
        });
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500">Chargement...</div>;
  }

  if (!employe) {
    return <div className="text-center text-red-500">Aucun employé trouvé.</div>;
  }

  return (
    <section className="bg-white shadow-xl rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex gap-6">
        <div className="relative w-1/4 h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-lg shadow-lg">
          <img src={`http://localhost:3000/${employe.image}`} alt="Employé" className="object-cover w-full h-full" />
        </div>
        <div className="w-3/4 bg-gray-50 p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label htmlFor="matricule" className="font-semibold text-gray-800 dark:text-white">Matricule:</label>
              <p className="font-bold text-gray-900 dark:text-gray-200">{employe.matricule}</p>
            </div>

            <div className="flex justify-between">
              <label htmlFor="nom" className="font-semibold text-gray-800 dark:text-white">Nom:</label>
              <p className="text-gray-900 dark:text-gray-200">{employe.nom}</p>
            </div>

            <div className="flex justify-between">
              <label htmlFor="sexe" className="font-semibold text-gray-800 dark:text-white">Sexe:</label>
              <p className="text-gray-900 dark:text-gray-200">{employe.sexe}</p>
            </div>

            <div className="flex justify-between">
              <label htmlFor="adresse" className="font-semibold text-gray-800 dark:text-white">Adresse:</label>
              <p className="text-gray-900 dark:text-gray-200">{employe.adresse}</p>
            </div>

            <div className="flex justify-between">
              <label htmlFor="tel" className="font-semibold text-gray-800 dark:text-white">Téléphone:</label>
              <p className="text-gray-900 dark:text-gray-200">{employe.tel}</p>
            </div>

            <div className="flex justify-between">
              <label htmlFor="dateN" className="font-semibold text-gray-800 dark:text-white">Date de Naissance:</label>
              <p className="text-gray-900 dark:text-gray-200">{new Date(employe.dateN).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full bg-gray-50 p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label htmlFor="date_embauche" className="font-semibold text-gray-800 dark:text-white">Date d'embauche:</label>
              <p className="text-gray-900 dark:text-gray-200">{new Date(employe.date_embauche).toLocaleDateString()}</p>
            </div>

            <div className="flex justify-between">
              <label htmlFor="conge" className="font-semibold text-gray-800 dark:text-white">Congé restant:</label>
              <p className="text-gray-900 dark:text-gray-200">{employe.leave_solde} jours</p>
            </div>

            <div className="flex justify-between">
              <label htmlFor="poste" className="font-semibold text-gray-800 dark:text-white">Poste:</label>
              <p className="text-gray-900 dark:text-gray-200">{employe.poste.nom}</p>
            </div>

            <div className="flex justify-between">
              <label htmlFor="departement" className="font-semibold text-gray-800 dark:text-white">Département:</label>
              <p className="text-gray-900 dark:text-gray-200">{employe.poste.departement.nom}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end gap-4 p-3">
        <Link to={`/dashboard/employe/update/${employe.id}`} className="bg-yellow-200 p-3 rounded-lg hover:bg-yellow-500 transition ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </Link>
        <button className="bg-red-200 p-3 rounded-lg hover:bg-red-500 transition ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
        <button className="bg-green-200 p-3 rounded-lg hover:bg-green-500 transition ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default EmployeDetails;
