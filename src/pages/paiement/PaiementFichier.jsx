import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

const PaiementFichier = () => {
  const [sourceExcel, setSourceExcel] = useState(false);
  const [sourceDolibarr, setSourceDolibarr] = useState(false);
  const [fichier, setFichier] = useState(null);
  const [donnees, setDonnees] = useState([]);

 const handleFileChange = (e) => {
  // On stocke le fichier sans le lire
    const file = e.target.files[0];
    if (!file) return;
    setFichier(file); 
  };

//garder pour le tableau en bas plus tart
   const ouvrirExcel = () => {
    if (!fichier) {
      alert("Aucun fichier sélectionné !");
      return;
    }

    const extension = fichier.name.split('.').pop().toLowerCase();

    switch (extension) {
      case 'xlsx':
      case 'xls':
        lireExcel(fichier);
        break;
      case 'csv':
        lireCSV(fichier);
        break;
      case 'json':
        lireJSON(fichier);
        break;
      default:
        alert("Format de fichier non pris en charge !");
    }
  };
  const lireExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setDonnees(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const lireCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const workbook = XLSX.read(text, { type: 'string' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setDonnees(jsonData);
    };
    reader.readAsText(file);
  };

  const lireJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        setDonnees(Array.isArray(jsonData) ? jsonData : [jsonData]);
      } catch (error) {
        alert("Erreur de lecture JSON");
      }
    };
    reader.readAsText(file);
  };
//garder pour le tableau en bas plus tart
  const envoyerDemande = () => {
    alert("Demande de paiement envoyée !");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Demande de Paiement</h2>

      {/* Cases à cocher */}
      <div className="mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="sourceExcel"
            checked={sourceExcel}
            onChange={(e) => setSourceExcel(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="sourceExcel">
            Ajouter une demande de paiement à partir d’un fichier Excel
          </label>
        </div>

        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="sourceDolibarr"
            checked={sourceDolibarr}
            onChange={(e) => setSourceDolibarr(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="sourceDolibarr">
            Ajouter une demande de paiement à partir d’une Exportation Dolibarr
          </label>
        </div>
      </div>

      {/* Champ fichier */}
      <div className="mb-4">
        <label className="form-label">Fichier Excel:</label>
        <input
          type="file"
          className="form-control"
          accept=".xlsx,.xls,.csv,.json"
          onChange={handleFileChange}
        />
        {fichier && (
          <div className="mt-2 alert alert-info">
            Fichier sélectionné : {fichier.name}
          </div>
        )}
      </div>

      {/* Boutons */}
      <div className="d-flex justify-content-end gap-3">
         {fichier && (
          <a
            href={URL.createObjectURL(fichier)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Ouvrir Excel
          </a>
        )}
        <button className="btn btn-primary" onClick={envoyerDemande}>
          Demande Paiement
        </button>
      </div>

      {/* Zone centrale (placeholder) */}
      <div className="mt-5 p-5 border border-light bg-light text-center">
        <em>Aucune donnée affichée pour le moment</em>
      </div>
    </div>
  );
};

export default PaiementFichier;
