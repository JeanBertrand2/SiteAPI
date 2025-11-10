import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiUserPlus, FiUsers, FiList } from "react-icons/fi";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const cardStyle = {
  borderRadius: 14,
  border: "none",
  boxShadow: "0 8px 30px rgba(20, 20, 50, 0.08)",
  overflow: "hidden",
};

const headerStyle = {
  background: "#3a7bd5ff",
  color: "white",
  padding: "1rem 1.25rem",
};

const ListeUtilisateurs = () => {
  const navigate = useNavigate();

  const initialUsers = [
    {
      id: 1,
      email: "jean.dupont@example.com",
      nom: "Dupont",
      prenoms: "Jean",
      login: "jdupont",
    },
    {
      id: 2,
      email: "marie.durand@example.com",
      nom: "Durand",
      prenoms: "Marie",
      login: "mdurand",
    },
    {
      id: 3,
      email: "paul.martin@example.com",
      nom: "Martin",
      prenoms: "Paul",
      login: "pmartin",
    },
  ];

  const [users, setUsers] = useState(initialUsers);

  const handleAdd = () => navigate("/add-user");
  const handleEdit = (id) => {
    const user = users.find((u) => u.id === id);
    navigate(`/edit-user/${id}`, { state: { user } });
  };
  const handleDelete = (id) => {
    if (!window.confirm("Confirmer la suppression de cet utilisateur ?"))
      return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <Container className="py-5">
      <h2
        className="mb-4 text-center fw-bold"
        style={{
          textTransform: "uppercase",
          letterSpacing: "1px",
          borderBottom: "3px solid #3a7bd5ff",
          color: "#3a7bd5ff",
          display: "inline-block",
          paddingBottom: "6px",
        }}
      >
        Gestion des utilisateurs
      </h2>
      <Row className="justify-content-center">
        <Col xs={12} md={11} lg={10}>
          <Card style={cardStyle}>
            <div
              style={headerStyle}
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center">
                <FiUsers style={{ fontSize: 22, marginRight: 10 }} />
                <div>
                  <h5 className="mb-0">Liste des utilisateurs</h5>
                  <small className="opacity-85">
                    Gérez vos utilisateurs depuis cette interface
                  </small>
                </div>
              </div>

              <div>
                <Button
                  variant="light"
                  size="sm"
                  onClick={handleAdd}
                  className="d-flex align-items-center"
                >
                  <FiUserPlus style={{ marginRight: 8 }} />
                  Ajouter utilisateur
                </Button>
              </div>
            </div>

            <Card.Body className="p-3 p-md-4">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 80 }}>ID</th>
                      <th>Email</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th style={{ width: 120 }}>Modification</th>
                      <th style={{ width: 120 }}>Suppression</th>
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
                          <td>{u.prenoms}</td>

                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(u.id)}
                              aria-label={`Modifier ${u.nom} ${u.prenoms}`}
                            >
                              <FiEdit />
                            </button>
                          </td>

                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(u.id)}
                              aria-label={`Supprimer ${u.nom} ${u.prenoms}`}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ListeUtilisateurs;
