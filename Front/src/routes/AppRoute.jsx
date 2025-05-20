import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Home } from "@/pages/dashboard";
import { Create as NewProduit ,liste as Produit,Update as UpdateProduct,ImportProduits} from "@/pages/Produit";
import { Create as NewFournisseur,liste as Fournisseur,Update as UpdateFournisseur } from "@/pages/Fournisseur";
import { Create as NewCommande , liste as Commande } from "@/pages/Vente";
import { Create as NewCategorie,liste as Category ,Update as UpdateCategory } from "@/pages/Categorie";
import { ListeApprovisionnement } from "@/pages/Achat";




import { SignIn, SignUp } from "@/pages/auth";

export function AppRoute() {
  return (
    <Routes>
      {/* Routes Dashboard avec Outlet */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="home" element={<Home />} />

        <Route path="produit" element={<Produit />} />
        <Route path="nouveau/produit" element={<NewProduit />} />
        <Route path="modifier/produit/:id" element={<UpdateProduct />} />
        <Route path="produit/import" element={<ImportProduits />} />



        <Route path="nouveau/fournisseur" element={<NewFournisseur />} />
        <Route path="fournisseur" element={<Fournisseur />} />
        <Route path="modifier/fournisseur/:id" element={<UpdateFournisseur />} />

        <Route path="categorie" element={<Category />} />
        <Route path="nouveau/categorie" element={<NewCategorie />} />
        <Route path="modifier/categorie/:id" element={<UpdateCategory />} />

        {/* Route pour la création de commande */}
        <Route path="commande" element={<Commande />} />
        <Route path="nouveau/commande" element={<NewCommande />} />

        <Route path="approvisionnement" element={<ListeApprovisionnement />} />



        {/* Redirection par défaut vers home */}
        <Route index element={<Navigate to="home" replace />} />
      </Route>
      {/* Routes Auth avec Outlet */}
      <Route path="/auth" element={<Auth />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        
        {/* Redirection par défaut vers sign-in */}
        <Route index element={<Navigate to="sign-in" replace />} />
      </Route>
      
      {/* Redirection globale */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

