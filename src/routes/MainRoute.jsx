import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Homepage from "../pages/Homepage";
import InscriptClient from "../pages/inscription/InscriptClient";
import InterogStatut from "../pages/inscription/InterogStatut";
import PaiementManuel from "../pages/paiement/PaiementManuel";
import PaiementFichier from "../pages/paiement/PaiementFichier";
import Stautut from "../pages/paiement/Stautut";
import BddClient from "../pages/bdd/BddClient";
import BddFacture from "../pages/bdd/BddFacture";
import Service from "../pages/bdd/Service";
import Intervenant from "../pages/bdd/Intervenant/Intervenant";
import MajBdd from "../pages/bdd/MajBdd";

import Prestataire from "../pages/parametre/Prestataire";
import Util from "../pages/parametre/Util";
import AjoutUtilisateur from "../pages/utilisateurs/AjoutUtilisateur";
import ListeUtilisateurs from "../pages/utilisateurs/ListeUtilisateurs";

const MainRoute = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/inscription/client" element={<InscriptClient />} />
          <Route path="/inscription/statut" element={<InterogStatut />} />
          <Route path="paiement/manuel" element={<PaiementManuel />} />
          <Route path="/paiement/fichier" element={<PaiementFichier />} />
          <Route path="/paiement/statut" element={<Stautut />} />

          <Route path="/bdd/client" element={<BddClient />} />
          <Route path="/bdd/facture" element={<BddFacture />} />

          <Route path="/bdd/service" element={<Service />} />

          <Route path="/bdd/intervenant" element={<Intervenant />} />
          <Route path="/bdd/maj" element={<MajBdd />} />

          <Route path="/param/prestataire" element={<Prestataire />} />
          <Route path="/param/util" element={<Util />} />
        </Route>
        <Route path="/liste-user" element={<ListeUtilisateurs />} />
        <Route path="/add-user" element={<AjoutUtilisateur />} />
        <Route path="/edit-user/:id" element={<AjoutUtilisateur />} />
      </Routes>
    </Router>
  );
};
export default MainRoute;
