import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Field from "../../components/inscription/Field";
import "./InscriptClient.css";
import { typesVoie } from "../../constants/typesVoie";
import { COUNTRIES_COG } from "../../constants/countries";
import { departementCode } from "../../constants/departements";

const InscriptClient = () => {
  const initial = {
    fichierJson: "",
    civilite: "",
    nomNaissance: "",
    nomUsage: "",
    prenoms: "",
    dateNaissance: "",
    nomPays: "",
    codePays: "",
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

    codePays2: "99100",
    bic: "",
    iban: "",
    titulaire: "",
    idParticulier: "",
  };
  const lettresVoie = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const [formData, setFormData] = useState(initial);
  const [selectedFile, setSelectedFile] = useState("");
  const [countries, setCountries] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nomPays" || name === "nomPays2") {
      const selectedCountry = COUNTRIES_COG.find(
        (c) => `${c.name} - ${c.code}` === value
      );

      if (name === "nomPays") {
        setFormData((p) => ({
          ...p,
          nomPays: selectedCountry?.name || "",
          codePays: selectedCountry?.code || "",
        }));
      } else {
        setFormData((p) => ({
          ...p,
          nomPays2: selectedCountry?.name || "",
          codePays2: selectedCountry?.code || "",
        }));
      }
      return;
    }
    if (name === "departement") {
      const selectedDep = departementCode.find(
        (d) => `${d.name} - ${d.code}` === value
      );
      setFormData((p) => ({
        ...p,
        departement: selectedDep
          ? `${selectedDep.name} - ${selectedDep.code}`
          : "",
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileImport = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);

          const mapCivilite = (value) => {
            if (value === "1" || value === "M") return "M";
            if (value === "2" || value === "MME") return "MME";
            return "";
          };

          const mappedData = {
            fichierJson: f.name,
            civilite: mapCivilite(jsonData.civilite),
            nomNaissance: jsonData.nomNaissance || "",
            nomUsage: jsonData.nomUsage || "",
            prenoms: jsonData.prenoms || "",
            dateNaissance: jsonData.dateNaissance
              ? jsonData.dateNaissance.split("T")[0]
              : "",

            // Lieu naissance
            nomPays:
              COUNTRIES_COG.find(
                (c) => c.code === jsonData.lieuNaissance?.codePaysNaissance
              )?.name || "",
            codePays: jsonData.lieuNaissance?.codePaysNaissance || "",
            departement: (() => {
              const dep = departementCode.find(
                (d) => d.code === jsonData.lieuNaissance?.departementNaissance
              );
              return dep ? `${dep.name} - ${dep.code}` : "";
            })(),
            commune:
              jsonData.lieuNaissance?.communeNaissance?.libelleCommune || "",
            codeCommune:
              jsonData.lieuNaissance?.communeNaissance?.codeCommune || "",
            nomCommune:
              jsonData.lieuNaissance?.communeNaissance?.libelleCommune || "",

            numTelPortable: jsonData.numeroTelephonePortable || "",
            adresseMail: jsonData.adresseMail || "",

            numeroVoie: jsonData.adressePostale?.numeroVoie || "",
            lettreVoie: jsonData.adressePostale?.lettreVoie || "",
            codeTypeVoie: jsonData.adressePostale?.codeTypeVoie || "",
            libelleVoie: jsonData.adressePostale?.libelleVoie || "",
            complement: jsonData.adressePostale?.complement || "",
            lieuDit: jsonData.adressePostale?.lieuDit || "",
            nomCommune2: jsonData.adressePostale?.libelleCommune || "",
            codeInsee: jsonData.adressePostale?.codeCommune || "",
            codePostal: jsonData.adressePostale?.codePostal || "",
            nomPays2:
              COUNTRIES_COG.find(
                (c) => c.code === jsonData.lieuNaissance?.codePaysNaissance
              )?.name || "FRANCE",
            codePays2: jsonData.adressePostale?.codePays || "99100",

            // Coordonnée Bancaire
            bic: jsonData.coordonneeBancaire?.bic || "",
            iban: jsonData.coordonneeBancaire?.iban || "",
            titulaire: jsonData.coordonneeBancaire?.titulaire || "",

            idParticulier: jsonData.idParticulier || "",
          };

          setFormData(mappedData);
          console.log("JSON imported successfully:", mappedData);
        } catch (err) {
          console.error("Error parsing JSON:", err);
          alert(
            "Erreur lors de la lecture du fichier JSON. Veuillez vérifier le format."
          );
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        alert("Erreur lors de la lecture du fichier.");
      };

      reader.readAsText(f);
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
    "codePays",
    "codeCommune",
    "nomCommune",
    "numTelPortable",
    "adresseMail",
    "nomCommune2",
    "codeInsee",
    "codePostal",
    "nomPays2",
    "codePays2",
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
    [{ label: "Prénoms", name: "prenoms" }],
    [{ label: "Date de naissance", name: "dateNaissance", type: "date" }],
    [
      {
        label: "Nom Pays",
        name: "nomPays",
        type: "select",
        options: COUNTRIES_COG.map((c) => `${c.name} - ${c.code}`),
      },
      {
        label: "Code Pays",
        name: "codePays",
      },
    ],
    [
      {
        label: "Département",
        name: "departement",
        type: "select",
        options: departementCode.map((d) => `${d.name} - ${d.code}`),
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
        options: COUNTRIES_COG.map((c) => `${c.name} - ${c.code}`),
      },

      { label: "Code pays", name: "codePays2", col: "col-6" },
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

          let fieldValue = formData[f.name];
          if (f.name === "nomPays") {
            fieldValue = `${formData.nomPays || ""}${
              formData.codePays ? " - " + formData.codePays : ""
            }`.trim();
          } else if (f.name === "nomPays2") {
            fieldValue = `${formData.nomPays2 || ""}${
              formData.codePays2 ? " - " + formData.codePays2 : ""
            }`.trim();
          }

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
                  value={fieldValue}
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
      <div className="card inscription-card">
        <div
          className="card-header d-flex justify-content-center align-items-center inscription-header"
          style={{ padding: "1rem 10px" }}
        >
          <h1 className="header-title">INSCRIPTION PARTICULIER</h1>
        </div>

        <div
          className="card-body inscription-body"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="row">
            <div className="col-10 mobile-width">
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
