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

  const handleRowClick = () => {
    console.log("Obtenir statut from row");
    // Add logic to get status when row is clicked
  };

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
          {/* Search Criteria Section */}
          <h3
            className="form-label section-title"
            style={{ color: "gray", textDecoration: "underline" }}
          >
            Critères de recherche
          </h3>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label field-label">Nom Naissance</label>
              <input
                type="text"
                name="nomNaissance"
                className="form-control form-control-sm"
                value={searchCriteria.nomNaissance}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label field-label">Prénoms</label>
              <input
                type="text"
                name="prenoms"
                className="form-control form-control-sm"
                value={searchCriteria.prenoms}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-end gap-2">
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

          {/* Results Table */}
          <div className="row mb-4">
            <div className="col-12">
              <div
                className="table-responsive"
                style={{ maxHeight: "300px", overflowY: "auto" }}
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
                      <th style={{ fontSize: "12px", fontWeight: "600" }}>
                        Statut inscription
                      </th>
                      <th style={{ fontSize: "12px", fontWeight: "600" }}>
                        Nom de naissance
                      </th>
                      <th style={{ fontSize: "12px", fontWeight: "600" }}>
                        Nom usage
                      </th>
                      <th style={{ fontSize: "12px", fontWeight: "600" }}>
                        Prénoms
                      </th>
                      <th style={{ fontSize: "12px", fontWeight: "600" }}>
                        Adresse mail
                      </th>
                      <th style={{ fontSize: "12px", fontWeight: "600" }}>
                        Date naissance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center"
                          style={{ fontSize: "12px", padding: "20px" }}
                        >
                          Aucun résultat
                        </td>
                      </tr>
                    ) : (
                      searchResults.map((result, idx) => (
                        <tr
                          key={idx}
                          onClick={handleRowClick}
                          style={{ cursor: "pointer", fontSize: "12px" }}
                        >
                          <td>{result.statutInscription}</td>
                          <td>{result.nomNaissance}</td>
                          <td>{result.nomUsage}</td>
                          <td>{result.prenoms}</td>
                          <td>{result.adresseMail}</td>
                          <td>{result.dateNaissance}</td>
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

          {/* Get Status by ID or Email Section */}
          <h3
            className="form-label section-title"
            style={{ color: "gray", textDecoration: "underline" }}
          >
            Obtenir statut à partir de l'id client où son adresse mail
          </h3>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label field-label">Id client</label>
              <input
                type="text"
                name="idClient"
                className="form-control form-control-sm"
                value={searchByIdOrEmail.idClient}
                onChange={handleIdEmailChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label field-label">Adresse mail</label>
              <input
                type="email"
                name="adresseMail"
                className="form-control form-control-sm"
                value={searchByIdOrEmail.adresseMail}
                onChange={handleIdEmailChange}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12 text-end">
              <button
                className="btn btn-primary inscrire-btn"
                onClick={handleGetStatus}
              >
                Obtenir statut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterogStatut;
