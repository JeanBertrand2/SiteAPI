import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoIosSearch } from "react-icons/io";
import { RiExpandUpDownFill } from "react-icons/ri";
import ModalIntervenant from "./ModalIntervenant";
import Confirmation from "./Confirmation";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import "./Intervenant.css";
const Intervenant = () => {
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
  const [modalData, setModalData] = useState(null);

  const handleNouveau = () => {
    setModalMode("add");
    setModalData(null);
    setShowModal(true);
  };

  const handleModifier = () => {
    if (selectedRow) {
      const selected = getSelectedData();
      if (!selected) return;
      setModalMode("edit");
      setModalData(selected);
      setShowModal(true);
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
    setShowModal(false);
  };

  const handleSupprimer = () => {
    if (selectedRow) {
      setConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    setConfirmLoading(true);
    setIntervenants((prev) => prev.filter((i) => i.id !== selectedRow));
    setSelectedRow(null);
    setConfirmLoading(false);
    setConfirmOpen(false);
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
      <div className="intervenant-card">
        <div className="intervenant-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="titre-intervenants">LISTE : INTERVENANTS</span>
          </div>
        </div>
        <div className="intervenant-content">
          <div
            style={{
              display: "flex",
              flex: 4,
            }}
            className="responsive-container"
          >
            <div
              style={{ overflowX: "auto", width: "100%", marginRight: "1rem" }}
              className="left-table"
            >
              <table
                className="table table-bordered table-sm"
                style={{ fontSize: "15px", marginBottom: 0 }}
              >
                <thead>
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
                  {filteredData.map((intervenant, index) => {
                    const rowBg =
                      selectedRow === intervenant.id
                        ? "#cce5ff"
                        : index % 2 === 0
                        ? "white"
                        : "#f8f9fa";
                    return (
                      <tr
                        key={intervenant.id}
                        onClick={() => handleRowClick(intervenant.id)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <td style={{ padding: "8px", backgroundColor: rowBg }}>
                          {intervenant.civilite}
                        </td>
                        <td style={{ padding: "8px", backgroundColor: rowBg }}>
                          {intervenant.nom}
                        </td>
                        <td style={{ padding: "8px", backgroundColor: rowBg }}>
                          {intervenant.prenoms}
                        </td>
                      </tr>
                    );
                  })}
                  {[...Array(Math.max(0, 10 - filteredData.length))].map(
                    (_, i) => {
                      const rowBg =
                        (filteredData.length + i) % 2 === 0
                          ? "white"
                          : "#f8f9fa";
                      return (
                        <tr key={`empty-${i}`}>
                          <td
                            style={{ padding: "8px", backgroundColor: rowBg }}
                          >
                            &nbsp;
                          </td>
                          <td
                            style={{ padding: "8px", backgroundColor: rowBg }}
                          >
                            &nbsp;
                          </td>
                          <td
                            style={{ padding: "8px", backgroundColor: rowBg }}
                          >
                            &nbsp;
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              margin: "5px",
              flex: 1,
            }}
            className="right-buttons"
          >
            <button
              onClick={handleNouveau}
              className="btn btn-primary btn-sm"
              style={{
                minWidth: "100px",
                padding: "8px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>
                <IoIosAddCircle />
              </span>
              Nouveau
            </button>
            <button
              onClick={handleModifier}
              className="btn btn-primary btn-sm"
              style={{
                minWidth: "100px",
                padding: "8px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: selectedRow ? 1 : 0.5,
              }}
              disabled={!selectedRow}
            >
              <span style={{ fontSize: "20px" }}>
                <MdEdit />
              </span>
              Modifier
            </button>
            <button
              onClick={handleSupprimer}
              className="btn btn-danger btn-sm"
              style={{
                minWidth: "100px",
                padding: "8px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: selectedRow ? 1 : 0.5,
              }}
              disabled={!selectedRow}
            >
              <span style={{ fontSize: "20px" }}>
                <MdDelete />
              </span>
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

      <Confirmation
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={confirmLoading}
        title="Confirmer la suppression"
        message={
          getSelectedData()
            ? `Voulez-vous vraiment supprimer ${getSelectedData().civilite} ${
                getSelectedData().nom
              } ${getSelectedData().prenoms} ?`
            : "Voulez-vous vraiment supprimer cet élément ?"
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        destructive={true}
      />
    </div>
  );
};

export default Intervenant;
