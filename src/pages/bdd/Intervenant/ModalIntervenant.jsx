import { useEffect, useState } from "react";
import {
  MdClose as X,
  MdMinimize as Minimize2,
  MdCropSquare as Maximize2,
} from "react-icons/md";
import "./ModalIntervenant.css";

const ModalIntervenant = ({ show, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(
    data || { civilite: "", nomIntervenant: "", prenomIntervenant: "" }
  );

  useEffect(() => {
    if (show) {
      setFormData(
        data || { civilite: "", nomIntervenant: "", prenomIntervenant: "" }
      );
    }
  }, [data, show]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
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
                value={formData.civilite}
                onChange={(e) => handleChange("civilite", e.target.value)}
                className="modal-select"
              >
                <option value="">Sélectionner...</option>
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
