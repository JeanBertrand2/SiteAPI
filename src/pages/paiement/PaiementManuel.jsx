import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Confirmation from "../../components/Modal/Confirmation";
import "./PaiementManuel.css";
const PaiementManuel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().split("T")[0];
  const [showModal, setShowModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  const [activites, setActivites] = useState([]);
  const [unites, setUnites] = useState([]);
  const [natures, setNatures] = useState([]);

  const initialFormState = {
    demandePaiement: [],
    selectedDate: today,
    clientId: "",
    identifiantT: "",
    numfacture: 0,
    mntacompte: 0,
    datevers: today,
    datefact: today,
    nomclient: "",
    dde: today,
    dfe: today,
    mntfht: 0,
    mntfttc: 0,
  };

  const [formulaires, setFormulaires] = useState(() => {
    if (location.state?.allFormulaires) {
      return location.state.allFormulaires;
    }
    return [{ ...initialFormState, id: Date.now() }];
  });

  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const response = await fetch("http://localhost:2083/api/donnees-combo");
        const data = await response.json();

        setActivites(data.filter((item) => item.Type === "CodeActivite"));
        setUnites(data.filter((item) => item.Type === "Unite"));
        setNatures(data.filter((item) => item.Type === "NaturePrestation"));
      } catch (error) {
        console.error("Erreur chargement combos :", error);
      }
    };

    fetchComboData();
  }, []);

  useEffect(() => {
    const clientData = location.state?.clientData;
    const formId = location.state?.formId ?? 0;

    if (clientData) {
      // support multiple possible field names from the source
      const id =
        clientData.id ??
        clientData.idClient ??
        clientData.identifiantClient ??
        "";
      const nom =
        clientData.nom ??
        `${clientData.prenoms ?? ""} ${clientData.nomNaissance ?? ""}`.trim();
      const naissance =
        clientData.naissance ??
        clientData.dateNaissance ??
        clientData.selectedDate ??
        today;
      const tiers =
        clientData.tiers ??
        clientData.identifiantTiers ??
        clientData.identifiantT ??
        "";

      setFormulaires((prevForms) =>
        prevForms.map((form, idx) =>
          idx === formId
            ? {
                ...form,
                clientId: id,
                nomclient: nom,
                selectedDate: naissance,
                identifiantT: tiers,
              }
            : form
        )
      );
    }
  }, [location]);

  const ajouterNouveauFormulaire = () => {
    setFormulaires([...formulaires, { ...initialFormState, id: Date.now() }]);
  };

  const supprimerFormulaire = (index) => {
    if (formulaires.length > 1) {
      setFormulaires(formulaires.filter((_, idx) => idx !== index));
    } else {
      alert("Vous devez garder au moins un formulaire !");
    }
  };

  const updateFormField = (formIndex, field, value) => {
    setFormulaires((prevForms) =>
      prevForms.map((form, idx) =>
        idx === formIndex ? { ...form, [field]: value } : form
      )
    );
  };

  const add = (formIndex) => {
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
    setFormulaires((prevForms) =>
      prevForms.map((form, idx) =>
        idx === formIndex
          ? {
              ...form,
              demandePaiement: [...form.demandePaiement, nouvelleLigne],
            }
          : form
      )
    );
  };

  const reset = (formIndex) => {
    setFormulaires((prevForms) =>
      prevForms.map((form, idx) =>
        idx === formIndex ? { ...form, demandePaiement: [] } : form
      )
    );
  };

  const dem_paiement = (formIndex) => {
    alert(`Demande de paiement envoyée pour le formulaire ${formIndex + 1} !`);
  };

  const updateRow = (formIndex, rowIndex, field, value) => {
    setFormulaires((prevForms) =>
      prevForms.map((form, idx) => {
        if (idx === formIndex) {
          const updatedDemandes = [...form.demandePaiement];
          updatedDemandes[rowIndex][field] = value;
          return { ...form, demandePaiement: updatedDemandes };
        }
        return form;
      })
    );
  };

  const calculTotaux = (demandePaiement) => {
    let ttc = 0,
      ht = 0,
      tva = 0;
    demandePaiement.forEach((row) => {
      ttc += row.mntprestttc || 0;
      ht += row.mntprestht || 0;
      tva += row.mntpresttva || 0;
    });
    return { ttc, ht, tva };
  };

  const navigateToStatut = (formIndex) => {
    navigate("/inscription/statut", {
      state: {
        formId: formIndex,
        allFormulaires: formulaires,
      },
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-semibold text-primary">Demande de Paiement</h2>
        <button className="btn btn-success" onClick={ajouterNouveauFormulaire}>
          + Nouveau Formulaire
        </button>
      </div>

      {formulaires.map((formulaire, formIndex) => (
        <div key={formulaire.id} className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Formulaire</h5>
            {formulaires.length > 1 && (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  // Open confirmation modal and store which form index to delete
                  setFormToDelete(formIndex);
                  setShowModal(true);
                }}
              >
                Supprimer ce formulaire
              </button>
            )}
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Identifiant client</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={formulaire.clientId}
                    onChange={(e) =>
                      updateFormField(formIndex, "clientId", e.target.value)
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => navigateToStatut(formIndex)}
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
                  value={formulaire.nomclient}
                  onChange={(e) =>
                    updateFormField(formIndex, "nomclient", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date de naissance</label>
                <input
                  type="date"
                  className="form-control"
                  value={formulaire.selectedDate}
                  onChange={(e) =>
                    updateFormField(formIndex, "selectedDate", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date d'embauche</label>
                <input
                  type="date"
                  className="form-control"
                  value={formulaire.dde}
                  onChange={(e) =>
                    updateFormField(formIndex, "dde", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date fin emploi</label>
                <input
                  type="date"
                  className="form-control"
                  value={formulaire.dfe}
                  onChange={(e) =>
                    updateFormField(formIndex, "dfe", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date versement acompte</label>
                <input
                  type="date"
                  className="form-control"
                  value={formulaire.datevers}
                  onChange={(e) =>
                    updateFormField(formIndex, "datevers", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date facture</label>
                <input
                  type="date"
                  className="form-control"
                  value={formulaire.datefact}
                  onChange={(e) =>
                    updateFormField(formIndex, "datefact", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Montant acompte</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formulaire.mntacompte}
                  onChange={(e) =>
                    updateFormField(
                      formIndex,
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
                  value={formulaire.numfacture}
                  onChange={(e) =>
                    updateFormField(
                      formIndex,
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
                  value={formulaire.identifiantT}
                  onChange={(e) =>
                    updateFormField(formIndex, "identifiantT", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Montant facture HT</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formulaire.mntfht}
                  onChange={(e) =>
                    updateFormField(
                      formIndex,
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
                  step="0.01"
                  className="form-control"
                  value={formulaire.mntfttc}
                  onChange={(e) =>
                    updateFormField(
                      formIndex,
                      "mntfttc",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="mt-5">
              <h4 className="mb-3">Prestations</h4>
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-sm w-100 table-fixed">
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
                    {formulaire.demandePaiement.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {/* Code Activité */}
                        <td className="text-nowrap">
                          <select
                            className="form-select"
                            value={row.ca}
                            onChange={(e) =>
                              updateRow(
                                formIndex,
                                rowIndex,
                                "ca",
                                e.target.value
                              )
                            }
                          >
                            <option value="">-- Choisir --</option>
                            {activites.map((item) => (
                              <option key={item.Code} value={item.Code}>
                                {item.Libelle}
                              </option>
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
                              const nature = natures.find(
                                (n) => n.Code === selectedCode
                              );

                              updateRow(
                                formIndex,
                                rowIndex,
                                "cn",
                                selectedCode
                              );
                              updateRow(
                                formIndex,
                                rowIndex,
                                "libprest",
                                nature?.Libelle || ""
                              );
                            }}
                          >
                            <option value="">-- Choisir --</option>
                            {natures.map((item) => (
                              <option key={item.Code} value={item.Code}>
                                {item.Code} - {item.Libelle}
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
                              updateRow(
                                formIndex,
                                rowIndex,
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
                              updateRow(
                                formIndex,
                                rowIndex,
                                "qte",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </td>

                        {/* Unité */}
                        <td className="text-nowrap">
                          <select
                            className="form-select"
                            value={row.unit}
                            onChange={(e) =>
                              updateRow(
                                formIndex,
                                rowIndex,
                                "unit",
                                e.target.value
                              )
                            }
                          >
                            <option value="">-- Choisir --</option>
                            {unites.map((item) => (
                              <option key={item.Code} value={item.Code}>
                                {item.Libelle}
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
                              updateRow(
                                formIndex,
                                rowIndex,
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
                              updateRow(
                                formIndex,
                                rowIndex,
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
                              updateRow(
                                formIndex,
                                rowIndex,
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
                              updateRow(
                                formIndex,
                                rowIndex,
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
                              updateRow(
                                formIndex,
                                rowIndex,
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
                              updateRow(
                                formIndex,
                                rowIndex,
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
                      <td>
                        {calculTotaux(formulaire.demandePaiement).ttc.toFixed(
                          2
                        )}{" "}
                        Ariary
                      </td>
                      <td>
                        {calculTotaux(formulaire.demandePaiement).ht.toFixed(2)}{" "}
                        Ariary
                      </td>
                      <td>
                        {calculTotaux(formulaire.demandePaiement).tva.toFixed(
                          2
                        )}{" "}
                        Ariary
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                className="btn btn-success"
                onClick={() => add(formIndex)}
              >
                + Ajouter
              </button>
              <button
                className="btn btn-danger"
                onClick={() => reset(formIndex)}
              >
                Supprimer
              </button>
              <button
                className="btn btn-primary"
                onClick={() => dem_paiement(formIndex)}
              >
                Demande de paiement
              </button>
            </div>
          </div>
        </div>
      ))}

      <Confirmation
        isOpen={showModal}
        title="Confirmer la suppression"
        message={
          formToDelete !== null
            ? `Voulez-vous vraiment supprimer le formulaire ${
                formToDelete + 1
              } ?`
            : "Voulez-vous vraiment supprimer cet élément ?"
        }
        onConfirm={() => {
          if (formToDelete !== null) {
            supprimerFormulaire(formToDelete);
          }
          setShowModal(false);
          setFormToDelete(null);
        }}
        onClose={() => {
          setShowModal(false);
          setFormToDelete(null);
        }}
      />
    </div>
  );
};

export default PaiementManuel;
