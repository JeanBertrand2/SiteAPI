import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { EModeOuverture } from "../../Model/EModeOuverture";
const API_URL = process.env.REACT_APP_API_URL;
const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modeOuverture, setModeOuverture] = useState(null);
  const [idPrestataire, setIdPrestataire] = useState(0);
  
  const navigate = useNavigate();

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  
  useEffect(() => {
    fetch(`${API_URL}/prestataires/check`)

      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        const mode = data.exists
          ? EModeOuverture.E_MODIFIER
          : EModeOuverture.E_NOUVEAU;
        setModeOuverture(mode);
        setIdPrestataire(data.exists ? data.id : 0);
      })
      .catch((err) => console.error("Erreur API prestataire :", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse"
        id="navbarNavDropdown"
        style={{ margin: "auto" }}
      >
        <ul className="navbar-nav" style={{ margin: "15px auto" }}>
          <li className="nav-item dropdown">
            <Link className="nav-link" to="/" onClick={handleNavCollapse}>
              ACCUEIL
            </Link>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
            >
              INSCRIPTION CLIENT
            </a>
            <div
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <Link
                className="nav-link"
                to="/inscription/client"
                onClick={handleNavCollapse}
              >
                NOUVEAU CLIENT
              </Link>
              <Link
                className="nav-link"
                to="/inscription/statut"
                onClick={handleNavCollapse}
              >
                INTERROGATION STATUT CLIENT
              </Link>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
            >
              DEMANDE DE PAIEMENT
            </a>
            <div
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <Link
                className="nav-link"
                to="/paiement/manuel"
                style={{ color: "black" }}
                onClick={handleNavCollapse}
              >
                PAIEMENT MANUELLE
              </Link>
              <Link
                className="nav-link"
                to="/paiement/fichier"
                style={{ color: "black" }}
                onClick={handleNavCollapse}
              >
                PAIEMENT A PARTIR D'UN FICHIER
              </Link>
              <Link
                className="nav-link"
                to="/paiement/statut"
                style={{ color: "black" }}
                onClick={handleNavCollapse}
              >
                STATUT
              </Link>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
            >
              BASE DE DONNÉES
            </a>
            <div
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
            
              <Link
                className="nav-link"
                to="/bdd/facture"
                style={{ color: "black" }}
                onClick={handleNavCollapse}
              >
                AJOUTER DES FACTURES DÉJA ENVOYÉES
              </Link>
             
              <Link
                className="nav-link"
                to="/bdd/intervenant"
                style={{ color: "black" }}
                onClick={handleNavCollapse}
              >
                CRÉER DES INTERVENANTS
              </Link>
              <Link
                className="nav-link"
                to="/bdd/maj"
                style={{ color: "black" }}
                onClick={handleNavCollapse}
              >
                MISE A JOUR DES DONNÉES DE BASE
              </Link>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
            >
              PARAMÈTRE
            </a>
            <div
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <button
                className="dropdown-item nav-link btn btn-link"
                style={{
                  color: "black",
                  textAlign: "left",
                  textDecoration: "none",
                }}
                onClick={() => {
                  handleNavCollapse();
                  if (modeOuverture) {
                    console.log(
                      modeOuverture === EModeOuverture.E_MODIFIER
                        ? "Mode MODIFIER : un prestataire existe déjà"
                        : "Mode NOUVEAU : aucun prestataire enregistré"
                    );
                    navigate(
                      `/param/prestataire?mode=${modeOuverture}&id=${idPrestataire}`
                    );
                  } else {
                    console.warn("modeOuverture est null, navigation annulée");
                  }
                }}
              >
                PRESTATAIRE
              </button>

              <Link
                className="nav-link"
                to="/param/util"
                style={{ color: "black" }}
                onClick={handleNavCollapse}
              >
                VERSION 
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
