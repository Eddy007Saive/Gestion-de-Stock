import * as yup from "yup";

export const CategorieSchema = yup.object().shape({
  nom: yup.string().required("Le nom du categorie  est requis"),
  description: yup.string().required("Le description est requis"), 
});
