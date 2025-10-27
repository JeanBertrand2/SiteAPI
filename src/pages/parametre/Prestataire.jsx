import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Prestataire = () => {
  const [activeTab, setActiveTab] = useState('prestataire');

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">

        
        <div className="text-center mb-4">
          <h1 className="text-center mb-4 fw-semibold text-primary">Fiche Prestataire </h1>
        </div>


        <div className="card-header bg-white border-bottom-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'prestataire' ? 'active' : ''}`}
                onClick={() => setActiveTab('prestataire')}
              >
                Prestataire
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'urssaf' ? 'active' : ''}`}
                onClick={() => setActiveTab('urssaf')}
              >
                Paramètres URSSAF
              </button>
            </li>
          </ul>
        </div>




        <div className="card-body">
          {activeTab === 'prestataire' && (
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-danger fw-semibold">Raison sociale</label>
                <input type="text" className="form-control border-danger" defaultValue="TANA SERVICE" />
              </div>
              <div className="col-md-6">
                <label className="form-label">SIRET</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-12">
                <label className="form-label">Adresse</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tél</label>
                <input type="text" className="form-control"  inputMode="numeric"  pattern="[0-9]*" placeholder="Ex: 0321234567"/>
              </div>
              <div className="col-md-6">
                <label className="form-label">Mail</label>
                <input type="email" className="form-control" placeholder="exemple@domaine.com" />
              </div>
              <div className="col-md-6">
                <label className="form-label text-danger fw-semibold">Identifiant SAP</label>
                <input type="text" className="form-control border-danger" defaultValue="SAP800771792" />
              </div>
              <div className="col-md-6">
                <label className="form-label text-danger fw-semibold">Identifiant API</label>
                <input type="text" className="form-control border-danger" defaultValue="80077179200028" />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          )}

          {activeTab === 'urssaf' && (
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Code URSSAF</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Régime</label>
                <select className="form-select">
                  <option>Auto-entrepreneur</option>
                  <option>Indépendant</option>
                  <option>Société</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Commentaire</label>
                <textarea className="form-control" rows="3"></textarea>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prestataire;
