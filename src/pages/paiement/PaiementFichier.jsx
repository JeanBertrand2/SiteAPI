import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

const PaiementFichier = () => {
  const [fichier, setFichier] = useState(null);
  const [formulaires, setFormulaires] = useState([]);
  const today = new Date().toISOString().split("T")[0];


  const parseMontant = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
    };

  const excelDateToISO = (value) => {
    if (!value || isNaN(value)) return today;
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFichier(file);
    lireExcel(file);
  };

  const lireExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const grouped = {};
      rows.forEach((row) => {
        const ref = row["Réf. facture"];
        if (!grouped[ref]) grouped[ref] = [];
        grouped[ref].push(row);
      });

      const formulairesImportés = Object.entries(grouped).map(([ref, lignes]) => {
        const first = lignes[0];
        return {
          id: Date.now() + Math.random(),
          clientId: first["N°Id Urssaf (AI)"] || "",
          nomclient: first["Nom/Enseigne/Raison sociale"] || "",
          selectedDate: (first["Date de naissance Urssaf (AI)"] || "").split("T")[0] || today,
          dde: excelDateToISO(first["Date début"]),
          dfe: excelDateToISO(first["Date fin"]),
          datevers: excelDateToISO(first["Date début"]),
          datefact: excelDateToISO(first["Date facturation"]),
          numfacture: ref || "",
          identifiantT: first["N°Id Urssaf (AI)"] || "",
          mntacompte: 0,


          //mntacompte: first["A déclarer en AI"] !== undefined ? parseFloat(first["A déclarer en AI"]) || 0 : 0,
          mntfht: parseFloat(first["Total HT"]) || 0,
          mntfttc: parseFloat(first["Total TTC"]) || 0,
          demandePaiement: lignes.map((l) => ({
            ca: l["Réf. produit"] || "",
            cn: l["Libéllé Urssaf"] || "",
            libprest: l["Libellé produit"] || "",
            qte: parseFloat(l["Quantité pour la ligne"]) || 0,
            unit: l["unité"] || "",
            mntunit: parseFloat(l["Prix Unitaire TTC"]) || 0,
            mntprestht: parseFloat(l["Montant HT de la ligne"]) || 0,
            mntprestttc: parseFloat(l["Montant TTC de la ligne"]) || 0,
            mntpresttva: parseFloat(l["Montant TVA de la ligne"]) || 0,
            compl1: "",
            compl2: "SAP800771792",

          }))
        };
      });

      setFormulaires(formulairesImportés);
    };
    reader.readAsArrayBuffer(file);
  };

  const calculTotaux = (rows) => {
    let ttc = 0, ht = 0, tva = 0;
    rows.forEach((r) => {
      ttc += r.mntprestttc || 0;
      ht += r.mntprestht || 0;
      tva += r.mntpresttva || 0;
    });
    return { ttc, ht, tva };
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-semibold text-primary">Demande de Paiement</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Importer un fichier</h5>
          <input type="file" className="form-control" accept=".xlsx,.xls,.csv,.json" onChange={handleFileChange} />
          {fichier && <div className="mt-2 alert alert-info">Fichier sélectionné : {fichier.name}</div>}
        </div>
      </div>

      {formulaires.map((form, index) => (
        <div key={form.id} className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Facture {form.numfacture}</h5>
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-6"><label className="form-label">Nom client</label><input type="text" className="form-control" value={form.nomclient} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Identifiant client</label><input type="text" className="form-control" value={form.clientId} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Identifiant tiers</label><input type="text" className="form-control" value={form.identifiantT} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Date de naissance</label><input type="date" className="form-control" value={form.selectedDate} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Date versement acompte</label><input type="date" className="form-control" value={form.datevers} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Date début emploi</label><input type="date" className="form-control" value={form.dde} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Date fin emploi</label><input type="date" className="form-control" value={form.dfe} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Date facture</label><input type="date" className="form-control" value={form.datefact} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Montant acompte</label><input type="number" className="form-control" value={form.mntacompte} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Montant HT</label><input type="number" className="form-control" value={form.mntfht} readOnly /></div>
              <div className="col-md-6"><label className="form-label">Montant TTC</label><input type="number" className="form-control" value={form.mntfttc} readOnly /></div>
            </div>

            <div className="table-responsive mt-4">
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Code Activité</th>
                    <th>Code Nature</th>
                    <th>Libellé</th>
                    <th>Quantité</th>
                    <th>Unité</th>
                    <th>Prix Unitaire</th>
                    <th>Montant HT</th>
                    <th>Montant TTC</th>
                    <th>Montant TVA</th>
                    <th>Complément 1</th>
                    <th>Complément 2</th>
                  </tr>
                </thead>
                <tbody>
                  {form.demandePaiement.map((row, i) => (
                    <tr key={i}>
                      <td>{row.ca}</td>
                      <td>{row.cn}</td>
                      <td>{row.libprest}</td>
                      <td>{row.qte}</td>
                      <td>{row.unit}</td>
                      <td>{row.mntunit?.toFixed(2)}</td>
                      <td>{row.mntprestht?.toFixed(2)}</td>
                      <td>{row.mntprestttc?.toFixed(2)}</td>
                      <td>{row.mntpresttva?.toFixed(2)}</td>
                      <td>{row.compl1}</td>
                      <td>{row.compl2}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-secondary fw-bold">
                    <td colSpan="4">Totaux</td>
                    <td></td>
                    <td></td>
                    <td>{calculTotaux(form.demandePaiement).ht.toFixed(2)}</td>
                    <td>{calculTotaux(form.demandePaiement).ttc.toFixed(2)}</td>
                    <td>{calculTotaux(form.demandePaiement).tva.toFixed(2)}</td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>

              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaiementFichier;
 