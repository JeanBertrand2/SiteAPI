/**
 * Validation des données de demande de paiement
 */

export const validateDemandePaiement = (formulaire) => {
  const errors = [];
  const warnings = [];

  // 1. Validation des champs obligatoires
  if (!formulaire.clientId || formulaire.clientId.trim() === "") {
    errors.push("L'identifiant client est obligatoire");
  }

  if (!formulaire.identifiantT || formulaire.identifiantT.trim() === "") {
    errors.push("L'identifiant du tiers facturant est obligatoire");
  }

  if (!formulaire.nomclient || formulaire.nomclient.trim() === "") {
    errors.push("Le nom du client est obligatoire");
  }

  if (!formulaire.numfacture || formulaire.numfacture === 0) {
    errors.push("Le numéro de facture est obligatoire");
  }

  // 2. Validation des dates
  const dateDebut = new Date(formulaire.dde);
  const dateFin = new Date(formulaire.dfe);
  const dateFacture = new Date(formulaire.datefact);
  const dateNaissance = new Date(formulaire.selectedDate);

  if (dateFin < dateDebut) {
    errors.push(
      "La date de fin d'emploi ne peut pas être antérieure à la date de début"
    );
  }

  if (dateFacture < dateDebut) {
    warnings.push(
      "La date de facture est antérieure à la date de début d'emploi"
    );
  }

  // Vérifier que la date de naissance est cohérente (personne entre 16 et 120 ans)
  const age = (new Date() - dateNaissance) / (365.25 * 24 * 60 * 60 * 1000);
  if (age < 16 || age > 120) {
    warnings.push(`L'âge du client (${Math.floor(age)} ans) semble incorrect`);
  }

  // 3. Validation de l'acompte
  if (formulaire.mntacompte > 0 && !formulaire.datevers) {
    errors.push(
      "La date de versement de l'acompte est obligatoire si le montant acompte est renseigné"
    );
  }

  if (formulaire.mntacompte > formulaire.mntfttc) {
    errors.push(
      "Le montant de l'acompte ne peut pas être supérieur au montant total TTC"
    );
  }

  // 4. Validation des prestations
  if (!formulaire.demandePaiement || formulaire.demandePaiement.length === 0) {
    errors.push("Au moins une prestation doit être ajoutée");
  } else {
    formulaire.demandePaiement.forEach((prestation, index) => {
      const prestErrors = validatePrestation(prestation, index);
      errors.push(...prestErrors.errors);
      warnings.push(...prestErrors.warnings);
    });

    // 5. Validation des totaux
    const totauxCalcules = calculTotaux(formulaire.demandePaiement);

    const TOLERANCE = 0.02; // Tolérance de 2 centimes pour les arrondis

    if (Math.abs(formulaire.mntfttc - totauxCalcules.ttc) > TOLERANCE) {
      errors.push(
        `Le montant total TTC (${formulaire.mntfttc.toFixed(
          2
        )}) ne correspond pas à la somme des prestations (${totauxCalcules.ttc.toFixed(
          2
        )})`
      );
    }

    if (Math.abs(formulaire.mntfht - totauxCalcules.ht) > TOLERANCE) {
      errors.push(
        `Le montant total HT (${formulaire.mntfht.toFixed(
          2
        )}) ne correspond pas à la somme des prestations (${totauxCalcules.ht.toFixed(
          2
        )})`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

const validatePrestation = (prestation, index) => {
  const errors = [];
  const warnings = [];
  const ligne = `Prestation ligne ${index + 1}`;

  // Champs obligatoires
  if (!prestation.cn || prestation.cn === "") {
    errors.push(`${ligne}: Le code nature est obligatoire`);
  }

  if (!prestation.unit || prestation.unit === "") {
    errors.push(`${ligne}: L'unité est obligatoire`);
  }

  if (prestation.qte <= 0) {
    errors.push(`${ligne}: La quantité doit être supérieure à 0`);
  }

  if (prestation.mntunit <= 0) {
    errors.push(`${ligne}: Le montant unitaire doit être supérieur à 0`);
  }

  // Validation cohérence financière
  const TOLERANCE = 0.02; // Tolérance de 2 centimes

  // Vérifier TTC = HT + TVA
  const ttcCalcule =
    (prestation.mntprestht || 0) + (prestation.mntpresttva || 0);
  if (Math.abs((prestation.mntprestttc || 0) - ttcCalcule) > TOLERANCE) {
    errors.push(
      `${ligne}: Montant TTC (${prestation.mntprestttc?.toFixed(
        2
      )}) ≠ HT (${prestation.mntprestht?.toFixed(
        2
      )}) + TVA (${prestation.mntpresttva?.toFixed(2)})`
    );
  }

  // Vérifier Quantité × MntUnitaire ≈ MntPrestationTTC
  const montantCalcule = (prestation.qte || 0) * (prestation.mntunit || 0);
  if (Math.abs(montantCalcule - (prestation.mntprestttc || 0)) > TOLERANCE) {
    warnings.push(
      `${ligne}: Quantité (${
        prestation.qte
      }) × Montant unitaire (${prestation.mntunit?.toFixed(
        2
      )}) = ${montantCalcule.toFixed(
        2
      )} différent du montant TTC (${prestation.mntprestttc?.toFixed(2)})`
    );
  }

  // Vérifier que HT < TTC (sauf si TVA = 0)
  if (
    prestation.mntprestht >= prestation.mntprestttc &&
    prestation.mntpresttva > 0
  ) {
    errors.push(
      `${ligne}: Le montant HT ne peut pas être supérieur ou égal au montant TTC`
    );
  }

  // Vérifier que la TVA est cohérente (généralement entre 0% et 25%)
  if (prestation.mntprestht > 0) {
    const tauxTVA =
      ((prestation.mntpresttva || 0) / prestation.mntprestht) * 100;
    if (tauxTVA < 0 || tauxTVA > 25) {
      warnings.push(
        `${ligne}: Le taux de TVA calculé (${tauxTVA.toFixed(
          2
        )}%) semble incorrect`
      );
    }
  }

  return { errors, warnings };
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

/**
 * Valider tous les formulaires avant envoi
 */
export const validateAllFormulaires = (formulaires) => {
  const allErrors = [];
  const allWarnings = [];

  formulaires.forEach((formulaire, index) => {
    const validation = validateDemandePaiement(formulaire);

    if (validation.errors.length > 0) {
      allErrors.push({
        formIndex: index,
        errors: validation.errors,
      });
    }

    if (validation.warnings.length > 0) {
      allWarnings.push({
        formIndex: index,
        warnings: validation.warnings,
      });
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};

/**
 * Formater les erreurs pour affichage user-friendly
 */
export const formatValidationErrors = (validationResult) => {
  const allMessages = [];

  // Collecter toutes les erreurs
  if (validationResult.errors.length > 0) {
    validationResult.errors.forEach(({ formIndex, errors }) => {
      errors.forEach((error) => {
        allMessages.push({
          type: "error",
          formIndex: formIndex + 1,
          message: error,
        });
      });
    });
  }

  // Collecter tous les avertissements
  if (validationResult.warnings.length > 0) {
    validationResult.warnings.forEach(({ formIndex, warnings }) => {
      warnings.forEach((warning) => {
        allMessages.push({
          type: "warning",
          formIndex: formIndex + 1,
          message: warning,
        });
      });
    });
  }

  return allMessages;
};

/**
 * Afficher les erreurs une par une avec des messages user-friendly
 */
export const showValidationErrorsOneByOne = async (validationResult) => {
  const messages = formatValidationErrors(validationResult);

  if (messages.length === 0) {
    return true; // Pas d'erreurs
  }

  const errors = messages.filter((m) => m.type === "error");
  const warnings = messages.filter((m) => m.type === "warning");

  // Afficher les erreurs une par une
  if (errors.length > 0) {
    for (let i = 0; i < errors.length; i++) {
      const { formIndex, message } = errors[i];
      const isLast = i === errors.length - 1;

      const displayMessage = `❌ Erreur ${i + 1}/${
        errors.length
      }\n\nFormulaire ${formIndex}\n\n${message}`;

      if (isLast && warnings.length === 0) {
        alert(
          displayMessage +
            "\n\n⚠️ Veuillez corriger cette erreur avant de continuer."
        );
      } else {
        alert(displayMessage);
      }
    }
    return false; // Il y a des erreurs bloquantes
  }

  // Si pas d'erreurs, afficher les avertissements
  if (warnings.length > 0) {
    for (let i = 0; i < warnings.length; i++) {
      const { formIndex, message } = warnings[i];
      const isLast = i === warnings.length - 1;

      const displayMessage = `⚠️ Avertissement ${i + 1}/${
        warnings.length
      }\n\nFormulaire ${formIndex}\n\n${message}`;

      if (isLast) {
        const continuer = window.confirm(
          displayMessage +
            "\n\n❓ Voulez-vous continuer malgré cet avertissement ?"
        );
        return continuer;
      } else {
        alert(displayMessage);
      }
    }
  }

  return true;
};
