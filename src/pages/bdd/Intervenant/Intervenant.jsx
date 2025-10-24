import  { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  MdClose as X,
  MdMinimize as Minimize2,
  MdCropSquare as Maximize2,
} from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { RiExpandUpDownFill } from "react-icons/ri";
import ModalIntervenant from "./ModalIntervenant";


function Intervenant() {
  const [intervenants, setIntervenants] = useState([
    { id: 1, civilite: "Madame", nom: "CANABY", prenoms: "Karine" },
    { id: 2, civilite: "Monsieur", nom: "DUPONT", prenoms: "Jean" },
    { id: 3, civilite: "Madame", nom: "MARTIN", prenoms: "Sophie" },
    { id: 4, civilite: "Monsieur", nom: "BERNARD", prenoms: "Pierre" },
    { id: 5, civilite: "Madame", nom: "PETIT", prenoms: "Marie" },
  ]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchActive, setSearchActive] = useState({
    civilite: false,
    nom: false,
    prenoms: false,
  });
  const [searchValues, setSearchValues] = useState({
    civilite: "",
    nom: "",
    prenoms: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const handleRowClick = (id) => {
    setSelectedRow(id);
  };

  const handleSearchClick = (column) => {
    setSearchActive((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleSearchChange = (column, value) => {
    setSearchValues((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedData = () => {
    let filtered = intervenants.filter((intervenant) => {
      const civiliteMatch = intervenant.civilite
        .toLowerCase()
        .includes(searchValues.civilite.toLowerCase());
      const nomMatch = intervenant.nom
        .toLowerCase()
        .includes(searchValues.nom.toLowerCase());
      const prenomsMatch = intervenant.prenoms
        .toLowerCase()
        .includes(searchValues.prenoms.toLowerCase());
      return civiliteMatch && nomMatch && prenomsMatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const filteredData = getFilteredAndSortedData();

  const handleNouveau = () => {
    setModalMode("add");
    setShowModal(true);
  };

  const handleModifier = () => {
    if (selectedRow) {
      setModalMode("edit");
      setShowModal(true);
    }
  };

  const handleSupprimer = () => {
    if (selectedRow) {
      setIntervenants((prev) => prev.filter((i) => i.id !== selectedRow));
      setSelectedRow(null);
    }
  };

  const handleSave = (formData) => {
    if (modalMode === "add") {
      const newId = Math.max(...intervenants.map((i) => i.id), 0) + 1;
      setIntervenants((prev) => [...prev, { ...formData, id: newId }]);
    } else {
      setIntervenants((prev) =>
        prev.map((i) => (i.id === selectedRow ? { ...formData, id: i.id } : i))
      );
    }
  };

  const getSelectedData = () => {
    return intervenants.find((i) => i.id === selectedRow);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #5a7a9c",
          borderRadius: "8px",
          maxWidth: "900px",
          margin: "50px auto",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            backgroundColor: "#e6f2ff",
            padding: "8px 15px",
            borderBottom: "1px solid #5a7a9c",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                backgroundColor: "#ffd700",
                color: "black",
                padding: "2px 8px",
                borderRadius: "3px",
                fontWeight: "bold",
                fontSize: "11px",
              }}
            >
              WP
            </span>
            <span style={{ fontSize: "13px", fontWeight: "bold" }}>
              LISTE : INTERVENANTS
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                border: "1px solid #999",
                backgroundColor: "white",
                padding: "3px 10px",
                cursor: "pointer",
                borderRadius: "3px",
              }}
            >
              <Minimize2 size={14} />
            </button>
            <button
              style={{
                border: "1px solid #999",
                backgroundColor: "white",
                padding: "3px 10px",
                cursor: "pointer",
                borderRadius: "3px",
              }}
            >
              <Maximize2 size={14} />
            </button>
            <button
              style={{
                border: "1px solid #999",
                backgroundColor: "white",
                padding: "3px 10px",
                cursor: "pointer",
                borderRadius: "3px",
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div style={{ padding: "20px", display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <table
              className="table table-bordered table-sm"
              style={{
                fontSize: "13px",
                marginBottom: 0,
              }}
            >
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th style={{ padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSort("civilite")}
                      >
                        <RiExpandUpDownFill size={14} />
                      </span>
                      <span style={{ flex: 1, textAlign: "center" }}>
                        {searchActive.civilite ? (
                          <input
                            type="text"
                            value={searchValues.civilite}
                            onChange={(e) =>
                              handleSearchChange("civilite", e.target.value)
                            }
                            style={{
                              width: "100%",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              padding: "2px 5px",
                              fontSize: "12px",
                            }}
                            placeholder="Rechercher..."
                            autoFocus
                          />
                        ) : (
                          "Civilité"
                        )}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearchClick("civilite")}
                      >
                        <IoIosSearch size={14} />
                      </span>
                    </div>
                  </th>
                  <th style={{ padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSort("nom")}
                      >
                        <RiExpandUpDownFill size={14} />
                      </span>
                      <span style={{ flex: 1, textAlign: "center" }}>
                        {searchActive.nom ? (
                          <input
                            type="text"
                            value={searchValues.nom}
                            onChange={(e) =>
                              handleSearchChange("nom", e.target.value)
                            }
                            style={{
                              width: "100%",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              padding: "2px 5px",
                              fontSize: "12px",
                            }}
                            placeholder="Rechercher..."
                            autoFocus
                          />
                        ) : (
                          "Nom"
                        )}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearchClick("nom")}
                      >
                        <IoIosSearch size={14} />
                      </span>
                    </div>
                  </th>
                  <th style={{ padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSort("prenoms")}
                      >
                        <RiExpandUpDownFill size={14} />
                      </span>
                      <span style={{ flex: 1, textAlign: "center" }}>
                        {searchActive.prenoms ? (
                          <input
                            type="text"
                            value={searchValues.prenoms}
                            onChange={(e) =>
                              handleSearchChange("prenoms", e.target.value)
                            }
                            style={{
                              width: "100%",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              padding: "2px 5px",
                              fontSize: "12px",
                            }}
                            placeholder="Rechercher..."
                            autoFocus
                          />
                        ) : (
                          "Prénoms"
                        )}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSearchClick("prenoms")}
                      >
                        <IoIosSearch size={14} />
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((intervenant, index) => (
                  <tr
                    key={intervenant.id}
                    onClick={() => handleRowClick(intervenant.id)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedRow === intervenant.id
                          ? "#cce5ff"
                          : index % 2 === 0
                          ? "white"
                          : "#f8f9fa",
                    }}
                  >
                    <td style={{ padding: "8px" }}>{intervenant.civilite}</td>
                    <td style={{ padding: "8px" }}>{intervenant.nom}</td>
                    <td style={{ padding: "8px" }}>{intervenant.prenoms}</td>
                  </tr>
                ))}
                {[...Array(Math.max(0, 10 - filteredData.length))].map(
                  (_, i) => (
                    <tr
                      key={`empty-${i}`}
                      style={{
                        backgroundColor:
                          (filteredData.length + i) % 2 === 0
                            ? "white"
                            : "#f8f9fa",
                      }}
                    >
                      <td style={{ padding: "8px" }}>&nbsp;</td>
                      <td style={{ padding: "8px" }}>&nbsp;</td>
                      <td style={{ padding: "8px" }}>&nbsp;</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={handleNouveau}
              className="btn btn-primary btn-sm"
              style={{
                minWidth: "100px",
                padding: "8px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>📄</span>
              Nouveau
            </button>
            <button
              onClick={handleModifier}
              className="btn btn-primary btn-sm"
              style={{
                minWidth: "100px",
                padding: "8px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: selectedRow ? 1 : 0.5,
              }}
              disabled={!selectedRow}
            >
              <span style={{ fontSize: "16px" }}>✏️</span>
              Modifier
            </button>
            <button
              onClick={handleSupprimer}
              className="btn btn-danger btn-sm"
              style={{
                minWidth: "100px",
                padding: "8px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: selectedRow ? 1 : 0.5,
              }}
              disabled={!selectedRow}
            >
              <span style={{ fontSize: "16px" }}>🗑️</span>
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <ModalIntervenant
        show={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        data={modalMode === "edit" ? getSelectedData() : null}
        onSave={handleSave}
      />
    </div>
  );
}

export default Intervenant;