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

  const activites = ['304001', '304002', '304003'];
  const unites = ['FORFAIT', 'HEURE', 'JOUR'];
  const natures = [
    { code: 'NAT001', libelle: 'Aide humaine' },
    { code: 'NAT002', libelle: 'Transport accompagné' },
    { code: 'NAT003', libelle: 'Assistance administrative' },
  ];

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'CLIENT_SELECTION') {
        const { id, nom, naissance, tiers } = event.data.payload;
        setclientId(id);
        setNomclient(nom);
        setSelectedDate(naissance);
        setIdtiers(tiers);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const add = () => {
    const nouvelleLigne = {
      ca: '',
      cn: '',
      libprest: '',
      qte: 0,
      unit: '',
      mntunit: 0,
      mntprestttc: 0,
      mntprestht: 0,
      mntpresttva: 0,
      compl1: '',
      compl2: '',
    };
    setDemandePaiement([...demandePaiement, nouvelleLigne]);
  };

  const reset = () => setDemandePaiement([]);

  const dem_paiement = () => alert("Demande de paiement envoyée !");

  const updateRow = (index, field, value) => {
    const updated = [...demandePaiement];
    updated[index][field] = value;
    setDemandePaiement(updated);
  };

  const calculTotaux = () => {
    let ttc = 0, ht = 0, tva = 0;
    demandePaiement.forEach((row) => {
      ttc += row.mntprestttc || 0;
      ht += row.mntprestht || 0;
      tva += row.mntpresttva || 0;
    });
    return { ttc, ht, tva };
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">DEMANDE DE PAIEMENT</h2>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Identifiant client</label>
        <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={clientId}
              onChange={(e) => setclientId(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => window.open('/src/pages/inscription/InterogStatut.jsx', '_blank')}
            >
              🔍
            </button>
          </div>

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
          <table className="table table-bordered table-striped table-sm w-100">
            <thead className="table-light">
              <tr>
                <th className="text-nowrap">Code Activity</th>
                <th className="text-nowrap">Code Nature</th>
                <th className="text-nowrap">Libellé prestation</th>
                <th className="text-nowrap">Quantité</th>
                <th className="text-nowrap">Unité</th>
                <th className="text-nowrap">Mnt Unit TTC</th>
                <th className="text-nowrap">Mnt Prestation TTC</th>
                <th className="text-nowrap">Mnt Prestation HT</th>
                <th className="text-nowrap">Mnt Prestation TVA</th>
                <th className="text-nowrap">Complément 1</th>
                <th className="text-nowrap">Complément 2</th>
              </tr>
            </thead>
            <tbody>
                {demandePaiement.map((row, index) => (
                  <tr key={index}>
                     {/* Code Activité */}
                     <td className="text-nowrap">
                            <select
                              className="form-select"
                              value={row.ca}
                              onChange={(e) => updateRow(index, 'ca', e.target.value)}
                            >
                              <option value="">-- Choisir --</option>
                              {activites.map((code) => (
                                <option key={code} value={code}>{code}</option>
                              ))}
                            </select>
                          </td>

                          {/* Code Nature */}
                          <td className="text-nowrap">
                            <select
                              className="form-select"
                              value={row.cn}
                              onChange={(e) => {
                                const selectedCode = e.target.value;
                                const nature = natures.find(n => n.code === selectedCode);
                                updateRow(index, 'cn', selectedCode);
                                if (nature) {
                                  updateRow(index, 'libprest', nature.libelle);
                                }
                              }}
                            >
                              <option value="">-- Choisir --</option>
                              {natures.map((n) => (
                                <option key={n.code} value={n.code}>{n.code}</option>
                              ))}
                            </select>
                          </td>
                    <td><input type="text" className="form-control" value={row.libprest} onChange={(e) => updateRow(index, 'libprest', e.target.value)} /></td>
                    <td><input type="number" className="form-control" value={row.qte} onChange={(e) => updateRow(index, 'qte', parseFloat(e.target.value))} /></td>

                    {/* Unité */}
                      <td className="text-nowrap">
                        <select
                          className="form-select"
                          value={row.unit}
                          onChange={(e) => updateRow(index, 'unit', e.target.value)}
                        >
                          <option value="">-- Choisir --</option>
                          {unites.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </td>

                    <td><input type="number" className="form-control" value={row.mntunit} onChange={(e) => updateRow(index, 'mntunit', parseFloat(e.target.value))} /></td>
                    <td><input type="number" className="form-control" value={row.mntprestttc} onChange={(e) => updateRow(index, 'mntprestttc', parseFloat(e.target.value))} /></td>
                    <td><input type="number" className="form-control" value={row.mntprestht} onChange={(e) => updateRow(index, 'mntprestht', parseFloat(e.target.value))} /></td>
                    <td><input type="number" className="form-control" value={row.mntpresttva} onChange={(e) => updateRow(index, 'mntpresttva', parseFloat(e.target.value))} /></td>
                    <td><input type="text" className="form-control" value={row.compl1} onChange={(e) => updateRow(index, 'compl1', e.target.value)} /></td>
                    <td><input type="text" className="form-control" value={row.compl2} onChange={(e) => updateRow(index, 'compl2', e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>

            <tfoot>
              <tr className="table-secondary fw-bold">
                <td colSpan="6">Totaux</td>
                <td>{calculTotaux().ttc.toFixed(2)} Ariary</td>
                <td>{calculTotaux().ht.toFixed(2)} Ariary</td>
                <td>{calculTotaux().tva.toFixed(2)} Ariary</td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Boutons */}
      <div className="d-flex justify-content-end gap-3 mt-4">
        <button className="btn btn-success" onClick={add}>+ Ajouter</button>
        <button className="btn btn-danger" onClick={reset}>Supprimer</button>
        <button className="btn btn-primary" onClick={dem_paiement}>Demande de paiement</button>
      </div>
    </div>
  );
};

export default PaiementManuel;
