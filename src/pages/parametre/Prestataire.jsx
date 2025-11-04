import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams, useNavigate } from "react-router-dom";

const Prestataire = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const id = parseInt(searchParams.get("id"), 10);

  const [activeTab, setActiveTab] = useState("prestataire");
  const [urssafTab, setUrssafTab] = useState("production");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const boutonTexte = mode === "MODIFIER" ? "Modifier" : "Enregistrer";

  const [raisonSociale, setRaisonSociale] = useState("");
  const [siret, setSiret] = useState("");
  const [adresse, setAdresse] = useState("");
  const [tel, setTel] = useState("");
  const [mail, setMail] = useState("");
  const [identifiantSAP, setIdentifiantSAP] = useState("");
  const [identifiantAPI, setIdentifiantAPI] = useState("");
  
  // Champs URSSAF Production
  const [clientIDProduction, setClientIDProduction] = useState("");
  const [clientSecretProduction, setClientSecretProduction] = useState("");
  const [scopeProduction, setScopeProduction] = useState("homeplus.tiersprestations");
  const [urlTokenProduction, setUrlTokenProduction] = useState("https://api.urssaf.fr/api/oauth/v1/token");
  const [urlRequeteProduction, setUrlRequeteProduction] = useState("https://api.urssaf.fr/atp/v1/tiersPrestations");
  const [contentTypeProduction, setContentTypeProduction] = useState("application/json");

  // Champs URSSAF Sandbox
  const [clientIDSandBox, setClientIDSandBox] = useState("");
  const [clientSecretSandBox, setClientSecretSandBox] = useState("");
  const [scopeSandBox, setScopeSandBox] = useState("homeplus.tiersprestations");
  const [urlTokenSandBox, setUrlTokenSandBox] = useState("https://api-edi.urssaf.fr/api/oauth/v1/token");
  const [urlRequeteSandBox, setUrlRequeteSandBox] = useState("https://api-edi.urssaf.fr/atp/v1/tiersPrestations");
  const [contentTypeSandBox, setContentTypeSandBox] = useState("application/json");

  // Champ optionnel
  const [apiCrypte, setApiCrypte] = useState("");


  useEffect(() => {
    if (mode === "MODIFIER" && id > 0) {
      fetch(`http://localhost:2083/prestataires/${id}`)
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

      const handleSubmitPrestataire = (e) => {
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

        const url = "http://localhost:2083/prestataires";
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
            alert("Prestataire enregistré avec succès");
            if (mode === "NOUVEAU" && data.id) {
              navigate(`/param/prestataire?mode=MODIFIER&id=${data.id}`);
            }
          })
          .catch((err) => {
            console.error("Erreur API :", err);
            alert("Échec de l'enregistrement");
          });
      };
      
      const handleSubmitUrssaf = (e) => {
            e.preventDefault();

            const basePayload = {
              ...(mode === "MODIFIER" && { ID_Prestataires: id }),
              RaisonSociale: raisonSociale,
              SIRET: siret,
              Adresse: adresse,
              Tel: tel,
              adresseMail: mail,
              IdentifiantSAP: identifiantSAP,
              IdentifiantAPI: identifiantAPI,
              APICrypte: apiCrypte !== "" ? parseInt(apiCrypte, 10) : null,
            };

            const productionPayload = {
              ClientIDProduction: clientIDProduction,
              ClientSecretProduction: clientSecretProduction,
              ScopeProduction: scopeProduction,
              UrlTokenProduction: urlTokenProduction,
              UrlRequeteProduction: urlRequeteProduction,
              ContentTypeProduction: contentTypeProduction,
            };

            const sandboxPayload = {
              ClientIDSandBox: clientIDSandBox,
              ClientSecretSandBox: clientSecretSandBox,
              ScopeSandBox: scopeSandBox,
              UrlTokenSandBox: urlTokenSandBox,
              UrlRequeteSandBox: urlRequeteSandBox,
              ContentTypeSandBox: contentTypeSandBox,
            };

            const payload = {
              ...basePayload,
              ...(urssafTab === "production" ? productionPayload : {}),
              ...(urssafTab === "sandbox" ? sandboxPayload : {}),
            };

            fetch("http://localhost:2083/prestataires", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Erreur lors de la mise à jour URSSAF");
                return res.json();
              })
              .then(() => {
                alert("Paramètres URSSAF enregistrés avec succès");
              })
              .catch((err) => {
                console.error("Erreur API URSSAF :", err);
                alert("Échec de l'enregistrement des paramètres URSSAF");
              });
          };


  return (
    <div className="container mt-4">
      {/* Fenêtre modale mot de passe */}
      {showPasswordModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
        >
          <div className="modal-dialog w-100" style={{ maxWidth: "400px" }}>
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Mot de passe requis</h5>
                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button className="btn btn-outline-secondary" onClick={() => setShowPasswordModal(false)}>
                  Annuler
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (passwordInput === "URSSAF@2025!") {
                      setActiveTab("urssaf");
                      setShowPasswordModal(false);
                      setPasswordInput("");
                    } else {
                      alert("Mot de passe incorrect");
                    }
                  }}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="text-center mb-4">
          <h1 className="fw-semibold text-primary">
            {mode === "MODIFIER" ? `Modifier le prestataire (ID ${id})` : `Nouveau prestataire`}
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
                onClick={() => {
                  alert("L'accès à cet onglet nécessite la saisie du mot de passe");
                  setShowPasswordModal(true);
                }}
              >
                Paramètres URSSAF
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {activeTab === "prestataire" && (
            <form className="row g-3" onSubmit={activeTab === "prestataire" ? handleSubmitPrestataire : handleSubmitUrssaf}>
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
             <>
               {/* Sous-onglets URSSAF */}
                  <ul className="nav nav-pills mb-3">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${urssafTab === "production" ? "active" : ""}`}
                        onClick={() => setUrssafTab("production")}
                      >
                        Production
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${urssafTab === "sandbox" ? "active" : ""}`}
                        onClick={() => setUrssafTab("sandbox")}
                      >
                        Sandbox
                      </button>
                    </li>
                  </ul>

                  <form className="row g-3" onSubmit={activeTab === "prestataire" ? handleSubmitPrestataire : handleSubmitUrssaf}>

                    {/* Champs dynamiques selon sous-onglet */}
                    {urssafTab === "production" && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-danger">Client ID</label>
                          <input type="text" className="form-control" value={clientIDProduction} onChange={(e) => setClientIDProduction(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-danger">Client Secret</label>
                          <input type="text" className="form-control" value={clientSecretProduction} onChange={(e) => setClientSecretProduction(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Scope</label>
                          <input type="text" className="form-control" value={scopeProduction} onChange={(e) => setScopeProduction(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Content-Type</label>
                          <input type="text" className="form-control" value={contentTypeProduction} onChange={(e) => setContentTypeProduction(e.target.value)} />
                        </div>
                        <div className="col-12">
                          <label className="form-label">URL Token</label>
                          <input type="text" className="form-control" value={urlTokenProduction} onChange={(e) => setUrlTokenProduction(e.target.value)} />
                        </div>
                        <div className="col-12">
                          <label className="form-label">URL Requête</label>
                          <input type="text" className="form-control" value={urlRequeteProduction} onChange={(e) => setUrlRequeteProduction(e.target.value)} />
                        </div>
                      </>
                    )}

                    {urssafTab === "sandbox" && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-danger">Client ID</label>
                          <input type="text" className="form-control" value={clientIDSandBox} onChange={(e) => setClientIDSandBox(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-danger">Client Secret</label>
                          <input type="text" className="form-control" value={clientSecretSandBox} onChange={(e) => setClientSecretSandBox(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Scope</label>
                          <input type="text" className="form-control" value={scopeSandBox} onChange={(e) => setScopeSandBox(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Content-Type</label>
                          <input type="text" className="form-control" value={contentTypeSandBox} onChange={(e) => setContentTypeSandBox(e.target.value)} />
                        </div>
                        <div className="col-12">
                          <label className="form-label">URL Token</label>
                          <input type="text" className="form-control" value={urlTokenSandBox} onChange={(e) => setUrlTokenSandBox(e.target.value)} />
                        </div>
                        <div className="col-12">
                          <label className="form-label">URL Requête</label>
                          <input type="text" className="form-control" value={urlRequeteSandBox} onChange={(e) => setUrlRequeteSandBox(e.target.value)} />
                        </div>
                      </>
                    )}

                    {/*  Bouton unique pour Enregistrer ou Modifier */}
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-primary">
                        {boutonTexte}
                      </button>
                    </div>
                  </form>

                
              </>

          )}
        </div>
      </div>
    </div>
  );
};

export default Prestataire;

