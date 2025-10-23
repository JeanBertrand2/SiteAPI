import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "../../components/inscription/Row";
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
    lieuNaissance: "",
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

  const [formData, setFormData] = useState(initial);
  const [selectedFile, setSelectedFile] = useState("");

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
    [{ label: "Prénoms", name: "prenoms" }],
    [{ label: "Date de naissance", name: "dateNaissance", type: "date" }],
    [{ label: "Lieu Naissance", name: "lieuNaissance" }],
    [
      {
        label: "Nom Pays",
        name: "nomPays",
        type: "select",
        options: ["FRANCE"],
      },
    ],
    [
      {
        label: "Département",
        name: "departement",
        type: "select",
        options: [],
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
        options: [],
      },
    ],
    [
      {
        label: "Code Type Voie",
        name: "codeTypeVoie",
        type: "select",
        options: [],
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
        options: ["FRANCE"],
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
      <Row
        key={idx}
        cols={row.map((f) => ({
          col: f.col || "col-12",
          label: f.label,
          element: (
            <Field
              field={f}
              value={formData[f.name]}
              onChange={handleInputChange}
            />
          ),
        }))}
      />
    ));

  return (
    <div className="inscription-container container-fluid">
      <div className="card shadow-sm inscription-card">
        <div className="card-header d-flex justify-content-between align-items-center inscription-header">
          <span className="header-title">📋 INSCRIPTION PARTICULIER</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-secondary">─</button>
            <button className="btn btn-sm btn-secondary">□</button>
            <button className="btn btn-sm btn-danger">✕</button>
          </div>
        </div>

        <div className="card-body inscription-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label label-style">Fichier Json</label>
              <div className="input-group">
                <input
                  className="form-control form-control-sm"
                  readOnly
                  value={selectedFile || ""}
                />
                <button className="btn btn-primary btn-sm" onClick={openFile}>
                  📁
                </button>
                <input
                  id="fileInput"
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={handleFileImport}
                />
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-end justify-content-end gap-2">
              <button className="btn btn-primary btn-sm" onClick={openFile}>
                Import Particulier
              </button>
              <a href="#" className="file-link">
                Fichier.json
              </a>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className="form-label section-title">Particulier</label>
              {renderConfig(leftFields)}
            </div>

            <div className="col-md-6">
              <label className="form-label section-title">
                Adresse Postale & Coordonnée Bancaire
              </label>
              {renderConfig(rightFields)}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12 text-end">
              <button className="btn btn-primary inscrire-btn" onClick={submit}>
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
