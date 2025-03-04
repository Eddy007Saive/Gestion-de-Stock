import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Create from '../pages/Fournisseur/Create';
import CreateProduit from '../pages/Produit/Create';
import CreateVente from '../pages/Vente/Create';


function AppRoutes() {
  return (
    <Router>
      
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="Fournisseur" element={<Create />} />
        <Route path="Produit" element={<CreateProduit />} />
        <Route path="Vente" element={<CreateVente />} />


      </Route>
    </Routes>
  </Router>
  );
}

export default AppRoutes;
