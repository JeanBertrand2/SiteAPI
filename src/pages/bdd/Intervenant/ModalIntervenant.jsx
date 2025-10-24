import { useState } from "react";
import {
  MdClose as X,
  MdMinimize as Minimize2,
  MdCropSquare as Maximize2,
} from "react-icons/md";

const ModalIntervenant = ({ show, onClose, mode, data, onSave }) => {
  const [formData, setFormData] = useState(
    data || { civilite: "", nom: "", prenoms: "" }
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          border: "2px solid #5a7a9c",
          borderRadius: "8px",
          width: "500px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
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
              FICHE INTERVENANT
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
              onClick={onClose}
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

        <div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
          <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                Civilité
              </label>
              <select
                value={formData.civilite}
                onChange={(e) => handleChange("civilite", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  fontSize: "13px",
                }}
              >
                <option value="">Sélectionner...</option>
                <option value="Madame">Madame</option>
                <option value="Monsieur">Monsieur</option>
              </select>
            </div>
            <div style={{ width: "280px" }}></div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Nom
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              style={{
                width: "100%",
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "3px",
                fontSize: "13px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Prénoms
            </label>
            <input
              type="text"
              value={formData.prenoms}
              onChange={(e) => handleChange("prenoms", e.target.value)}
              style={{
                width: "100%",
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "3px",
                fontSize: "13px",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              className="btn btn-primary btn-sm"
              style={{
                padding: "8px 20px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>💾</span>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalIntervenant;
