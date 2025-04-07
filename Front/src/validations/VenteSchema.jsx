import * as yup from "yup";

export const VenteSchema = yup.object().shape({
  dateVente: yup.date(),
  produitId: yup.number(),
  quantite: yup.number(),
  prixUnitaire: yup.number(),
  total: yup.number(),
});
