import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdClose as X, MdMinimize as Minimize2, MdCropSquare as Maximize2 } from "react-icons/md";

function Intervenant() {
  const [intervenants, setIntervenants] = useState([
    { id: 1, civilite: "Madame", nom: "Karine", prenoms: "CANABY" },
  ]);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (id) => {
    setSelectedRow(id);
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

        {/* Content Area */}
        <div style={{ padding: "20px", display: "flex", gap: "15px" }}>
          {/* Table */}
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
                  <th style={{ padding: "8px" }}>Civilité</th>
                  <th style={{ padding: "8px" }}>Nom</th>
                  <th style={{ padding: "8px" }}>Prénoms</th>
                </tr>
              </thead>
              <tbody>
                {intervenants.map((intervenant) => (
                  <tr
                    key={intervenant.id}
                    onClick={() => handleRowClick(intervenant.id)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedRow === intervenant.id ? "#cce5ff" : "white",
                    }}
                  >
                    <td style={{ padding: "8px" }}>{intervenant.civilite}</td>
                    <td style={{ padding: "8px" }}>{intervenant.nom}</td>
                    <td style={{ padding: "8px" }}>{intervenant.prenoms}</td>
                  </tr>
                ))}
                {/* Empty rows for spacing */}
                {[...Array(10)].map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td style={{ padding: "8px" }}>&nbsp;</td>
                    <td style={{ padding: "8px" }}>&nbsp;</td>
                    <td style={{ padding: "8px" }}>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
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
              <span style={{ fontSize: "16px" }}>✏️</span>
              Modifier
            </button>
            <button
              className="btn btn-danger btn-sm"
              style={{
                minWidth: "100px",
                padding: "8px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>🗑️</span>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intervenant;
