import React, { useState } from 'react';


const Stautut = () =>  {
  const today = new Date().toISOString().split('T')[0];
  const [dateDebut, setDateDebut] = useState(today);
  const [dateFin, setDateFin] = useState(today);
  const [factures, setFactures] = useState("");
  const [resultats, setResultats] = useState([]);
 
  const afficherResultat = () => {
     console.log('Afficher résultat avec :', { dateDebut, dateFin, factures });
     setResultats([
    {
      idDemande: 1,
      datefacture: '2023-01-15',
      debutEmploi: '2023-01-10',
      finEmploi: '2023-02-10',
      idClient: 'C001',
      nom: 'Rakoto',
      prenom: 'Jean',
      naissance: '1990-05-12',
      numFacture: 'F123',
      dateAcompte: '2023-02-15',
      montant: '150000',
      idTiers: 'T001',
    },
  ]);
  console.log('Résultats mis à jour');
  };
 
  const interroger = () => {
     console.log('Interrogation avec :', { dateDebut, dateFin, factures });
  };
  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">INTERROGATION PAIEMENT</h3>
 
      {/* Filtres */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Date Début</label>
          <input
            type="date"
            className="form-control"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Date Fin</label>
          <input
            type="date"
            className="form-control"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">N° Facture séparé par virgule</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: F123,F456,F789"
            value={factures}
            onChange={(e) => setFactures(e.target.value)}
          />
        </div>
      </div>
 
      {/* Boutons */}
      <div className="d-flex justify-content-end gap-3 mb-4">
        <button className="btn btn-primary" onClick={afficherResultat}>
          Afficher résultat
        </button>
        <button className="btn btn-secondary" onClick={interroger}>
          Interrogation
        </button>
      </div>
 
      {/* Tableau des résultats */}
      {resultats.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Id Demande Paiement</th>
                <th>Date facture</th>
                <th>Date Début Emploi</th>
                <th>Date Fin Emploi</th>
                <th>Id Client</th>
                <th>Nom Client</th>
                <th>Prénom Client</th>
                <th>Date Naissance Client</th>
                <th>Num Facture Tiers</th>
                <th>Date Versement Acompte</th>
                <th>Montant Acompte</th>
                <th>Id Tiers Facturé</th>
                
              </tr>
            </thead>
            <tbody>
              
              {resultats.map((item, index) => (
                <tr key={index}>
                  <td>{item.idDemande}</td>
                  <td>{item.datefacture}</td>
                  <td>{item.debutEmploi}</td>
                  <td>{item.finEmploi}</td>
                  <td>{item.idClient}</td>
                  <td>{item.nom}</td>
                  <td>{item.prenom}</td>
                  <td>{item.naissance}</td>
                  <td>{item.numFacture}</td>
                  <td>{item.dateAcompte}</td>
                  <td>{item.montant}</td>
                  <td>{item.idTiers}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-muted">
          <em>Aucun résultat à afficher</em>
        </div>
      )}
    </div>
  );
};
 
export default Stautut;