import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { DemandePaiement } from "../../Model/DemandePaiement";



const PaiementFichier = ({ showDemandeBtn = true, showMigrationBtn = false }) => {

  const [fichier, setFichier] = useState(null);
  const [formulaires, setFormulaires] = useState([]);
  const [resumeErreurs, setResumeErreurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [typeFichier, setTypeFichier] = useState("application");
  const today = new Date().toISOString().split("T")[0];

  const excelDateToISO = (value) => {
    if (!value || isNaN(value)) return today;
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  };

  const getDecimalDigits = (val) => {
    const parts = val.toString().split(".");
    return parts[1] ? parts[1] : "00";
  };

  const arrondiWindev = (val) => {
    if (val === undefined || val === null || isNaN(val)) return 0;
    const partieEntiere = Math.floor(val);
    const partieDecimale = parseFloat("0." + getDecimalDigits(val));
    const arrondiDecimale = Math.round(partieDecimale * 100) / 100;
    return partieEntiere + arrondiDecimale;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFichier(file);

    if (typeFichier === "application") {
      lireFichierApplication(file);
    } else {
      lireFichierDolibarr(file);
    }
  };

  const lireFichierDolibarr = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const grouped = {};
      const erreurs = [];

      rows.forEach((row) => {
        const ref = row["Réf. facture"];
        if (!grouped[ref]) grouped[ref] = [];
        grouped[ref].push(row);
      });

      const formulairesImportés = Object.entries(grouped).map(([ref, lignes]) => {
        const first = lignes[0];
        const demandePaiement = lignes.map((l) => {
          const qte = parseFloat(l["Quantité pour la ligne"]) || 0;
          const ttc = parseFloat(l["Montant TTC de la ligne"]) || 0;

          if (qte === 0 || ttc === 0) return null;

          const mntunitBrut = ttc / qte;
          const mntunit = arrondiWindev(mntunitBrut);
          const ttcCalcule = mntunit * qte;
          const diff = Math.abs(ttc - ttcCalcule);
          const diffArrondi = Math.round(diff * 100) / 100;

          if (diffArrondi > 0.05) {
            erreurs.push({ facture: ref, nature: l["Libéllé Urssaf"], diff: diffArrondi });
          }

          return {
            ca: l["Réf. produit"] || "",
            cn: l["Libéllé Urssaf"] || "",
            libprest: l["Libellé produit"] || "",
            qte,
            unit: l["unité"] || "",
            mntunit,
            mntprestht: parseFloat(l["Montant HT de la ligne"]) || 0,
            mntprestttc: ttc,
            mntpresttva: parseFloat(l["Montant TVA de la ligne"]) || 0,
            compl1: "",
            compl2: "SAP800771792"
          };
        }).filter(Boolean);

        return {
          id: Date.now() + Math.random(),
          clientId: first["N°Id Urssaf (AI)"] || "",
          nomclient: first["Nom/Enseigne/Raison sociale"] || "",
          selectedDate: (first["Date de naissance Urssaf (AI)"] || "").split("T")[0],
          dde: excelDateToISO(first["Date début"]),
          dfe: excelDateToISO(first["Date fin"]),
          datevers: excelDateToISO(first["Date début"]),
          datefact: excelDateToISO(first["Date facturation"]),
          numfacture: ref,
          identifiantT: first["N°Id Urssaf (AI)"] || "",
          mntacompte: 0,
          mntfht: parseFloat(first["Total HT"]) || 0,
          mntfttc: parseFloat(first["Total TTC"]) || 0,
          demandePaiement
        };
      });

      setFormulaires(formulairesImportés);

      if (erreurs.length > 0) {
        const lignes = erreurs.map(e => `- Facture : ${e.facture}, Code nature : ${e.nature}, Différence de ${e.diff.toFixed(2)}`);
        const message = [
          "Il existe une différence de montant sur le(s) facture(s)",
          "à gestion :",
          ...lignes
        ];
        setResumeErreurs(message);
        setShowModal(true);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const lireFichierApplication = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const grouped = {};
      const erreurs = [];
      const facturesConfirmées = [];

      rows.forEach((row) => {
        const ref = row["numFactureTiers"];
        if (!grouped[ref]) grouped[ref] = [];
        grouped[ref].push(row);
      });

      const formulairesImportés = Object.entries(grouped).map(([ref, lignes]) => {
        const first = lignes[0];
        const demandePaiement = lignes.map((l) => {
          const qte = parseFloat(l["quantite"]) || 0;
          const ttc = parseFloat(l["mntPrestationTTC"]) || 0;
          let mntunit = 0;

          if (qte !== 0) {
            const brut = ttc / qte;
            const partieEntiere = Math.floor(brut);
            const partieDecimale = parseFloat("0." + getDecimalDigits(brut));
            const arrondiDecimale = Math.round(partieDecimale * 100) / 100;
            mntunit = partieEntiere + arrondiDecimale;
          }

          const ttcCalcule = mntunit * qte;
          const diff = Math.abs(ttc - ttcCalcule);
          const diffArrondi = Math.round(diff * 100) / 100;

          if (diffArrondi > 0.05) {
            erreurs.push({ facture: ref, nature: l["codeNature"], diff: diffArrondi });
          }

          return {
            ca: l["codeActivite"],
            cn: l["codeNature"],
            libprest: l["libellePrestation"],
            qte,
            unit: l["unite"],
            mntunit,
            mntprestttc: ttc,
            mntprestht: parseFloat(l["mntPrestationHT"]) || 0,
            mntpresttva: parseFloat(l["mntPrestationTVA"]) || 0,
            compl1: "",
            compl2: l["complement2"] || "SAP800771792"
          };
        });

        const statutConfirmé = ref.startsWith("FA");
        if (statutConfirmé) {
          facturesConfirmées.push(ref);
        }

        return {
          id: Date.now() + Math.random(),
          clientId: first["idClient"] || "",
          nomclient: first["idTiersFacturation"] || "",
          selectedDate: first["dateNaissanceClient"] ? first["dateNaissanceClient"].split("T")[0] : today,
          dde: first["dateDebutEmploi"] ? first["dateDebutEmploi"].split("T")[0] : today,
          dfe: first["dateFinEmploi"] ? first["dateFinEmploi"].split("T")[0] : today,
          datevers: first["dateVersementAcompte"] ? first["dateVersementAcompte"].split("T")[0] : today,
          datefact: first["dateFacture"] ? first["dateFacture"].split("T")[0] : today,
          numfacture: ref,
          identifiantT: first["idClient"] || "",
          mntacompte: parseFloat(first["mntAcompte"]) || 0,
          mntfht: parseFloat(first["mntFactureHT"]) || 0,
          mntfttc: parseFloat(first["mntFactureTTC"]) || 0,
          demandePaiement

        };
      });

      setFormulaires(formulairesImportés);

      if (facturesConfirmées.length > 0) {
        const message = [
          "Impossible d'envoyer les demandes ci-dessous car statut client sont confirmés :",
          ...facturesConfirmées
        ];
        setResumeErreurs(message);
        setShowModal(true);
      } else if (erreurs.length > 0) {
        const lignes = erreurs.map(e => `- Facture : ${e.facture}, Code nature : ${e.nature}, Différence de ${e.diff.toFixed(2)}`);
        const message = [
          "Il existe une différence de montant sur le(s) facture(s)",
          "à gestion :",
          ...lignes
        ];
        setResumeErreurs(message);
        setShowModal(true);
      }
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

  const genererJSON = () => {
      if (formulaires.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
      }

      let payload;

      if (typeFichier === "dolibarr") {
        payload = formulaires.map((form) => ({
          idTiersFacturation: form.nomclient,
          idClient: form.clientId,
          dateNaissanceClient: form.selectedDate + "T00:00:00Z",
          numFactureTiers: form.numfacture,
          dateFacture: form.datefact + "T00:00:00Z",
          dateDebutEmploi: form.dde + "T00:00:00Z",
          dateFinEmploi: form.dfe + "T00:00:00Z",
          mntAcompte: form.mntacompte,
          dateVersementAcompte: form.datevers ? form.datevers + "T00:00:00Z" : "",
          mntFactureTTC: form.mntfttc,
          mntFactureHT: form.mntfht,
          inputPrestations: form.demandePaiement.map((p) => ({
            codeActivite: p.ca, // Dolibarr → Réf. produit
            codeNature: p.cn,   // Dolibarr → Libéllé Urssaf
            quantite: p.qte,
            unite: p.unit,
            mntUnitaireTTC: p.mntunit,
            mntPrestationTTC: p.mntprestttc,
            mntPrestationHT: p.mntprestht,
            mntPrestationTVA: p.mntpresttva,
            complement1: p.compl1,
            complement2: p.compl2
          })),
          nomUsage: form.nomclient

        }));
      } else if (typeFichier === "application") {
        payload = formulaires.map((form) => ({
          idClient: form.clientId,
          idTiersFacturation: form.nomclient,
          dateNaissanceClient: form.selectedDate + "T00:00:00Z",
          numFactureTiers: form.numfacture,
          dateFacture: form.datefact + "T00:00:00Z",
          dateDebutEmploi: form.dde + "T00:00:00Z",
          dateFinEmploi: form.dfe + "T00:00:00Z",
          dateVersementAcompte: form.datevers ? form.datevers + "T00:00:00Z" : "",
          mntAcompte: form.mntacompte,
          mntFactureHT: form.mntfht,
          mntFactureTTC: form.mntfttc,
          inputPrestations: form.demandePaiement.map((p) => ({
            codeActivite: p.ca, // Application → codeActivite
            codeNature: p.cn,   // Application → codeNature
            libellePrestation: p.libprest,
            quantite: p.qte,
            unite: p.unit,
            mntUnitaireTTC: p.mntunit,
            mntPrestationHT: p.mntprestht,
            mntPrestationTTC: p.mntprestttc,
            mntPrestationTVA: p.mntpresttva,
            complement1: p.compl1,
            complement2: p.compl2
          })),
          nomUsage: ""
        }));
      }

      

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "demande_paiement.json";
      a.click();
      URL.revokeObjectURL(url);
    };
    const envoyerVersBackend = async () => {
        if (formulaires.length === 0) {
          alert("Aucune donnée à envoyer.");
          return;
        }

        for (const form of formulaires) {
          // Construction du payload
          const payload = {
              ...DemandePaiement.defaults,
              idClient: form.clientId,
              numFactureTiers: form.numfacture,
              idDemandePaiement: DemandePaiement.defaults.idDemandePaiement,
              dateFacture: form.datefact,
              dateHeureCreation: new Date().toISOString().slice(0, 19).replace("T", " "),
              idTiersFacturation: form.nomclient || "inconnu",
              idClient_numFactureTiers: `${form.clientId}_${form.numfacture}`,
              //dateDebutEmploi: form.dde ||  DemandePaiement.defaults.dateDebutEmploi,
              //dateFinEmploi: form.dfe || DemandePaiement.defaults.dateFinEmploi,
              //dateVersementAcompte: form.datevers || DemandePaiement.defaults.dateVersementAcompte,
              //mntAcompte: form.mntacompte ?? DemandePaiement.defaults.mntAcompte,
              //mntFactureTTC: form.mntfttc ?? DemandePaiement.defaults.mntFactureTTC,
              //mntFactureHT: form.mntfht ?? DemandePaiement.defaults.mntFactureHT,
              dateDebutEmploi: DemandePaiement.defaults.dateDebutEmploi,
              dateFinEmploi: DemandePaiement.defaults.dateFinEmploi,
              dateVersementAcompte: DemandePaiement.defaults.dateVersementAcompte,
              mntAcompte: DemandePaiement.defaults.mntAcompte,
              mntFactureTTC: DemandePaiement.defaults.mntFactureTTC,
              mntFactureHT: DemandePaiement.defaults.mntFactureHT,
              statut: DemandePaiement.defaults.statut,
              statutlibelle: DemandePaiement.defaults.statutlibelle,
              inforejet: DemandePaiement.defaults.inforejet,
              inforejetcommentaire: DemandePaiement.defaults.inforejetcommentaire,
              mntVirement: DemandePaiement.defaults.mntVirement,
              dateVirement: DemandePaiement.defaults.dateVirement,
              ID_Utilisateurs: DemandePaiement.defaults.ID_Utilisateurs,
              dateHeureModification: DemandePaiement.defaults.dateHeureModification,
              ID_Particulier: DemandePaiement.defaults.ID_Particulier,
             


            };


          try {
            const res = await fetch("http://localhost:2083/demande", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Erreur réseau");
            const result = await res.json();
            console.log("Demande envoyée :", result);
          } catch (err) {
            console.error("Erreur lors de l'envoi :", err);
          }
        }

        alert("Migration terminée !");
      };

  return (
    <>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title fw-bold">DEMANDE DE PAIEMENT</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {resumeErreurs.map((line, i) => (
                  <p key={i} className={i < 2 ? "fw-bold mb-1" : "mb-1"}>{line}</p>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mt-4">
        <h2 className="text-center mb-4 fw-semibold text-primary">Demande de Paiement</h2>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Source du fichier</h5>
            <div className="mb-3">
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="sourceType" id="sourceFichier" checked={typeFichier === "application"} onChange={() => setTypeFichier("application")} />
                <label className="form-check-label" htmlFor="sourceFichier">À partir d'un fichier de l'Application</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="sourceType" id="sourceApp" checked={typeFichier === "dolibarr"} onChange={() => setTypeFichier("dolibarr")} />
                <label className="form-check-label" htmlFor="sourceApp">À partir d'une Exportation Dolibarr</label>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Importer un fichier</h5>
            <input type="file" className="form-control" accept=".xlsx,.xls,.csv,.json" onChange={handleFileChange} />
          </div>
        </div>

        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="Fichier cible" readOnly value={fichier?.name || ""} />
          <div className="d-flex flex-wrap gap-2">

            <button className="btn btn-success" onClick={() => fichier && window.open(URL.createObjectURL(fichier))}>
              Ouvrir Excel
            </button>
            {/*<button className="btn btn-primary" onClick={() => {
              alert("Demande de paiement envoyée");
              genererJSON();
            }}>
              Demande de Paiement
            </button>*/}
            {showDemandeBtn && (
              <button className="btn btn-primary" onClick={() => {
                alert("Demande de paiement envoyée");
                genererJSON();
              }}>
                Demande de Paiement
              </button>
            )}

            {showMigrationBtn && (
              <button
                className="btn btn-danger"
                onClick={envoyerVersBackend}
                title="**Utiliser le format import demande de paiement**"
              >
                MIGRATION ANCIENNES FACTURES
              </button>
            )}


          </div>
        </div>

        {formulaires.map((form) => (
          <div key={form.id} className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Facture {form.numfacture}</h5>
            </div>
            <div className="card-body">
              <div className="row g-3 mb-3">
                <div className="col-md-6 col-12"><label className="form-label">Nom client</label><input type="text" className="form-control" value={form.nomclient} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Identifiant client</label><input type="text" className="form-control" value={form.clientId} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Identifiant tiers</label><input type="text" className="form-control" value={form.identifiantT} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Date de naissance</label><input type="date" className="form-control" value={form.selectedDate} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Date versement acompte</label><input type="date" className="form-control" value={form.datevers} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Date début emploi</label><input type="date" className="form-control" value={form.dde} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Date fin emploi</label><input type="date" className="form-control" value={form.dfe} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Date facture</label><input type="date" className="form-control" value={form.datefact} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Montant acompte</label><input type="number" className="form-control" value={form.mntacompte.toFixed(2)} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Montant HT</label><input type="number" className="form-control" value={form.mntfht.toFixed(2)} readOnly /></div>
                <div className="col-md-6 col-12"><label className="form-label">Montant TTC</label><input type="number" className="form-control" value={form.mntfttc.toFixed(2)} readOnly /></div>
              </div>

              <div className="table-responsive mt-4 overflow-auto">

                <table className="table table-bordered table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Code Activité</th>
                      <th>Code Nature</th>
                      <th>Libellé</th>
                      <th>Quantité</th>
                      <th>Unité</th>
                      <th>Prix Unitaire</th>
                      <th>Montant TTC</th>
                      <th>Montant HT</th>
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
                        <td>{row.mntprestttc?.toFixed(2)}</td>
                        <td>{row.mntprestht?.toFixed(2)}</td>
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
    </>
  );

};
export default PaiementFichier;

