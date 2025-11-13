import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";

import "./InscriptClient.css";
// const urlServer = "https://urssaf.cofident.com/";

const urlServer = "http://localhost:2083/";
console.log("url server = ", urlServer);
const InterogStatut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [staticData, setstaticData] = useState([]);

  const chargeDonnes = async (nomNaissance = "", prenoms = "") => {
    try {
      //
      console.log("url server 2 = ", urlServer);
      await axios
        .get(`${urlServer}particuliers`, {
          params: {
            nomNaissance: nomNaissance,
            prenoms: prenoms,
          },
        })
        .then((response) => {
          setstaticData(response.data);
        })
        .catch((error) => {
          console.log(
            "error lors de chargement de la liste des clients : ",
            error
          );
        });
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  // useEffect(()=>{
  //   const fetchData = async()=>{
  //     await chargeDonnes();

  //   };
  //   fetchData()
  // },[]);

  const [searchCriteria, setSearchCriteria] = useState({
    nomNaissance: "",
    prenoms: "",
  });

  const [searchByIdOrEmail, setSearchByIdOrEmail] = useState({
    idClient: "",
    adresseMail: "",
  });

  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((p) => ({ ...p, [name]: value }));
  };

  const handleIdEmailChange = (e) => {
    const { name, value } = e.target;
    setSearchByIdOrEmail((p) => ({ ...p, [name]: value }));
  };

  const handleSearch = async () => {
    console.log("Rechercher:", searchCriteria);
    const { nomNaissance, prenoms } = searchCriteria;
    await chargeDonnes(nomNaissance, prenoms);
    if (!nomNaissance.trim() && !prenoms.trim()) {
      setSearchResults(staticData);
      return;
    }

    const filtered = staticData.filter((row) => {
      const matchesNom =
        !nomNaissance.trim() ||
        String(row.nomNaissance || "")
          .toLowerCase()
          .includes(nomNaissance.toLowerCase());
      const matchesPrenoms =
        !prenoms.trim() ||
        String(row.prenoms || "")
          .toLowerCase()
          .includes(prenoms.toLowerCase());
      return matchesNom && matchesPrenoms;
    });

    setSearchResults(filtered);
  };

  const handleClearCriteria = () => {
    setSearchCriteria({
      nomNaissance: "",
      prenoms: "",
    });
  };

  const handleGetStatus = () => {
    console.log("Obtenir statut:", searchByIdOrEmail);
  };

  const handleRowClick = (row) => {
    console.log("Obtenir statut from row", row);
  };

  const handleSelectClient = (client) => {
    // Determine target form index (default to 0)
    const formId = location.state?.formId ?? 0;

    // Preserve any existing formulaires passed via state
    const allFormulaires = location.state?.allFormulaires ?? undefined;

    // Normalize client object to a predictable shape expected by PaiementManuel
    const id =
      client?.id ?? client?.idClient ?? client?.identifiantClient ?? "";
    const nom =
      client?.nom ??
      `${client?.prenoms ?? ""} ${client?.nomNaissance ?? ""}`.trim();
    const naissance =
      client?.naissance ??
      client?.dateNaissance ??
      client?.date_naissance ??
      "";
    const tiers =
      client?.tiers ?? client?.identifiantTiers ?? client?.identifiantT ?? "";

    navigate("/paiement/manuel", {
      state: {
        clientData: { id, nom, naissance, tiers },
        formId,
        allFormulaires,
      },
    });
  };

  const [columnFilters, setColumnFilters] = useState({
    statutInscription: "",
    nomNaissance: "",
    nomUsage: "",
    prenoms: "",
    adresseMail: "",
    dateNaissance: "",
  });

  const [globalSearch, setGlobalSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleGlobalSearchChange = (e) => {
    setGlobalSearch(e.target.value);
  };

  const handleColumnFilterChange = (e) => {
    const { name, value } = e.target;
    setColumnFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const defaultRows = Array.from({ length: 8 }).map(() => ({
    statutInscription: "",
    nomNaissance: "",
    nomUsage: "",
    prenoms: "",
    adresseMail: "",
    dateNaissance: "",
    id: "",
    identifiantTiers: "",
  }));

  const dataToDisplay = searchResults.length > 0 ? searchResults : defaultRows;

  const filteredResults = dataToDisplay.filter((row) => {
    const columnsOk = Object.entries(columnFilters).every(([key, val]) => {
      if (!val) return true;
      const cell = row[key];
      return String(cell || "")
        .toLowerCase()
        .includes(String(val).toLowerCase());
    });

    if (!columnsOk) return false;

    if (!globalSearch) return true;
    const q = globalSearch.toLowerCase();
    return Object.values(row).some((cell) =>
      String(cell || "")
        .toLowerCase()
        .includes(q)
    );
  });

  const compareRowsByKey = (a, b, key) => {
    const va = a?.[key] ?? "";
    const vb = b?.[key] ?? "";

    const da = Date.parse(va);
    const db = Date.parse(vb);
    if (!isNaN(da) && !isNaN(db)) return da - db;

    const sa = String(va).toLowerCase();
    const sb = String(vb).toLowerCase();
    if (sa < sb) return -1;
    if (sa > sb) return 1;
    return 0;
  };

  const sortedResults = (() => {
    if (!sortConfig.key) return filteredResults;
    const sorted = [...filteredResults].sort((a, b) =>
      compareRowsByKey(a, b, sortConfig.key)
    );
    if (sortConfig.direction === "desc") sorted.reverse();
    return sorted;
  })();

  const finalResults = sortedResults;

  const columns = [
    { key: "statutCode", label: "Statut inscription" },
    // { key: "statutInscription", label: "Statut inscription" },
    { key: "nomNaissance", label: "Nom de naissance" },
    { key: "nomUsage", label: "Nom usage" },
    { key: "prenoms", label: "Prénoms" },
    { key: "adresseMail", label: "Adresse mail" },
    { key: "dateNaissance", label: "Date naissance" },
    { key: "actions", label: "Actions" },
    { key: "idClient", label: "Actions" },
  ];

  const getStatutClient = async (idClient = null, email = null) => {
    let data;
    if (email != null && email.trim() != "") {
      data = {
        params: {
          adresseMail: email,
        },
        url: "https://api.urssaf.fr/atp/v1/tiersPrestations/particulier",
      };
    }
    if (idClient != null && idClient.trim() != "") {
      data = {
        params: {
          idClient: idClient,
        },
        url: "https://api.urssaf.fr/atp/v1/tiersPrestations/particulier",
      };
    }

    await axios
      .post(`${urlServer}api/urssaf/getStatut`, data)
      .then((response) => {
        setstaticData(response.data);
        console.log("list particulier front : ", response.data);
      })
      .catch((error) => {
        console.log("error particulier front : ", error);
      });
  };

  ///////////////////////////
  const E_APPAREILLAGE_EC = "APPAREILLAGE_EC";
  const E_APPAREILLAGE_EC_LIBELLE = "En cours";
  const E_APPAREILLAGE_VALIDE = "APPAREILLAGE_VALIDE";
  const E_APPAREILLAGE_VALIDE_LIBELLE = "Confirmé";
  const E_APPAREILLAGE_NF = "APPAREILLAGE_NF";
  const E_APPAREILLAGE_NF_LIBELLE = "Non finalisé";
  const E_PARTICULIER_BLOQUE = "PARTICULIER_BLOQUE";
  const E_PARTICULIER_BLOQUE_LIBELLE = "Bloqué";
  const E_MANDAT_ECHU = "MANDAT_ECHU";
  const E_MANDAT_ECHU_LIBELLE = "Mandat expiré";

  const getStatutParChampText = () => {
    const txtMail = document.getElementById("adresseMail");
    const txtClient = document.getElementById("idClient");
    let idClient = txtClient.value;
    let adresseMail = txtMail.value;
    getStatutClient(idClient, adresseMail);
  };

  const valcol = (key, result, rowIdx) => {
    switch (key) {
      case "statutCode":
        const myElement = document.getElementById("colStatut" + rowIdx);

        // if(myElement != null)
        // {
        //     //for (let i = 0; i < myElement.length; i++) {
        //         myElement[colIdx].style.backgroundColor = "green";
        //     //  }
        // }

        switch (result[key]) {
          case E_APPAREILLAGE_EC:
            console.log("colonne JAUNE = colStatut" + rowIdx);
            if (myElement != null) {
              //for (let i = 0; i < myElement.length; i++) {
              myElement.style.backgroundColor = "#eea60a45";
              //  }
            }
            return E_APPAREILLAGE_EC_LIBELLE;

          //vCouleur	= JauneOr
          case E_APPAREILLAGE_VALIDE:
            if (myElement != null) {
              console.log("colonne GREEN = colStatut" + rowIdx);
              //for (let i = 0; i < myElement.length; i++) {
              myElement.style.backgroundColor = "green";
              //  }
            }
            return E_APPAREILLAGE_VALIDE_LIBELLE;
          //vCouleur	= iVertClair
          case E_APPAREILLAGE_NF:
            console.log("colonne RED 2 = colStatut" + rowIdx);
            if (myElement != null) {
              //for (let i = 0; i < myElement.length; i++) {
              myElement.style.backgroundColor = "red";
              //  }
            }
            return E_APPAREILLAGE_NF_LIBELLE;
          //vCouleur	= RougeFoncé
          case E_PARTICULIER_BLOQUE:
            console.log("colonne RED 3 = colStatut" + rowIdx);
            if (myElement != null) {
              //for (let i = 0; i < myElement.length; i++) {
              myElement.style.backgroundColor = "red";
              //  }
            }
            return E_PARTICULIER_BLOQUE_LIBELLE;
          //vCouleur	= RougeFoncé
          case E_MANDAT_ECHU:
            console.log("colonne RED 4 = colStatut" + rowIdx);
            if (myElement != null) {
              //for (let i = 0; i < myElement.length; i++) {
              myElement.style.backgroundColor = "red";
              //  }
            }
            return E_MANDAT_ECHU_LIBELLE;
          default:
            console.log("colonne TRANSPATANT = colStatut" + rowIdx);
            return "";
        }
        //vCouleur	= RougeFoncé
        break;
      case "actions":
        // show the button whenever there is a result object (robust check)
        return result ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectClient(result);
            }}
            title="Sélectionner ce client"
            style={{ fontSize: "11px", padding: "4px 10px" }}
          >
            Sélectionner
          </button>
        ) : null;

        break;
      case "idClient":
        return (
          <button
            title="Obtenir statut"
            onClick={() => getStatutClient(result[key])}
            type="button"
            className="btn btn-secondary"
          >
            <i className="fa-solid fa-signal"></i>
          </button>
        );

        break;
      default:
        return result[key];
    }
  };

  return (
    <div className="inscription-container">
      <div className="card inscription-card shadow-sm-desktop">
        <div
          className="card-header d-flex justify-content-center align-items-center inscription-header"
          style={{ padding: "1rem 10px" }}
        >
          <h1 className="header-title">
            Obtenir le statut d'inscription d'un client
          </h1>
        </div>
        <div
          className="main-content-wrapper"
          style={{
            display: "flex ",
            justifyContent: "center",
            alignItems: "center",
            padding: "0.5rem",
          }}
        >
          <div className="card-body inscription-body2">
            <h3
              className="form-label section-title"
              style={{ color: "gray", textDecoration: "underline" }}
            >
              Critères de recherche
            </h3>
            <div
              className="search-criteria-container"
              style={{
                display: "flex",
                flexDirection: "row",
                border: "1px solid #ccc",
                padding: "8px 5px",
                marginBottom: "1.5rem",
                alignItems: "flex-start",
                height: "6rem",
              }}
            >
              <div
                className="mb-3 col-6 search-fields-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  className="d-flex align-items-center responsive-field"
                  style={{ gap: "0.75rem", marginBottom: "0.25rem" }}
                >
                  <label
                    className="form-label field-label"
                    style={{
                      width: "9rem",
                      fontSize: "0.8rem",
                      marginBottom: 0,
                    }}
                  >
                    Nom Naissance
                  </label>
                  <input
                    type="text"
                    name="nomNaissance"
                    className="form-control form-control-sm"
                    value={searchCriteria.nomNaissance}
                    onChange={handleSearchChange}
                    style={{ width: "15rem" }}
                  />
                </div>

                <div
                  className="d-flex align-items-center responsive-field"
                  style={{ gap: "0.75rem", marginBottom: "0.25rem" }}
                >
                  <label
                    className="form-label field-label"
                    style={{
                      width: "9rem",
                      fontSize: "0.8rem",
                      marginBottom: 0,
                    }}
                  >
                    Prénoms
                  </label>
                  <input
                    type="text"
                    name="prenoms"
                    className="form-control form-control-sm"
                    value={searchCriteria.prenoms}
                    onChange={handleSearchChange}
                    style={{ width: "15rem" }}
                  />
                </div>
              </div>

              <div
                className="d-flex mb-3 justify-content-end gap-2 search-buttons-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "auto",
                }}
              >
                <button
                  className="btn btn-primary btn-sm text-center text-lg-start"
                  onClick={handleSearch}
                >
                  <FaSearch /> Rechercher
                </button>
                <button
                  className="btn btn-primary btn-sm text-center text-lg-start"
                  onClick={handleClearCriteria}
                >
                  <MdDeleteOutline /> Effacer critères
                </button>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12">
                <div
                  className="table-responsive"
                  style={{ maxHeight: "500px", overflowY: "auto" }}
                >
                  <table className="table table-bordered table-hover table-sm">
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f8f9fa",
                        zIndex: 1,
                      }}
                    >
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              userSelect: "none",
                              position: "relative",
                              verticalAlign: "top",
                              width: col.key === "actions" ? "8rem" : "16rem",
                            }}
                          >
                            {col.key === "actions" ? (
                              <div style={{ padding: "8px 4px" }}>
                                <span>{col.label}</span>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="checkbox"
                                  id={`filter-toggle-${col.key}`}
                                  className="filter-toggle"
                                />

                                <div
                                  className="th-main"
                                  onClick={() => toggleSort(col.key)}
                                  aria-hidden
                                >
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
                                    <span>{col.label}</span>
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        userSelect: "none",
                                      }}
                                    >
                                      {sortConfig.key === col.key
                                        ? sortConfig.direction === "asc"
                                          ? "▲"
                                          : sortConfig.direction === "desc"
                                          ? "▼"
                                          : ""
                                        : ""}
                                    </span>
                                  </span>

                                  <label
                                    htmlFor={`filter-toggle-${col.key}`}
                                    className="filter-label"
                                    title="Afficher le filtre"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FaFilter />
                                  </label>
                                </div>

                                <input
                                  type="text"
                                  name={col.key}
                                  value={columnFilters[col.key] || ""}
                                  onChange={handleColumnFilterChange}
                                  className="form-control form-control-sm filter-input"
                                  placeholder="Filtrer..."
                                  style={{
                                    fontSize: "12px",
                                    position: "relative",
                                    bottom: "2rem",
                                    width: "7rem",
                                  }}
                                />
                              </>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {finalResults.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="text-center"
                            style={{ fontSize: "12px", padding: "20px" }}
                          >
                            Aucun résultat
                          </td>
                        </tr>
                      ) : (
                        finalResults.map((result, rowIdx) => (
                          <tr
                            key={rowIdx}
                            style={{
                              fontSize: "12px",
                              padding: "8px",
                              height: "30px",
                              border: "none",
                            }}
                          >
                            {columns.map((col, colIdx) => (
                              <td
                                id={
                                  col.key === "statutCode"
                                    ? "colStatut" + rowIdx
                                    : ""
                                }
                                key={colIdx}
                                style={{
                                  backgroundColor:
                                    rowIdx % 2 === 0 ? "#ffffff" : "#f2f2f2",
                                  verticalAlign: "middle",
                                  cursor:
                                    col.key === "actions"
                                      ? "default"
                                      : "pointer",
                                }}
                                onClick={() => {
                                  if (col.key !== "actions") {
                                    handleRowClick(result);
                                  }
                                }}
                              >
                                {valcol(col.key, result, rowIdx)}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <h3
              className="form-label section-title"
              style={{ color: "gray", textDecoration: "underline" }}
            >
              Obtenir statut à partir de l'id client ou son adresse mail
            </h3>

            <div className="row mb-3 id-email-section">
              <div className="col-12">
                <div className="d-flex flex-wrap align-items-center gap-3 border rounded p-3">
                  <div
                    className="responsive-field"
                    style={{
                      minWidth: 400,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <label
                      className="form-label field-label"
                      style={{ marginBottom: 0 }}
                    >
                      Id client
                    </label>
                    <input
                      id="idClient"
                      type="text"
                      name="idClient"
                      className="form-control form-control-sm"
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div
                    className="responsive-field"
                    style={{
                      minWidth: 300,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <label
                      className="form-label field-label"
                      style={{ marginBottom: 0 }}
                    >
                      Adresse mail
                    </label>
                    <input
                      id="adresseMail"
                      type="email"
                      name="adresseMail"
                      className="form-control form-control-sm"
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      type="button"
                      className="btn btn-primary inscrire-btn"
                      onClick={getStatutParChampText}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Obtenir statut
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mb-3 side-button-container" style={{ width: "8rem" }}>
            <div className="text-end">
              <button type="submit"
                className="btn btn-primary inscrire-btn"
                onClick={handleGetStatus}
              >
                Obtenir Statut ok
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InterogStatut;
