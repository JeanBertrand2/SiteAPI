import React, { useState, useEffect } from 'react';

const PaiementManuel = () => {
  const today = new Date().toISOString().split('T')[0];

  const [demandePaiement, setDemandePaiement] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [clientId, setclientId] = useState('');
  const [identifiantT, setIdtiers] = useState('');
  const [numfacture, setnumfacture] = useState(0);
  const [mntacompte, setMntacompte] = useState(0);
  const [datevers, setDatevers] = useState(today);
  const [datefact, setDatefact] = useState(today);
  const [nomclient, setNomclient] = useState('');
  const [dde, setDde] = useState(today);
  const [dfe, setDfe] = useState(today);
  const [mntfht, setMntfht] = useState(0);
  const [mntfttc, setMntfttc] = useState(0);

  const add = () => {
    alert("Ajout simulé !");
  };

  const reset = () => {
    setDemandePaiement([]);
  };

  const dem_paiement = () => {
    alert("Demande de paiement envoyée !");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">DEMANDE DE PAIEMENT</h2>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Identifiant client</label>
          <select className="form-select" value={clientId} onChange={(e) => setclientId(e.target.value)}>
            <option value="">-- Sélectionner un id client --</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Nom client</label>
          <input type="text" className="form-control" value={nomclient} onChange={(e) => setNomclient(e.target.value)} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Date de naissance</label>
          <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Date d'embauche</label>
          <input type="date" className="form-control" value={dde} onChange={(e) => setDde(e.target.value)} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Date fin emploi</label>
          <input type="date" className="form-control" value={dfe} onChange={(e) => setDfe(e.target.value)} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Date versement acompte</label>
          <input type="date" className="form-control" value={datevers} onChange={(e) => setDatevers(e.target.value)} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Date facture</label>
          <input type="date" className="form-control" value={datefact} onChange={(e) => setDatefact(e.target.value)} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Montant acompte</label>
          <input type="number" step="0.01" className="form-control" value={mntacompte} onChange={(e) => setMntacompte(parseFloat(e.target.value))} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Numéro facture tiers</label>
          <input type="number" className="form-control" value={numfacture} onChange={(e) => setnumfacture(parseInt(e.target.value))} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Identifiant tiers</label>
          <input type="text" className="form-control" value={identifiantT} onChange={(e) => setIdtiers(e.target.value)} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Montant facture HT</label>
          <input type="number" step="0.01" className="form-control" value={mntfht} onChange={(e) => setMntfht(parseFloat(e.target.value))} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Montant facture TTC</label>
          <input type="number" step="0.01" className="form-control" value={mntfttc} onChange={(e) => setMntfttc(parseFloat(e.target.value))} />
        </div>
      </div>

      <div className="mt-5">
        <h4 className="mb-3">Prestations</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Code Activity</th>
                <th>Code Nature</th>
                <th>Libellé prestation</th>
                <th>Quantité</th>
                <th>Unité</th>
                <th>Mnt Unit TTC</th>
                <th>Mnt Prestation TTC</th>
                <th>Mnt Prestation HT</th>
                <th>Mnt Prestation TVA</th>
                <th>Complément 1</th>
                <th>Complément 2</th>
              </tr>
            </thead>
            <tbody>
              {demandePaiement.map((cinput) => (
                <tr key={cinput.id}>
                  <td>{cinput.ca}</td>
                  <td>{cinput.cn}</td>
                  <td>{cinput.libprest}</td>
                  <td>{cinput.qte}</td>
                  <td>{cinput.unit.toFixed(2)} Ariary</td>
                  <td>{cinput.mntunit.toFixed(2)} Ariary</td>
                  <td>{cinput.mntprestttc.toFixed(2)} Ariary</td>
                  <td>{cinput.mntprestht.toFixed(2)} Ariary</td>
                  <td>{cinput.mntpresttva.toFixed(2)} Ariary</td>
                  <td>{cinput.compl1}</td>
                  <td>{cinput.compl2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-3 mt-4">
        <button className="btn btn-success" onClick={add}>+ Ajouter</button>
        <button className="btn btn-danger" onClick={reset}>Supprimer</button>
        <button className="btn btn-primary" onClick={dem_paiement}>Demande de paiement</button>
      </div>
    </div>
  );
};

export default PaiementManuel;
