import * as yup from "yup";

export const FournisseurSchema = yup.object().shape({
  nom: yup.string().required("Le nom du fournisseur  est requis"),
  contact: yup.string().required("Le matricule est requis"), 
});
