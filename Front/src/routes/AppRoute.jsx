import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Home } from "@/pages/dashboard";
import { Create as NewProduit } from "@/pages/Produit";
import { Create as NewFournisseur } from "@/pages/Fournisseur";
import { Create as NewCommande } from "@/pages/Vente";



import { SignIn, SignUp } from "@/pages/auth";

export function AppRoute() {
  return (
    <Routes>
      {/* Routes Dashboard avec Outlet */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="home" element={<Home />} />
        <Route path="produit" element={<NewProduit />} />
        <Route path="fournisseur" element={<NewFournisseur />} />
        <Route path="commande" element={<NewCommande />} />



      

        
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

