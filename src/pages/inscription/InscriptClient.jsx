import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Field from "../../components/inscription/Field";
import "./InscriptClient.css";

const InscriptClient = () => {
  const initial = {
    fichierJson: "",
    civilite: "",
    nomNaissance: "",
    nomUsage: "",
    prenoms: "",
    dateNaissance: "",
    nomPays: "",
    departement: "",
    commune: "",
    codeCommune: "",
    nomCommune: "",
    numTelPortable: "",
    adresseMail: "",
    numeroVoie: "",
    lettreVoie: "",
    codeTypeVoie: "",
    libelleVoie: "",
    complement: "",
    lieuDit: "",
    nomCommune2: "",
    codeInsee: "",
    codePostal: "",
    nomPays2: "FRANCE",
    codePays: "99100",
    bic: "",
    iban: "",
    titulaire: "",
    idParticulier: "",
  };
  const lettresVoie = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const typesVoie = [
    { key: "ALL", label: "Allée" },
    { key: "AVE", label: "Avenue" },
    { key: "BLVD", label: "Boulevard" },
    { key: "CHE", label: "Chemin" },
    { key: "CIT", label: "Cité" },
    { key: "CLOS", label: "Clos" },
    { key: "COR", label: "Corniche" },
    { key: "COURS", label: "Cours" },
    { key: "DOM", label: "Domaine" },
    { key: "ESP", label: "Esplanade" },
    { key: "IMP", label: "Impasse" },
    { key: "JARD", label: "Jardin" },
    { key: "LOT", label: "Lotissement" },
    { key: "PASS", label: "Passage" },
    { key: "PLC", label: "Place" },
    { key: "PLN", label: "Plaine" },
    { key: "PONT", label: "Pont" },
    { key: "PORT", label: "Port" },
    { key: "QUAI", label: "Quai" },
    { key: "RUEL", label: "Ruelle" },
    { key: "ROUTE", label: "Route" },
    { key: "RUE", label: "Rue" },
    { key: "SQ", label: "Square" },
    { key: "TERR", label: "Terrasse" },
    { key: "TRAV", label: "Traverse" },
    { key: "VILLA", label: "Villa" },
    { key: "VOIE", label: "Voie" },
    { key: "ZONE", label: "Zone" },
  ];

  const [formData, setFormData] = useState(initial);
  const [selectedFile, setSelectedFile] = useState("");
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const data = await res.json();
        const countryNames = data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (err) {
        console.error("Erreur pays :", err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await fetch("https://geo.api.gouv.fr/departements");
        const data = await res.json();
        const deptNames = data
          .map((d) => d.nom)
          .sort((a, b) => a.localeCompare(b));
        setDepartments(deptNames);
      } catch (err) {
        console.error("Erreur départements :", err);
      }
    };

    fetchCountries();
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileImport = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f.name);
      setFormData((p) => ({ ...p, fichierJson: f.name }));
    }
  };

  const openFile = () => document.getElementById("fileInput").click();
  const submit = () => console.log("Form submitted:", formData);

  const greenFieldNames = [
    "civilite",
    "nomNaissance",
    "prenoms",
    "dateNaissance",
    "nomPays",
    "codeCommune",
    "nomCommune",
    "numTelPortable",
    "adresseMail",
    "nomCommune2",
    "codeInsee",
    "codePostal",
    "nomPays2",
    "codePays",
    "bic",
    "iban",
    "titulaire",
  ];

  const leftFields = [
    [
      {
        label: "Civilité",
        name: "civilite",
        type: "select",
        options: ["M", "MME"],
      },
    ],
    [{ label: "Nom Naissance", name: "nomNaissance" }],
    [{ label: "Nom Usage", name: "nomUsage" }],
    [{ label: "Prénom s", name: "prenoms" }],
    [{ label: "Date de naissance", name: "dateNaissance", type: "date" }],
    [
      {
        label: "Nom Pays",
        name: "nomPays",
        type: "select",
        options: countries,
      },
    ],
    [
      {
        label: "Département",
        name: "departement",
        type: "select",
        options: departments,
      },
    ],
    [{ label: "Commune", name: "commune", readOnly: false }],
    [
      { label: "Code Commune", name: "codeCommune", col: "col-6" },
      { label: "\u00A0", name: "nomCommune", col: "col-6", readOnly: true },
    ],
    [
      {
        label: "Num Tel Portable",
        name: "numTelPortable",
        placeholder: "(Sans espace)",
      },
    ],
    [{ label: "Adresse Mail", name: "adresseMail", type: "email" }],
  ];

  const rightFields = [
    [
      { label: "Numero Voie", name: "numeroVoie", col: "col-6" },

      {
        label: "Lettre Voie",
        name: "lettreVoie",
        col: "col-6",
        type: "select",
        options: lettresVoie,
      },
    ],
    [
      {
        label: "Code Type Voie",
        name: "codeTypeVoie",
        type: "select",
        options: typesVoie,
      },
    ],
    [{ label: "Libelle Voie", name: "libelleVoie" }],
    [{ label: "Complement", name: "complement" }],
    [{ label: "Lieu dit", name: "lieuDit" }],
    [{ label: "Nom Commune", name: "nomCommune2" }],
    [{ label: "Code INSEE", name: "codeInsee" }],
    [{ label: "Code Postal", name: "codePostal" }],
    [
      {
        label: "Nom Pays",
        name: "nomPays2",
        col: "col-6",
        type: "select",
        options: countries,
      },

      { label: "Code pays", name: "codePays", col: "col-6" },
    ],
    [{ label: "Bic", name: "bic", placeholder: "(Sans espace)" }],
    [{ label: "IBAN", name: "iban", placeholder: "(Sans espace)" }],
    [{ label: "Titulaire", name: "titulaire" }],
    [{ label: "Id Particulier", name: "idParticulier", readOnly: true }],
  ];

  const renderConfig = (config) =>
    config.map((row, idx) => (
      <div className="mb-3 row align-items-center " key={idx}>
        {row.map((f, fieldIdx) => {
          const labelContent = greenFieldNames.includes(f.name) ? (
            <span style={{ color: "#e05f23ff", fontWeight: "bold" }}>
              {f.label}
            </span>
          ) : (
            f.label
          );

          return (
            <div className="row mb-2" key={fieldIdx}>
              <div className="col-4">
                <label
                  className="form-label mb-0"
                  style={{ fontSize: "13px" }}
                  htmlFor={f.name}
                >
                  {labelContent}
                </label>
              </div>
              <div className="col-8">
                <Field
                  field={f}
                  value={formData[f.name]}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          );
        })}
      </div>
    ));

  const personalInfoFields = leftFields.slice(0, 5); // Fields before Lieu naissance
  const birthplaceFields = leftFields.slice(5, 7); // Fields for Lieu naissance (Nom pays and Département only)
  const contactFields = leftFields.slice(9); // Fields after Lieu naissance
  const communeFields = leftFields.slice(7, 9); // Fields for Commune (Code commune and nom commune)
  const banqueFields = rightFields.slice(9, 12); // Fields for Coordonnée Bancaire
  const adressePostaleFields = rightFields.slice(0, 9); // Fields for Adresse Postale
  const idParticulierField = rightFields.slice(12); // Field for Id Particulier

  return (
    <div className="inscription-container">
      <div className="card shadow-sm inscription-card">
        <div className="card-header d-flex justify-content-between align-items-center inscription-header">
          <span className="header-title">📋 INSCRIPTION PARTICULIER</span>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: "#d4e3f3",
                border: "1px solid gray",
                margin: "2px",
              }}
            >
              ─
            </button>
            <button
              className="btn btn-sm"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: "#d4e3f3",
                border: "1px solid gray",
                margin: "2px",
              }}
            >
              □
            </button>
            <button
              className="btn btn-sm btn-danger"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                margin: "2px",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="card-body inscription-body">
          <div className="row">
            {/* Form Column - 5/6 width */}
            <div className="col-10">
              <div className="row mb-3">
                <div
                  className="col-md-12"
                  style={{
                    display: "flex",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <label className="form-label label-style">Fichier Json</label>

                  <div
                    className="input-group"
                    style={{
                      width: "100%",
                    }}
                  >
                    <input
                      className="form-control form-control-sm"
                      readOnly
                      value={selectedFile || ""}
                    />
                    <input
                      id="fileInput"
                      type="file"
                      accept=".json"
                      style={{ display: "none" }}
                      onChange={handleFileImport}
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-sm mb-3"
                    style={{ width: "5%" }}
                    onClick={openFile}
                  >
                    ...
                  </button>
                </div>
              </div>
              <h3
                className="form-label section-title"
                style={{ color: "gray", textDecoration: "underline" }}
              >
                Particulier
              </h3>

              <div style={{ border: "1px solid lightgray ", padding: "10px" }}>
                <div className="row">
                  <div className="col-md-6">
                    {renderConfig(personalInfoFields)}

                    <h3
                      className="form-label section-title"
                      style={{ color: "gray", textDecoration: "underline" }}
                    >
                      Lieu naissance
                    </h3>

                    <div
                      style={{
                        border: "1px solid lightgray",
                        padding: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      {renderConfig(birthplaceFields)}

                      <h3
                        className="form-label section-title"
                        style={{ color: "gray", textDecoration: "underline" }}
                      >
                        Commune
                      </h3>
                      <div
                        style={{
                          border: "1px solid lightgray",
                          padding: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        {renderConfig(communeFields)}
                      </div>
                    </div>

                    {renderConfig(contactFields)}
                  </div>

                  <div className="col-md-6">
                    <h3
                      className="form-label section-title"
                      style={{ color: "gray", textDecoration: "underline" }}
                    >
                      Adresse Postale
                    </h3>
                    <div
                      style={{
                        border: "1px solid lightgray",
                        padding: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      {renderConfig(adressePostaleFields)}
                      <h3
                        className="form-label section-title"
                        style={{ color: "gray", textDecoration: "underline" }}
                      >
                        Coordonnée Bancaire
                      </h3>
                      <div
                        style={{
                          border: "1px solid lightgray",
                          padding: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        {renderConfig(banqueFields)}
                      </div>
                    </div>
                    {renderConfig(idParticulierField)}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Column - 1/6 width */}
            <div
              className="col-2 d-flex flex-column justify-content-start"
              style={{ paddingTop: "20px" }}
            >
              <button
                className="btn btn-primary btn-sm mb-3"
                onClick={openFile}
                style={{ width: "100%" }}
              >
                Import Particulier
              </button>

              <a
                href="#"
                className="file-link mb-3"
                style={{ display: "block", textAlign: "center" }}
              >
                Fichier.json
              </a>

              <button
                className="btn btn-primary inscrire-btn"
                onClick={submit}
                style={{ width: "100%" }}
              >
                Inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptClient;
