import React from 'react'

const PaiementManuel =()=> {
  return (
    <div className="pManuel-page">
      <div className="pManuel-header">
        <h1 className="pManuel-title">DEMANDE DE PAIEMENT</h1>
     <div>
        <input
            type="text"
            placeholder="id client"
            value=""
            onChange={(e) => setName(e.target.value)}
            required
        />
     </div>
        
      </div>
    </div>
  )
}

export default PaiementManuel
