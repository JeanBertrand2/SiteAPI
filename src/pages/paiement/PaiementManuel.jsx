import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaiementManuel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().split("T")[0];

  const [blocsPaiement, setBlocsPaiement] = useState([
    {
      id: Date.now(),
      clientId: "",
      nomclient: "",
      naissance: today,
      dde: today,
      dfe: today,
      datevers: today,
      datefact: today,
      mntacompte: 0,
      numfacture: 0,
      identifiantT: "",
      mntfht: 0,
      mntfttc: 0,
      lignes: [],
    },
  ]);

  const activites = ["304001", "304002", "304003"];
  const unites = ["FORFAIT", "HEURE", "JOUR"];
  const natures = [
    { code: "NAT001", libelle: "Aide humaine" },
    { code: "NAT002", libelle: "Transport accompagné" },
    { code: "NAT003", libelle: "Assistance administrative" },
  ];

  // Récupérer les données transmises par la navigation depuis InterogStatut
  useEffect(() => {
    if (location.state?.clientData) {
      const { id, nom, naissance, tiers } = location.state.clientData;

      // Mettre à jour le premier bloc avec les données du client
      setBlocsPaiement((prevBlocs) => {
        const blocs = [...prevBlocs];
        if (blocs.length > 0) {
          blocs[0] = {
            ...blocs[0],
            clientId: id || "",
            nomclient: nom || "",
            naissance: naissance || today,
            identifiantT: tiers || "",
          };
        }
        return blocs;
      });
    }
  }, [location.state, today]);

  const ajouterBlocPaiement = () => {
    const nouveauBloc = {
      id: Date.now(),
      clientId: "",
      nomclient: "",
      naissance: today,
      dde: today,
      dfe: today,
      datevers: today,
      datefact: today,
      mntacompte: 0,
      numfacture: 0,
      identifiantT: "",
      mntfht: 0,
      mntfttc: 0,
      lignes: [],
    };
    setBlocsPaiement([...blocsPaiement, nouveauBloc]);
  };

  const ajouterLigne = (blocIndex) => {
    const nouvelleLigne = {
      ca: "",
      cn: "",
      libprest: "",
      qte: 0,
      unit: "",
      mntunit: 0,
      mntprestttc: 0,
      mntprestht: 0,
      mntpresttva: 0,
      compl1: "",
      compl2: "",
    };
    const blocs = [...blocsPaiement];
    blocs[blocIndex].lignes.push(nouvelleLigne);
    setBlocsPaiement(blocs);
  };

  const updateBlocField = (blocIndex, field, value) => {
    const blocs = [...blocsPaiement];
    blocs[blocIndex][field] = value;
    setBlocsPaiement(blocs);
  };

  const updateLigne = (blocIndex, ligneIndex, field, value) => {
    const blocs = [...blocsPaiement];
    blocs[blocIndex].lignes[ligneIndex][field] = value;
    setBlocsPaiement(blocs);
  };

  const calculTotaux = (bloc) => {
    let ttc = 0,
      ht = 0,
      tva = 0;
    bloc.lignes.forEach((row) => {
      ttc += row.mntprestttc || 0;
      ht += row.mntprestht || 0;
      tva += row.mntpresttva || 0;
    });
    return { ttc, ht, tva };
  };

  const envoyerPaiement = () => {
    alert("Demande de paiement envoyée !");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-semibold text-primary">
        Demande de Paiement
      </h2>

      <div className="text-end mb-3">
        <button className="btn btn-warning" onClick={ajouterBlocPaiement}>
          + Nouveau
        </button>
      </div>

      {blocsPaiement.map((bloc, blocIndex) => (
        <div key={bloc.id} className="border rounded p-4 mb-5 shadow-sm">
          {/*<h5 className="text-primary mb-3">Bloc #{blocIndex + 1}</h5>*/}

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Identifiant client</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={bloc.clientId}
                  onChange={(e) =>
                    updateBlocField(blocIndex, "clientId", e.target.value)
                  }
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => navigate("/inscription/statut")}
                  title="Voir le statut d'inscription"
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Nom client</label>
              <input
                type="text"
                className="form-control"
                value={bloc.nomclient}
                onChange={(e) =>
                  updateBlocField(blocIndex, "nomclient", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date de naissance</label>
              <input
                type="date"
                className="form-control"
                value={bloc.naissance}
                onChange={(e) =>
                  updateBlocField(blocIndex, "naissance", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date d'embauche</label>
              <input
                type="date"
                className="form-control"
                value={bloc.dde}
                onChange={(e) =>
                  updateBlocField(blocIndex, "dde", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date fin emploi</label>
              <input
                type="date"
                className="form-control"
                value={bloc.dfe}
                onChange={(e) =>
                  updateBlocField(blocIndex, "dfe", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date versement acompte</label>
              <input
                type="date"
                className="form-control"
                value={bloc.datevers}
                onChange={(e) =>
                  updateBlocField(blocIndex, "datevers", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date facture</label>
              <input
                type="date"
                className="form-control"
                value={bloc.datefact}
                onChange={(e) =>
                  updateBlocField(blocIndex, "datefact", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Montant acompte</label>
              <input
                type="number"
                className="form-control"
                value={bloc.mntacompte}
                onChange={(e) =>
                  updateBlocField(
                    blocIndex,
                    "mntacompte",
                    parseFloat(e.target.value)
                  )
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Numéro facture tiers</label>
              <input
                type="number"
                className="form-control"
                value={bloc.numfacture}
                onChange={(e) =>
                  updateBlocField(
                    blocIndex,
                    "numfacture",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Identifiant tiers</label>
              <input
                type="text"
                className="form-control"
                value={bloc.identifiantT}
                onChange={(e) =>
                  updateBlocField(blocIndex, "identifiantT", e.target.value)
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Montant facture HT</label>
              <input
                type="number"
                className="form-control"
                value={bloc.mntfht}
                onChange={(e) =>
                  updateBlocField(
                    blocIndex,
                    "mntfht",
                    parseFloat(e.target.value)
                  )
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Montant facture TTC</label>
              <input
                type="number"
                className="form-control"
                value={bloc.mntfttc}
                onChange={(e) =>
                  updateBlocField(
                    blocIndex,
                    "mntfttc",
                    parseFloat(e.target.value)
                  )
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <h6>Prestations</h6>
            <table className="table table-bordered table-sm">
              <thead className="table-light">
                <tr>
                  <th>Code Activité</th>
                  <th>Code Nature</th>
                  <th>Libellé</th>
                  <th>Quantité</th>
                  <th>Unité</th>
                  <th>Unit TTC</th>
                  <th>TTC</th>
                  <th>HT</th>
                  <th>TVA</th>
                  <th>Complément 1</th>
                  <th>Complément 2</th>
                </tr>
              </thead>
              <tbody>
                {bloc.lignes.map((row, ligneIndex) => (
                  <tr key={ligneIndex}>
                    <td>
                      <select
                        className="form-select"
                        value={row.ca}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "ca",
                            e.target.value
                          )
                        }
                      >
                        <option value="">-- Choisir --</option>
                        {activites.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={row.cn}
                        onChange={(e) => {
                          const selectedCode = e.target.value;
                          const nature = natures.find(
                            (n) => n.code === selectedCode
                          );
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "cn",
                            selectedCode
                          );
                          if (nature) {
                            updateLigne(
                              blocIndex,
                              ligneIndex,
                              "libprest",
                              nature.libelle
                            );
                          }
                        }}
                      >
                        <option value="">-- Choisir --</option>
                        {natures.map((n) => (
                          <option key={n.code} value={n.code}>
                            {n.code}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.libprest}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "libprest",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.qte}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "qte",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={row.unit}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "unit",
                            e.target.value
                          )
                        }
                      >
                        <option value="">-- Choisir --</option>
                        {unites.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.mntunit}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "mntunit",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.mntprestttc}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "mntprestttc",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.mntprestht}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "mntprestht",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.mntpresttva}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "mntpresttva",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.compl1}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "compl1",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.compl2}
                        onChange={(e) =>
                          updateLigne(
                            blocIndex,
                            ligneIndex,
                            "compl2",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan="6">Totaux</td>
                  <td>{calculTotaux(bloc).ttc.toFixed(2)} Ariary</td>
                  <td>{calculTotaux(bloc).ht.toFixed(2)} Ariary</td>
                  <td>{calculTotaux(bloc).tva.toFixed(2)} Ariary</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>

            <div className="d-flex justify-content-end gap-3 mt-3">
              <button
                className="btn btn-success"
                onClick={() => ajouterLigne(blocIndex)}
              >
                + Ajouter ligne
              </button>
              <button className="btn btn-primary" onClick={envoyerPaiement}>
                Demande de paiement
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaiementManuel;
