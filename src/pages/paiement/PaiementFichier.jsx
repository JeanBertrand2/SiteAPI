import React, { useState } from 'react';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

 const PaiementFichier = ({ showDemandeBtn = true, showMigrationBtn = false }) => {
  const [sourceExcel, setSourceExcel] = useState(false);
  const [sourceDolibarr, setSourceDolibarr] = useState(false);
  const [fichier, setFichier] = useState(null);
  const [donnees, setDonnees] = useState([]);
 //actives les tooltips
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);
//actives les tooltips
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFichier(file);
    // ← lecture automatique dès sélection
    ouvrirExcel(file); 
  };


    const ouvrirExcel = (fichierLocal) => {
      const extension = fichierLocal.name.split('.').pop().toLowerCase();

      switch (extension) {
        case 'xlsx':
        case 'xls':
          lireExcel(fichierLocal);
          break;
        case 'csv':
          lireCSV(fichierLocal);
          break;
        case 'json':
          lireJSON(fichierLocal);
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
//garder pour le tableau en bas plus tard
  const envoyerDemande = () => {
    alert("Demande de paiement envoyée !");
  };

  return (
   <div className="container mt-4">
      <h2 className="text-center mb-4 fw-semibold text-primary">
        Demande de Paiement
      </h2>


  <div className="card shadow-sm mb-4">
    <div className="card-body">
      <h5 className="card-title mb-3">Source de la demande</h5>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="sourceExcel"
          checked={sourceExcel}
          onChange={(e) => setSourceExcel(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="sourceExcel">
          Fichier Excel
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
          Exportation Dolibarr
        </label>
      </div>
    </div>
  </div>

  <div className="card shadow-sm mb-4">
    <div className="card-body">
      <h5 className="card-title mb-3">Importer un fichier</h5>
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
  </div>

      <div className="row g-2 mb-4">
      {fichier && (
        <div className="col-12 col-sm-auto">
          <a
            href={URL.createObjectURL(fichier)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success w-100"
          >
            Ouvrir Excel
          </a>
        </div>
      )}

      {showDemandeBtn && (
        <div className="col-12 col-sm-auto">
          <button className="btn btn-primary w-100" onClick={envoyerDemande}>
            Demande Paiement
          </button>
        </div>
      )}
      {/*utilisation tooltip*/}
      {showMigrationBtn && (
        <div className="col-12 col-sm-auto">
          <button
            className="btn btn-danger w-100"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Utiliser le format import demande de paiement"
          >
            Migration anciennes factures AI Base de donnée
          </button>
        </div>
      )}
      {/*utilisation tooltip*/}
    </div>


  <div className="card shadow-sm">
    <div className="card-body">
      <h5 className="card-title mb-3">Aperçu des données</h5>
      {donnees.length > 0 ? (
        <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-light">
              <tr>
                {Object.keys(donnees[0]).map((col, idx) => (
                  <th key={idx} className="text-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donnees.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((val, colIndex) => (
                    <td key={colIndex} className="text-nowrap">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted text-center py-5">
          <em>Aucune donnée affichée pour le moment</em>
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default PaiementFichier;
