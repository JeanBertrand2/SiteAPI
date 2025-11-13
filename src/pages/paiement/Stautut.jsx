import React, { useState } from "react";

const Stautut = () => {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [factures, setFactures] = useState("");
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [reponseUrssaf, setReponseUrssaf] = useState(null);
  const [message, setMessage] = useState("");

  const formatMontant = (val) => {
    const num = parseFloat(val);
    return isNaN(num) || num === 0 ? "0.00" : num.toFixed(2);
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const afficherResultat = () => {
    const payload = {};
    if (dateDebut.trim()) payload.dateDebut = dateDebut;
    if (dateFin.trim()) payload.dateFin = dateFin;
    if (factures.trim()) payload.factures = factures.trim();

    setLoading(true);
    setMessage("");

    fetch("http://localhost:2083/demande/recherche", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((data) => {
        setResultats(data.data);
        setTotal(data.total);
        setMessage(`${data.total} enregistrement(s) trouvé(s).`);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setMessage(" Échec de la récupération des résultats");
      })
      .finally(() => setLoading(false));
  };

  const interroger = async () => {
        setLoading(true);
        setMessage("");

        const estDateValide = (val) => val && !isNaN(Date.parse(val));
        const sansEspace = (val) => val.replace(/\s+/g, "");
        const nettoyerFactures = (str) =>
          str.split(",").map(f => f.trim()).filter(Boolean);

        const gf_dDatedebut = estDateValide(dateDebut) ? dateDebut : null;
        const gf_dDateFin = estDateValide(dateFin) ? dateFin : null;
        const gf_sListeFacture = nettoyerFactures(sansEspace(factures)); 

        const payload = {
          gf_dDatedebut,
          gf_dDateFin,
          gf_sListeFacture,
        };

        try {
          const res = await fetch("http://localhost:2083/demande/periode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error(await res.text());

          const data = await res.json();
          const facturesExistantes = data.gtabListeFacturePeriode || [];
          console.log("Factures détectées :", facturesExistantes.map(f => f.numFactureTiers));



          const formatISO = (val) => new Date(val).toISOString();
          const vMonVariant = {
            numFactureTiers: facturesExistantes.map((f) => f.numFactureTiers),
            dateDebut: gf_dDatedebut ? formatISO(gf_dDatedebut) : "2020-01-01T00:00:00Z",
            dateFin: gf_dDateFin ? formatISO(gf_dDateFin) : "2025-12-31T00:00:00Z",
            methode: "/demandePaiement/rechercher",
          };

          const lots = chunkArray(vMonVariant.numFactureTiers, 10);
          let allPaiements = [];

          for (const lot of lots) {
            const payloadLot = {
              numFactureTiers: lot, 
              dateDebut: vMonVariant.dateDebut,
              dateFin: vMonVariant.dateFin,
              methode: vMonVariant.methode
            };

            const resUrssaf = await fetch("http://localhost:2083/demande/interrogerUrssaf", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadLot), 
            });

            if (!resUrssaf.ok) {
              console.error("Erreur HTTP /interrogerUrssaf :", await resUrssaf.text());
              continue;
            }

            const result = await resUrssaf.json();
            if (Array.isArray(result) && result.some(e => e.code === "ERR_RECHERCHE_VIDE")) {
              setMessage("Aucune demande de paiement ne correspond aux factures ou dates que tu as envoyées.");
              continue;
            }

            const paiementsLot = result?.infoDemandePaiements || result?.result?.infoDemandePaiements || [];

            if (Array.isArray(paiementsLot)) {
              allPaiements.push(...paiementsLot);

              for (const paiement of paiementsLot) {
                try {
                  const dp = paiement.demandePaiement || {};
                  const statut = paiement.statut || {};
                  const infoRejet = paiement.infoRejet || {};
                  const infoVirement = paiement.infoVirement || {};

                  const payload = {
                    idDemandePaiement: paiement.idDemandePaiement,
                    idClient: dp.idClient,
                    idTiersFacturation: dp.idTiersFacturation,
                    numFactureTiers: dp.numFactureTiers,
                    dateFacture: dp.dateFacture,
                    dateDebutEmploi: dp.dateDebutEmploi,
                    dateFinEmploi: dp.dateFinEmploi,
                    mntAcompte: dp.mntAcompte,
                    dateVersementAcompte: dp.dateVersementAcompte,
                    mntFactureTTC: dp.mntFactureTTC,
                    mntFactureHT: dp.mntFactureHT,
                    statut: { code: statut.code, libelle: statut.libelle },
                    infoRejet: { code: infoRejet.code, commentaire: infoRejet.commentaire },
                    infoVirement: { mntVirement: infoVirement.mntVirement, dateVirement: infoVirement.dateVirement }
                  };

                  const resSave = await fetch("http://localhost:2083/demande/upsert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!resSave.ok) {
                    console.error("Erreur HTTP /upsert :", await resSave.text());
                  }
                } catch (err) {
                  console.error("Erreur lors de l'enregistrement :", err.message);
                }
              }
            }
          }

          setReponseUrssaf({ infoDemandePaiements: allPaiements });
         
          if (allPaiements.length === 0) {
            setMessage("Aucune demande de paiement ne correspond aux factures ou dates que tu as envoyées.");
            return;
          }
          afficherResultat();
          setMessage(`${allPaiements.length} paiement(s) récupéré(s) et enregistrés`);
        } catch (err) {
          console.error("Erreur globale dans interroger :", err);
          setMessage(" Échec de l'interrogation ou de l'enregistrement");
        } finally {
          setLoading(false);
        }
      };


  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">INTERROGATION PAIEMENT</h3>

      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Date Début</label>
          <input type="date" className="form-control" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Date Fin</label>
          <input type="date" className="form-control" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
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

      <div className="d-flex justify-content-end gap-3 mb-4">
        <button className="btn btn-primary" onClick={afficherResultat} disabled={loading}>
          {loading ? "Chargement..." : "Afficher résultat"}
        </button>
        <button className="btn btn-primary" onClick={interroger} disabled={loading}>
          Interrogation
        </button>
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="spinner-border text-primary" role="status" />
          <span>Traitement en cours…</span>
        </div>
      )}

      {message && (
        <div
          className={`alert ${
            message.includes("aucune demande") || message.includes("Aucune demande")
              ? "alert-danger"
              : "alert-success"
          } mt-2`}
          role="alert"
        >
          {message}
        </div>
      )}


