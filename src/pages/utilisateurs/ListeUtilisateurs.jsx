import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiUserPlus } from "react-icons/fi";

const ListeUtilisateurs = () => {
  const navigate = useNavigate();

  const initialUsers = [
    { id: 1, email: "jean.dupont@example.com", nom: "Dupont", prenom: "Jean" },
    {
      id: 2,
      email: "marie.durand@example.com",
      nom: "Durand",
      prenom: "Marie",
    },
    { id: 3, email: "paul.martin@example.com", nom: "Martin", prenom: "Paul" },
  ];

  const [users, setUsers] = useState(initialUsers);

  const handleAdd = () => navigate("/add-user");
  const handleEdit = (id) => navigate(`/edit-user/${id}`);
  const handleDelete = (id) => {
    if (!window.confirm("Confirmer la suppression de cet utilisateur ?"))
      return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div
      className="container my-5 d-flex flex-column align-items-center "
      style={{ minHeight: "100vh", paddingTop: "4rem" }}
    >
      <h1 className="mb-4">Gestion des utilisateurs</h1>
      <div
        className="card shadow-sm mt-4"
        style={{ width: "900px", maxWidth: "95%" }}
      >
        <div className="card-header d-flex align-items-center justify-content-between">
          <h2 className="mb-0 p-2">Liste des utilisateurs</h2>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={handleAdd}
          >
            <FiUserPlus style={{ marginRight: 8 }} /> Ajouter utilisateur
          </button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "80px" }}>ID</th>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th style={{ width: "120px" }}>Modification</th>
                  <th style={{ width: "120px" }}>Suppression</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Aucun utilisateur
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <span className="badge bg-primary">{u.id}</span>
                      </td>
                      <td className="text-break">{u.email}</td>
                      <td>{u.nom}</td>
                      <td>{u.prenom}</td>

                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(u.id)}
                          aria-label={`Modifier ${u.nom} ${u.prenom}`}
                        >
                          <FiEdit />
                        </button>
                      </td>

                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(u.id)}
                          aria-label={`Supprimer ${u.nom} ${u.prenom}`}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeUtilisateurs;
