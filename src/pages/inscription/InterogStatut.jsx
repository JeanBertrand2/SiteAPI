import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./InscriptClient.css";
import { FaFilter } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";

const InterogStatut = () => {
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
    // Add search logic here
  };

  const handleClearCriteria = () => {
    setSearchCriteria({
      nomNaissance: "",
      prenoms: "",
    });
    setSearchResults([]);
  };

  const handleGetStatus = () => {
    console.log("Obtenir statut:", searchByIdOrEmail);
    // Add get status logic here
  };

  const handleRowClick = (row) => {
    console.log("Obtenir statut from row", row);
    // Add logic to get status when row is clicked
  };

  // Column filters for each table column
  const [columnFilters, setColumnFilters] = useState({
    statutInscription: "",
    nomNaissance: "",
    nomUsage: "",
    prenoms: "",
    adresseMail: "",
    dateNaissance: "",
  });

  // global search across all columns
  const [globalSearch, setGlobalSearch] = useState("");

  // sort configuration: key = column, direction = 'asc' | 'desc' | null
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

    // global search across all cells (if provided)
    if (!globalSearch) return true;
    const q = globalSearch.toLowerCase();
    return Object.values(row).some((cell) =>
      String(cell || "")
        .toLowerCase()
        .includes(q)
    );
  });

  // sorting logic
  const compareRowsByKey = (a, b, key) => {
    const va = a?.[key] ?? "";
    const vb = b?.[key] ?? "";

    // try to compare as dates if both parse
    const da = Date.parse(va);
    const db = Date.parse(vb);
    if (!isNaN(da) && !isNaN(db)) return da - db;

    // fallback to string compare
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
    { key: "statutInscription", label: "Statut inscription" },
    { key: "nomNaissance", label: "Nom de naissance" },
    { key: "nomUsage", label: "Nom usage" },
    { key: "prenoms", label: "Prénoms" },
    { key: "adresseMail", label: "Adresse mail" },
    { key: "dateNaissance", label: "Date naissance" },
  ];

  return (
    <div className="inscription-container">
      <div className="card shadow-sm inscription-card">
        <div className="card-header d-flex justify-content-between align-items-center inscription-header">
          <span className="header-title">
            📋 Obtenir le statut d'inscription d'un client
          </span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-secondary">─</button>
            <button className="btn btn-sm btn-secondary">□</button>
            <button className="btn btn-sm btn-danger">✕</button>
          </div>
        </div>
        <div
          style={{
            display: "flex ",
            justifyContent: "center",
            alignItems: "center",
            padding: "0.5rem",
          }}
        >
          <div className="card-body inscription-body">
            <h3
              className="form-label section-title"
              style={{ color: "gray", textDecoration: "underline" }}
            >
              Critères de recherche
            </h3>
            <div
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
                className="mb-3 col-6"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  className="d-flex align-items-center"
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
                  className="d-flex align-items-center"
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
                className="d-flex mb-3 justify-content-end gap-2"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "auto",
                }}
              >
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSearch}
                >
                  🔍 Rechercher
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleClearCriteria}
                >
                  🗑️ Effacer critères
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
                      <style>{`
    .filter-toggle { display: none; }
    .filter-input { display: none; margin-top: 6px; }
    .filter-toggle:checked + .th-main + .filter-input { display: block !important; }
    .th-main { display: flex; align-items: center; justify-content: space-between; gap: 8px; cursor: pointer; }
    .filter-label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; padding: 4px; }
  `}</style>

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
                              width: "16rem",
                              
                            }}
                          >
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
                                width: "8rem",
                                width: "7rem",
                              }}
                            />
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
                            onClick={() => {
                              handleRowClick(result);
                            }}
                            style={{
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "8px",
                              height: "30px",
                              border: "none",
                            }}
                          >
                            {columns.map((col, colIdx) => (
                              <td
                                key={colIdx}
                                style={{
                                  backgroundColor:
                                    rowIdx % 2 === 0 ? "#ffffff" : "#f2f2f2",
                                  verticalAlign: "middle",
                                }}
                              >
                                {result[col.key]}
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
              Obtenir statut à partir de l'id client où son adresse mail
            </h3>

            <div className="row mb-3">
              <div className="col-12">
                <div
                  className="d-flex flex-wrap align-items-center gap-3 border rounded p-3"
                  style={{ alignItems: "center" }}
                >
                  <div
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
                      value={searchByIdOrEmail.idClient}
                      onChange={handleIdEmailChange}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div
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
                      value={searchByIdOrEmail.adresseMail}
                      onChange={handleIdEmailChange}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      className="btn btn-primary inscrire-btn"
                      onClick={handleGetStatus}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Obtenir statut
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" mb-3" style={{ width: "8rem" }}>
            <div className=" text-end">
              <button
                className="btn btn-primary inscrire-btn"
                onClick={handleRowClick}
              >
                Obtenir Statut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterogStatut;
