import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Field from "../../components/inscription/Field";
import "./InscriptClient.css";
import { fetchMetaData } from "../../services/metaService";
import {
  postToUrssaf,
  createParticulier,
} from "../../services/particulierService";
import {
  isValidEmail,
  isValidPhone,
  isValidBIC,
  isValidIBAN,
  checkRequiredFields,
  isCodeCommuneValid,
  isCodeInseeValid,
} from "../../utils/validationUtils";
import Confirmation from "../../components/Modal/Confirmation";

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
  const [metaData, setMetaData] = useState({
    pays: [],
    codeTypeVoie: [],
    departement: [],
  });
  useEffect(() => {
    fetchMetaData()
      .then((data) => setMetaData(data))
      .catch((err) => {
        console.error("Erreur chargement meta:", err);
      });
  }, []);

  const [isFromJson, setIsFromJson] = useState(false);

  // Confirmation modal state (replaces alert())
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const showConfirm = (title, message) =>
    setConfirmState({
      isOpen: true,
      title: title || "",
      message: message || "",
    });
  const closeConfirm = () =>
    setConfirmState({ isOpen: false, title: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nomPays" || name === "nomPays2") {
      const selectedCountry = metaData.pays.find((c) => c.codePays === value);

      if (name === "nomPays") {
        setFormData((p) => ({
          ...p,
          nomPays: selectedCountry?.nomPays || "",
          codePays: selectedCountry?.codePays || value,
        }));
      } else {
        setFormData((p) => ({
          ...p,
          nomPays2: selectedCountry?.nomPays || "",
          codePays2: selectedCountry?.codePays || value,
        }));
      }
      return;
    }
    if (name === "departement") {
      const selectedDep = metaData.departement.find(
        (d) => d.codeDepartement === value
      );
      setFormData((p) => ({
        ...p,
        departement: selectedDep ? selectedDep.codeDepartement : value,
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleFileImport = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f.name);
      setIsFromJson(true);

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

            nomPays:
              metaData.pays.find(
                (c) => c.codePays === jsonData.lieuNaissance?.codePaysNaissance
              )?.nomPays || "",
            codePays: jsonData.lieuNaissance?.codePaysNaissance || "",
            departement: jsonData.lieuNaissance?.departementNaissance || "",
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
              metaData.pays.find(
                (c) => c.codePays === jsonData.adressePostale?.codePays
              )?.nomPays || "FRANCE",
            codePays2: jsonData.adressePostale?.codePays || "99100",

            bic: jsonData.coordonneeBancaire?.bic || "",
            iban: jsonData.coordonneeBancaire?.iban || "",
            titulaire: jsonData.coordonneeBancaire?.titulaire || "",

            idClient: jsonData.idClient || jsonData.idParticulier || "",
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
        options: metaData.pays.map((p) => ({
          codePays: p.codePays,
          nomPays: p.nomPays,
        })),
        col: "col-8",
      },
      {
        label: "Code Pays",
        name: "codePays",
        col: "col-4",
      },
    ],
    [
      {
        label: "Département",
        name: "departement",
        type: "select",
        options: metaData.departement.map((d) => ({
          code: d.codeDepartement,
          nom: d.nomDepartement,
        })),
      },
    ],
    [{ label: "Code Commune", name: "codeCommune", col: "col-6" }],
    [{ label: "Nom commune", name: "nomCommune" }],
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
        options: metaData.codeTypeVoie.map((v) => ({
          code: v.Code,
          name: v.Libelle,
        })),
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
        col: "col-8",
        type: "select",
        options: metaData.pays.map((p) => ({
          codePays: p.codePays,
          nomPays: p.nomPays,
        })),
      },

      { label: "Code pays", name: "codePays2", col: "col-4" },
    ],
    [{ label: "Bic", name: "bic", placeholder: "(Sans espace)" }],
    [{ label: "IBAN", name: "iban", placeholder: "(Sans espace)" }],
    [{ label: "Titulaire", name: "titulaire" }],
    [{ label: "Id Particulier", name: "idParticulier" }],
  ];
  const fieldConfigs = [...leftFields.flat(), ...rightFields.flat()];
  const labelMap = Object.fromEntries(
    fieldConfigs.map((f) => [f.name, f.label || f.name])
  );

  const validateForm = () => {
    // 1) required fields first — show only that error if any
    const missing = checkRequiredFields(formData, greenFieldNames);
    if (missing.length > 0) {
      const labels = missing.map((n) => labelMap[n] || n).join(", ");
      showConfirm(
        "Validation",
        `Veuillez remplir les champs obligatoires marqués en rouge`
      );
      return false;
    }

    // 2) other validations — show first encountered error only
    if (formData.adresseMail && !isValidEmail(formData.adresseMail)) {
      showConfirm("Validation", "Adresse email invalide.");
      return false;
    }

    if (formData.numTelPortable && !isValidPhone(formData.numTelPortable)) {
      showConfirm(
        "Validation",
        "Numéro de téléphone portable invalide (9-15 chiffres)."
      );
      return false;
    }

    if (formData.iban && !isValidIBAN(formData.iban)) {
      showConfirm("Validation", "IBAN invalide.");
      return false;
    }
    if (formData.bic && !isValidBIC(formData.bic)) {
      showConfirm("Validation", "BIC invalide (8 ou 11 caractères).");
      return false;
    }

    // Code commune / INSEE
    const codeCommune = String(formData.codeCommune || "").trim();
    const codeInsee = String(formData.codeInsee || "").trim();

    const validCommune = isCodeCommuneValid(codeCommune);
    const validInsee = isCodeInseeValid(codeInsee);

    if (!validCommune) {
      showConfirm(
        "Validation",
        "Code commune (lieu naissance) invalide ou manquant (attendu 3 chiffres)."
      );
      return false;
    }
    if (validCommune && !validInsee) {
      // autofill adresse postale codeInsee from birthplace codeCommune
      setFormData((p) => ({ ...p, codeInsee: codeCommune }));
    }

    // Pays / codes pays consistency
    if (!formData.codePays || String(formData.codePays).trim() === "") {
      const found = metaData.pays.find(
        (c) => c.nomPays === formData.nomPays || c.codePays === formData.nomPays
      );
      if (found) {
        setFormData((p) => ({ ...p, codePays: found.codePays }));
      } else {
        showConfirm(
          "Validation",
          "Code pays (lieu naissance) manquant ou invalide."
        );
        return false;
      }
    }
    if (!formData.codePays2 || String(formData.codePays2).trim() === "") {
      const found2 = metaData.pays.find(
        (c) =>
          c.nomPays === formData.nomPays2 || c.codePays === formData.nomPays2
      );
      if (found2) {
        setFormData((p) => ({ ...p, codePays2: found2.codePays }));
      } else {
        showConfirm(
          "Validation",
          "Code pays (adresse postale) manquant ou invalide."
        );
        return false;
      }
    }

    return true;
  };

  const submit = async () => {
    // submit uses the shared validateForm (defined above) and utils

    // Run validations before preparing payload
    if (!validateForm()) return;

    const usedCodeInsee = /^\d{5}$/.test(
      String(formData.codeInsee || "").trim()
    )
      ? formData.codeInsee
      : /^\d{5}$/.test(String(formData.codeCommune || "").trim())
      ? formData.codeCommune
      : formData.codeInsee;

    const usedCodePays =
      formData.codePays ||
      metaData.pays.find(
        (c) => c.nomPays === formData.nomPays || c.codePays === formData.nomPays
      )?.codePays ||
      formData.codePays;

    const usedCodePays2 =
      formData.codePays2 ||
      metaData.pays.find(
        (c) =>
          c.nomPays === formData.nomPays2 || c.codePays === formData.nomPays2
      )?.codePays ||
      formData.codePays2;

    const jsonData = {
      methode: "/particulier",
      civilite: formData.civilite === "M" ? "1" : "2",
      nomNaissance: formData.nomNaissance,
      nomUsage: formData.nomUsage || formData.nomNaissance,
      prenoms: formData.prenoms,
      dateNaissance: formData.dateNaissance
        ? new Date(formData.dateNaissance).toISOString()
        : "",
      lieuNaissance: {
        codePaysNaissance: usedCodePays,
        departementNaissance: formData.departement,
        communeNaissance: {
          codeCommune: formData.codeCommune,
          libelleCommune: formData.nomCommune,
        },
      },
      numeroTelephonePortable: formData.numTelPortable,
      adresseMail: formData.adresseMail,
      adressePostale: {
        numeroVoie: formData.numeroVoie,
        lettreVoie: formData.lettreVoie || "",
        codeTypeVoie: formData.codeTypeVoie,
        libelleVoie: formData.libelleVoie,
        complement: formData.complement || "",
        lieuDit: formData.lieuDit || "",
        libelleCommune: formData.nomCommune2,
        codeCommune: usedCodeInsee,
        codePostal: formData.codePostal,
        codePays: usedCodePays2,
      },
      coordonneeBancaire: {
        bic: formData.bic,
        iban: formData.iban,
        titulaire: formData.titulaire,
      },
    };

    try {
      const existingIdClient =
        formData.idClient || formData.idParticulier || "";

      if (existingIdClient) {
        const payload = {
          ...jsonData,
          idClient: formData.idClient || formData.idParticulier,
        };
        const createResp = await createParticulier(payload);
        console.log("Created in backend (direct):", createResp);
        showConfirm("Succès", "Particulier ajouté en base (id existant).");
        return;
      }

      const urssafResp = await postToUrssaf(jsonData);

      const returnedId = urssafResp?.idClient || urssafResp?.id || null;
      if (!returnedId) {
        console.warn("URSSAF response didn't include idClient:", urssafResp);
        showConfirm(
          "URSSAF",
          "URSSAF a répondu sans idClient — vérifiez la réponse"
        );
        return;
      }

      // Enrich and persist to backend
      const enriched = { ...jsonData, idClient: returnedId };
      const created = await createParticulier(enriched);
      console.log("URSSAF OK, created in backend:", created);

      setFormData((prev) => ({ ...prev, idClient: returnedId }));
      showConfirm(
        "Succès",
        "Données envoyées à URSSAF et enregistrées en base avec idClient: " +
          returnedId
      );
    } catch (error) {
      console.error("Erreur lors du process URSSAF -> backend:", error);
      showConfirm(
        "Erreur envoi",
        "Erreur lors de l'envoi des données (URSSAF ou backend).\n" +
          (error?.message || "")
      );
    }
  };

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
            fieldValue = formData.codePays || "";
          } else if (f.name === "nomPays2") {
            fieldValue = formData.codePays2 || "";
          } else if (f.name === "departement") {
            fieldValue = formData.departement || "";
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
                  isFromJson={isFromJson}
                  required
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
      <Confirmation
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onClose={closeConfirm}
      />
    </div>
  );
};

export default InscriptClient;
