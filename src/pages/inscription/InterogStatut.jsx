import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./InscriptClient.css";

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
                  style={{ width: "9rem", fontSize: "0.8rem", marginBottom: 0 }}
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
                  style={{ width: "9rem", fontSize: "0.8rem", marginBottom: 0 }}
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
              <button className="btn btn-primary btn-sm" onClick={handleSearch}>
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
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                          onClick={() => toggleSort(col.key)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>{col.label}</span>
                            <span
                              style={{ marginLeft: "8px", fontSize: "10px" }}
                            >
                              {sortConfig.key === col.key
                                ? sortConfig.direction === "asc"
                                  ? "▲"
                                  : sortConfig.direction === "desc"
                                  ? "▼"
                                  : ""
                                : ""}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                    {/* filter row: one input per column */}
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key} style={{ padding: "6px" }}>
                          <input
                            type="text"
                            name={col.key}
                            value={columnFilters[col.key]}
                            onChange={handleColumnFilterChange}
                            className="form-control form-control-sm"
                            placeholder="Filtrer..."
                            style={{ fontSize: "12px" }}
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
                                  (rowIdx ) % 2 === 0
                                    ? "#ffffff"
                                    : "#f2f2f2",
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

          <div className="row mb-3">
            <div className="col-12 text-end">
              <button
                className="btn btn-primary inscrire-btn"
                onClick={handleRowClick}
              >
                Obtenir Statut
              </button>
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
                    minWidth: 450,
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
      </div>
    </div>
  );
};

export default InterogStatut;
