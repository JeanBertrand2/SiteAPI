import { useEffect, useState } from "react";
import {
  MdClose as X,
  MdMinimize as Minimize2,
  MdCropSquare as Maximize2,
} from "react-icons/md";
import "./ModalIntervenant.css";

const normalizeCivilite = (c) => {
  if (c === 1 || c === "1") return "Monsieur";
  if (c === 2 || c === "2") return "Madame";
  if (typeof c === "string") {
    const lower = c.toLowerCase();
    if (lower.includes("mons")) return "Monsieur";
    if (lower.includes("madam") || lower.includes("mme")) return "Madame";
  }
  return "Monsieur";
};

const defaultData = {
  civilite: "Monsieur",
  nomIntervenant: "",
  prenomIntervenant: "",
};

const ModalIntervenant = ({ show, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(() => {
    const init = data || defaultData;
    return { ...init, civilite: normalizeCivilite(init.civilite) };
  });

  useEffect(() => {
    if (show) {
      if (data) {
        setFormData({ ...data, civilite: normalizeCivilite(data.civilite) });
      } else {
        setFormData(defaultData);
      }
    }
  }, [data, show]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSave = () => {
    // convert civilite back to the numeric value expected by the API
    const civiliteValue = formData.civilite === "Monsieur" ? 1 : 2;
    // prepare payload and preserve ID when editing
    const payload = { ...formData, civilite: civiliteValue };
    if (data && (data.ID_Intervenant || data.id)) {
      // preserve whichever id field exists on incoming data
      payload.ID_Intervenant = data.ID_Intervenant ?? data.id;
    }
    onSave(payload);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-title">FICHE INTERVENANT</span>
          </div>
          <div className="modal-header-buttons">
            <button className="modal-icon-button" aria-label="minimize">
              <Minimize2 size={14} />
            </button>
            <button className="modal-icon-button" aria-label="maximize">
              <Maximize2 size={14} />
            </button>
            <button
              onClick={onClose}
              className="modal-icon-button"
              aria-label="close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-form-row single-column">
            <div className="modal-form-group">
              <label className="modal-label">Civilité</label>
              <select
                value={formData.civilite || "Monsieur"}
                onChange={(e) => handleChange("civilite", e.target.value)}
                className="modal-select"
              >
                <option value="Madame">Madame</option>
                <option value="Monsieur">Monsieur</option>
              </select>
            </div>
          </div>

          <div className="modal-form-row">
            <div className="modal-form-group">
              <label className="modal-label">Nom</label>
              <input
                type="text"
                value={formData.nomIntervenant}
                onChange={(e) => handleChange("nomIntervenant", e.target.value)}
                className="modal-input"
              />
            </div>
          </div>

          <div className="modal-form-row">
            <div className="modal-form-group">
              <label className="modal-label">Prénoms</label>
              <input
                type="text"
                value={formData.prenomIntervenant}
                onChange={(e) =>
                  handleChange("prenomIntervenant", e.target.value)
                }
                className="modal-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button onClick={handleSave} className="modal-save-button">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalIntervenant;
