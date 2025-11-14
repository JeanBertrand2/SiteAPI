import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
//import instance from '../../api/axiosConfig.js';

import "./InscriptClient.css";
//const urlServer ="https://urssaf.cofident.com/"
//console.log("url server = ",urlServer)
const API_URL = process.env.REACT_APP_API_URL;
const InterogStatut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [staticData, setstaticData] = useState([]);
  const originePage =
    location.state?.origin !== undefined ? location.state.origin : "MOIMEME";

  const chargeDonnes = async (nomNaissance = "", prenoms = "") => {
    try {
      //
      // console.log("url server 2 = ",urlServer)
      await axios
        .get(`${API_URL}/particuliers`, {
          params: {
            nomNaissance: nomNaissance,
            prenoms: prenoms,
          },
        })
        .then((response) => {
          setstaticData(response.data);
          //setSearchResults(staticData);
        })
        .catch((error) => {
          console.log(
            "error lors de chargement de la liste des clients : ",
            error
          );
        });

      //setPageCount(response.data.pagination.pageCount)
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await chargeDonnes();
    };
    fetchData();
  }, []);

  // const staticData = [
  //   {
  //     id: "CLI001",
  //     statutInscription: "Validé",
  //     nomNaissance: "Dupont",
  //     nomUsage: "Dupont",
  //     prenoms: "Jean",
  //     adresseMail: "jean.dupont@example.com",
  //     dateNaissance: "1980-01-12",
  //     identifiantTiers: "TIERS001",
  //   },
  //   {
  //     id: "CLI002",
  //     statutInscription: "En attente",
  //     nomNaissance: "Martin",
  //     nomUsage: "Martin",
  //     prenoms: "Sophie",
  //     adresseMail: "sophie.martin@example.com",
  //     dateNaissance: "1990-05-21",
  //     identifiantTiers: "TIERS002",
  //   },
  //   {
  //     id: "CLI003",
  //     statutInscription: "Refusé",
  //     nomNaissance: "Nguyen",
  //     nomUsage: "Nguyen",
  //     prenoms: "Thi",
  //     adresseMail: "thi.nguyen@example.com",
  //     dateNaissance: "1975-09-09",
  //     identifiantTiers: "TIERS003",
  //   },
  //   {
  //     id: "CLI004",
  //     statutInscription: "Validé",
  //     nomNaissance: "Bernard",
  //     nomUsage: "Bernard",
  //     prenoms: "Luc",
  //     adresseMail: "luc.bernard@example.com",
  //     dateNaissance: "1988-11-30",
  //     identifiantTiers: "TIERS004",
  //   },
  //   {
  //     id: "CLI005",
  //     statutInscription: "En cours",
  //     nomNaissance: "Moreau",
  //     nomUsage: "Moreau",
  //     prenoms: "Claire",
  //     adresseMail: "claire.moreau@example.com",
  //     dateNaissance: "1995-07-14",
  //     identifiantTiers: "TIERS005",
  //   },
  // ];

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

  const handleSearch = () => {
    console.log("Rechercher:", searchCriteria);
    const { nomNaissance, prenoms } = searchCriteria;
    chargeDonnes(nomNaissance, prenoms);
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
    // Récupérer l'index du formulaire depuis location.state s'il existe
    const formId =
      location.state?.formId !== undefined ? location.state.formId : 0;

    // Récupérer tous les formulaires pour les préserver
    const allFormulaires = location.state?.allFormulaires;

    navigate("/paiement/manuel", {
      state: {
        clientData: {
          id: client.idClient,
          nom: `${client.prenoms} ${client.nomNaissance}`,
          naissance: client.dateNaissance,
          tiers: "80077179200028", // client.identifiantTiers,
        },
        formId: formId, // Passer l'index du formulaire
        allFormulaires: allFormulaires, // Renvoyer tous les formulaires
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
    { key: "idClient", label: "Action" },
  ];

  const getStatutClient = async (idClient = null, email = null) => {
    let data;
    if (email != null && email.trim() != "") {
      data = {
        params: {
          adresseMail: email,
        },
        url: "/particulier",
      };
    }
    if (idClient != null && idClient.trim() != "") {
      data = {
        params: {
          idClient: idClient,
        },
        url: "/particulier",
      };
    }

    await axios
      .post(`${API_URL}/api/urssaf/getStatut`, data)
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
  const getBackGroundColor = (key, result, rowIdx) => {
    switch (
      result[key] //
    ) {
      case E_APPAREILLAGE_EC:
        return "#e2be7145";
      case E_APPAREILLAGE_VALIDE:
        return "#a8f1c945";
      case E_APPAREILLAGE_NF:
        return "#eb909845";
      case E_PARTICULIER_BLOQUE:
        return "#eb909845";
      case E_MANDAT_ECHU:
        return "#eb909845";
      default:
        return rowIdx % 2 === 0 ? "#ffffff" : "#f2f2f2";
    }
  };

  const valcol = (key, result, rowIdx) => {
    switch (key) {
      case "statutCode":
        switch (result[key]) {
          case E_APPAREILLAGE_EC:
            return E_APPAREILLAGE_EC_LIBELLE;
          case E_APPAREILLAGE_VALIDE:
            return E_APPAREILLAGE_VALIDE_LIBELLE;
          case E_APPAREILLAGE_NF:
            return E_APPAREILLAGE_NF_LIBELLE;
          case E_PARTICULIER_BLOQUE:
            return E_PARTICULIER_BLOQUE_LIBELLE;
          case E_MANDAT_ECHU:
            return E_MANDAT_ECHU_LIBELLE;
          default:
            return "";
        }
        break;
      case "actions":
        return result.id ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectClient(result);
            }}
            title="Sélectionner ce client"
            style={{
              fontSize: "11px",
              padding: "2px 8px",
            }}
          >
            Sélectionner
          </button>
        ) : null;

        break;
      case "idClient":
        if (originePage === "MOIMEME") {
          return result.idClient ? (
            <button
              title="Obtenir statut"
              onClick={() => getStatutClient(result[key])}
              type="button"
              className="btn btn-secondary"
            >
              <i className="fa-solid fa-signal"></i>
            </button>
          ) : null;
        } else {
          return result.idClient ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectClient(result);
              }}
              title="Sélectionner"
              style={{
                fontSize: "11px",
                padding: "2px 8px",
              }}
            >
              Sélectionner
            </button>
          ) : null;
        }

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
          <h1 className="header-title" id="titrePage">
            {originePage === "MOIMEME"
              ? "Obtenir le statut d'inscription d'un client"
              : "Sélectionner un client"}
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
                                    col.key === "statutCode"
                                      ? getBackGroundColor(
                                          col.key,
                                          result,
                                          rowIdx
                                        )
                                      : rowIdx % 2 === 0
                                      ? "#ffffff"
                                      : "#f2f2f2",
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
            <div
              id="DIVSTATUT"
              style={{ display: originePage === "MOIMEME" ? "block" : "none" }}
            >
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