{resultats.length > 0 ? (
  <div className="table-responsive mt-4">
    <table className="table table-bordered table-striped">
      <thead className="table-light">
        <tr>
          <th>Statut</th>
          <th>Libellé Statut</th>
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
          <th>Montant TTC</th>
          <th>Montant HT</th>
          <th>Info Rejet</th>
          <th>Commentaire Rejet</th>
          <th>Montant Virement</th>
          <th>Date Virement</th>
        </tr>
      </thead>
      <tbody>
        {resultats.map((item, index) => (
          <tr key={index}>
            <td>{item.statut}</td>
            <td className={
              item.statutlibelle === "Payée" ? "text-success" :
              item.statutlibelle === "Refusée" ? "text-danger" :
              "text-primary"
            }>
              {item.statutlibelle}
            </td>
            <td>{item.idDemandePaiement || "—"}</td>
            <td>{item.datefacture}</td>
            <td>{item.debutEmploi}</td>
            <td>{item.finEmploi}</td>
            <td>{item.idClient}</td>
            <td>{item.nom}</td>
            <td>{item.prenom}</td>
            <td>{item.naissance}</td>
            <td>{item.numFacture}</td>
            <td>{item.dateAcompte}</td>
            <td>{formatMontant(item.montant)}</td>
            <td>{item.idTiers}</td>
            <td>{formatMontant(item.mntFactureTTC)}</td>
            <td>{formatMontant(item.mntFactureHT)}</td>                    
            <td>{item.inforejet}</td>
            <td>{item.inforejetcommentaire}</td>
            <td>{formatMontant(item.mntVirement)}</td>
            <td>{item.dateVirement}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  !loading && (
    <div className="text-center text-muted mt-4">
      <em>Aucun résultat à afficher</em>
    </div>
  )
)}
    </div>
  );
};

export default Stautut;
