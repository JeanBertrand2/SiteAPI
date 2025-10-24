import { useEffect, useState } from "react";
import {
  MdClose as X,
  MdMinimize as Minimize2,
  MdCropSquare as Maximize2,
} from "react-icons/md";

const ModalIntervenant = ({ show, onClose, mode, data, onSave }) => {
  const [formData, setFormData] = useState(
    data || { civilite: "", nom: "", prenoms: "" }
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (show) {
      setFormData(data || { civilite: "", nom: "", prenoms: "" });
    }
  }, [data, show]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width:600px)");
    const handle = (e) => setIsMobile(e.matches);
    mq.addEventListener ? mq.addEventListener("change", handle) : mq.addListener(handle);
    return () =>
      mq.removeEventListener ? mq.removeEventListener("change", handle) : mq.removeListener(handle);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!show) return null;

  const overlayStyle = {
    position: "fixed",
    top: "6rem",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: isMobile ? "flex-start" : "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: isMobile ? "12px" : undefined,
  };

  const modalStyle = {
    backgroundColor: "white",
    border: "2px solid #5a7a9c",
    borderRadius: isMobile ? "6px" : "8px",
    width: isMobile ? "100%" : "500px",
    maxWidth: isMobile ? "100%" : "500px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
    maxHeight: isMobile ? "92vh" : undefined,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const headerStyle = {
    backgroundColor: "#e6f2ff",
    padding: isMobile ? "8px 12px" : "8px 15px",
    borderBottom: "1px solid #5a7a9c",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: isMobile ? "6px" : "6px",
    borderTopRightRadius: isMobile ? "6px" : "6px",
    gap: isMobile ? "8px" : undefined,
  };

  const leftHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "6px" : "8px",
  };

  const titleStyle = {
    fontSize: isMobile ? "12px" : "13px",
    fontWeight: "bold",
  };

  const badgeStyle = {
    backgroundColor: "#ffd700",
    color: "black",
    padding: isMobile ? "2px 6px" : "2px 8px",
    borderRadius: "3px",
    fontWeight: "bold",
    fontSize: isMobile ? "10px" : "11px",
  };

  const headerButtonsStyle = {
    display: "flex",
    gap: isMobile ? "6px" : "8px",
  };

  const iconButtonStyle = {
    border: "1px solid #999",
    backgroundColor: "white",
    padding: isMobile ? "3px 8px" : "3px 10px",
    cursor: "pointer",
    borderRadius: "3px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const bodyStyle = {
    padding: isMobile ? "14px" : "20px",
    backgroundColor: "#f0f0f0",
    overflowY: "auto",
  };

  const rowStyle = {
    display: "flex",
    gap: isMobile ? "12px" : "15px",
    marginBottom: isMobile ? "12px" : "15px",
    flexDirection: isMobile ? "column" : "row", // stack on mobile
  };

  const leftColStyle = {
    flex: 1,
  };

  const spacerStyle = {
    width: isMobile ? "auto" : "280px",
    height: "1px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontSize: isMobile ? "12px" : "13px",
    fontWeight: "bold",
  };

  const inputStyle = {
    width: "100%",
    padding: isMobile ? "8px" : "6px",
    border: "1px solid #ccc",
    borderRadius: "3px",
    fontSize: isMobile ? "14px" : "13px",
    boxSizing: "border-box",
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    padding: isMobile ? "12px" : undefined,
    borderTop: isMobile ? "1px solid #e0e0e0" : undefined,
    backgroundColor: isMobile ? "#f7f7f7" : undefined,
  };

  const saveButtonStyle = {
    padding: isMobile ? "10px 16px" : "8px 20px",
    fontSize: isMobile ? "14px" : "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={leftHeaderStyle}>
            <span style={badgeStyle}>WD</span>
            <span style={titleStyle}>FICHE INTERVENANT</span>
          </div>
          <div style={headerButtonsStyle}>
            <button style={iconButtonStyle} aria-label="minimize">
              <Minimize2 size={isMobile ? 12 : 14} />
            </button>
            <button style={iconButtonStyle} aria-label="maximize">
              <Maximize2 size={isMobile ? 12 : 14} />
            </button>
            <button onClick={onClose} style={iconButtonStyle} aria-label="close">
              <X size={isMobile ? 12 : 14} />
            </button>
          </div>
        </div>

        <div style={bodyStyle}>
          <div style={rowStyle}>
            <div style={leftColStyle}>
              <label style={labelStyle}>Civilité</label>
              <select
                value={formData.civilite}
                onChange={(e) => handleChange("civilite", e.target.value)}
                style={inputStyle}
              >
                <option value="">Sélectionner...</option>
                <option value="Madame">Madame</option>
                <option value="Monsieur">Monsieur</option>
              </select>
            </div>
            <div style={spacerStyle}></div>
          </div>

          <div style={{ marginBottom: isMobile ? "12px" : "15px" }}>
            <label style={labelStyle}>Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: isMobile ? "14px" : "20px" }}>
            <label style={labelStyle}>Prénoms</label>
            <input
              type="text"
              value={formData.prenoms}
              onChange={(e) => handleChange("prenoms", e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={footerStyle}>
            <button
              onClick={handleSave}
              className="btn btn-primary btn-sm"
              style={saveButtonStyle}
            >
              <span style={{ fontSize: isMobile ? "16px" : "16px" }}>💾</span>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalIntervenant;
