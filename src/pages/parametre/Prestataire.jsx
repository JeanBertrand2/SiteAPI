import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Prestataire = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // "NOUVEAU" ou "MODIFIER"
  const id = parseInt(searchParams.get("id"), 10);

  const [activeTab, setActiveTab] = useState("prestataire");
  const boutonTexte = mode === "MODIFIER" ? "Modifier" : "Enregistrer";

  // Champs du formulaire
  const [raisonSociale, setRaisonSociale] = useState("");
  const [siret, setSiret] = useState("");
  const [adresse, setAdresse] = useState("");
  const [tel, setTel] = useState("");
  const [mail, setMail] = useState("");
  const [identifiantSAP, setIdentifiantSAP] = useState("");
  const [identifiantAPI, setIdentifiantAPI] = useState("");

  // Charger les données si mode MODIFIER
  useEffect(() => {
    if (mode === "MODIFIER" && id > 0) {
      fetch(`http://localhost:2083/api/prestataires/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setRaisonSociale(data.RaisonSociale || "");
          setSiret(data.SIRET || "");
          setAdresse(data.Adresse || "");
          setTel(data.Tel || "");
          setMail(data.adresseMail || "");
          setIdentifiantSAP(data.IdentifiantSAP || "");
          setIdentifiantAPI(data.IdentifiantAPI || "");
        })
        .catch((err) => console.error("Erreur chargement prestataire :", err));
    }
  }, [mode, id]);

  // Soumission du formulaire
  const handleSubmit = (e) => {
          e.preventDefault();

          const payload = {
            RaisonSociale: raisonSociale,
            SIRET: siret,
            Adresse: adresse,
            Tel: tel,
            adresseMail: mail,
            IdentifiantSAP: identifiantSAP,
            IdentifiantAPI: identifiantAPI,
            ...(mode === "MODIFIER" && { ID_Prestataires: id }),
          };

          const url = "http://localhost:2083/api/prestataires";
          const method = mode === "MODIFIER" ? "PUT" : "POST";

          fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
              return res.json();
            })
            .then((data) => {
              console.log("✅ Réponse API :", data);
              alert("Prestataire enregistré avec succès");

              // 🔁 Rediriger vers mode=MODIFIER après ajout
              if (mode === "NOUVEAU") {
                // Si l'API renvoie l'ID, utilise-le
                if (data.ID_Prestataires) {
                  navigate(`/param/prestataire?mode=MODIFIER&id=${data.ID_Prestataires}`);
                } else {
                  // Sinon, re-fetch l'ID via /existe
                  fetch("http://localhost:2083/api/prestataires/existe")
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.exists) {
                        navigate(`/param/prestataire?mode=MODIFIER&id=${res.id}`);
                      }
                    });
                }
              }
    })
    .catch((err) => console.error(" Erreur API :", err));
};

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="text-center mb-4">
          <h1 className="text-center mb-4 fw-semibold text-primary">
            {mode === "MODIFIER"
              ? `Modifier le prestataire (ID ${id})`
              : `Nouveau prestataire`}
          </h1>
        </div>

        <div className="card-header bg-white border-bottom-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "prestataire" ? "active" : ""}`}
                onClick={() => setActiveTab("prestataire")}
              >
                Prestataire
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "urssaf" ? "active" : ""}`}
                onClick={() => setActiveTab("urssaf")}
              >
                Paramètres URSSAF
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {activeTab === "prestataire" && (
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label className="form-label text-danger fw-semibold">Raison sociale</label>
                <input
                  type="text"
                  className="form-control border-danger"
                  value={raisonSociale}
                  onChange={(e) => setRaisonSociale(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">SIRET</label>
                <input
                  type="text"
                  className="form-control"
                  value={siret}
                  onChange={(e) => setSiret(e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-control"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tél</label>
                <input
                  type="text"
                  className="form-control"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ex: 0321234567"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mail</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="exemple@domaine.com"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-danger fw-semibold">Identifiant SAP</label>
                <input
                  type="text"
                  className="form-control border-danger"
                  value={identifiantSAP}
                  onChange={(e) => setIdentifiantSAP(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-danger fw-semibold">Identifiant API</label>
                <input
                  type="text"
                  className="form-control border-danger"
                  value={identifiantAPI}
                  onChange={(e) => setIdentifiantAPI(e.target.value)}
                />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">
                  {boutonTexte}
                </button>
              </div>
            </form>
          )}

          {activeTab === "urssaf" && (
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Code URSSAF</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Régime</label>
                <select className="form-select">
                  <option>Auto-entrepreneur</option>
                  <option>Indépendant</option>
                  <option>Société</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Commentaire</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">
                  {boutonTexte}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prestataire;
