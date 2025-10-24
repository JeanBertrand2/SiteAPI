import React from 'react';
import PaiementFichier from '../paiement/PaiementFichier';


function BddFacture() {
  return (
    <div>
      
      <PaiementFichier showDemandeBtn={false} showMigrationBtn={true} />
    </div>
  );
}

export default BddFacture;
