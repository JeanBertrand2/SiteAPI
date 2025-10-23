import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navbarPositionStyle = isMobile ? "fixed" : "absolute";

  const navbarBackgroundColor = isMobile && scrolled ? "#c6eef3" : "#c6eef365";

  return (   
  <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
  >
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown" style={{margin:"auto"}} >
      <ul className="navbar-nav" style={{margin:"15px auto"}}>
        <li className="nav-item dropdown">
          <Link className="nav-link" to="/"  onClick={handleNavCollapse}>
                  ACCUEIL
              </Link>
          </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            INSCRIPTION CLIENT
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <Link className="nav-link " to="/inscription/client"  onClick={handleNavCollapse}>
                  NOUVEAU CLIENT
              </Link>
              <Link className="nav-link " to="/inscription/statut"  onClick={handleNavCollapse}>
                  INTERROGATION STATUT CLIENT
              </Link>
            
          </div>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            DEMANDE DE PAIEMENT
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <Link className="nav-link" to="/paiment/manuel" style={{ color: "black" }} onClick={handleNavCollapse}>
                  PAIEMENT MANUELLE
              </Link>
              <Link className="nav-link" to="/paiment/fichier" style={{ color: "black" }} onClick={handleNavCollapse}>
                  PAIMENT A PARTIR D'UN FICHIER
              </Link>
              <Link className="nav-link" to="/paiment/statut" style={{ color: "black" }} onClick={handleNavCollapse}>
                  STATUT
              </Link>
            
          </div>
        </li>
        <li className="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            BASE DE DONNÉES
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <Link className="nav-link" to="/bdd/client" style={{ color: "black" }} onClick={handleNavCollapse}>
                  AJOUTER DES CLIENTS DÉJA INSCRITS
              </Link>
              <Link className="nav-link" to="/bdd/facture" style={{ color: "black" }} onClick={handleNavCollapse}>
                AJOUTER DES FACTURES DÉJA ENVOYÉES
              </Link>
              <Link className="nav-link" to="/bdd/service" style={{ color: "black" }} onClick={handleNavCollapse}>
                CRÉER DES SERVICES
              </Link>
              <Link className="nav-link" to="/bdd/intervenant" style={{ color: "black" }} onClick={handleNavCollapse}>
                CRÉER DES INTERVENANTS
              </Link>
              <Link className="nav-link" to="/bdd/maj" style={{ color: "black" }} onClick={handleNavCollapse}>
                MISE A JOUR DES DONNÉES DE BASE
              </Link>
            
            
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          PARAMÈTRE
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <Link className="nav-link" to="/param/prestataire" style={{ color: "black" }} onClick={handleNavCollapse}>
                PRESTATAIRE
              </Link>
              <Link className="nav-link" to="/param/util" style={{ color: "black" }} onClick={handleNavCollapse}>
                UTILISER VERSION SANDBOX
              </Link>
        </div>
        </li>
      </ul>
    </div>
</nav>
   
  );
};

export default Navbar;
