import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiUserPlus, FiUsers, FiList } from "react-icons/fi";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { deleteUser, fetchUsers } from "../../services/userService";

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
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const handleAdd = () => navigate("/add-user");
  const handleEdit = (id) => {
    const user = users.find((u) => u.ID_Utilisateurs === id);
    console.log(user);

    navigate(`/edit-user/${id}`, { state: { user } });
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de cet utilisateur ?")) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.ID_Utilisateurs !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
      window.alert("La suppression a échoué. Veuillez réessayer.");
    }
  };

  return (
    <Container
      className="py-5"
      style={{ paddingTop: "4.5rem", paddingBottom: "4.5rem" }}
    >
      <h2
        className="mb-4 text-center fw-bold"
        style={{
          letterSpacing: "1px",
          borderBottom: "3px solid #3a7bd5ff",
          color: "#3a7bd5ff",
          paddingBottom: "6px",
        }}
      >
        Gestion des utilisateurs
      </h2>
      <Row className="justify-content-center">
        <Col xs={12} md={11} lg={12}>
          <Card style={cardStyle}>
            <div
              style={{ ...headerStyle, padding: "1.5rem 2rem" }}
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

            <Card.Body className="p-4 p-md-5">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light ">
                    <tr className="p-8">
                      <th style={{ width: 80, padding: " 15px" }}>ID</th>
                      <th style={{ padding: "15px" }}>Email</th>
                      <th style={{ padding: "15px" }}>Nom</th>
                      <th style={{ padding: "15px" }}>Prénom</th>
                      <th style={{ width: 120, padding: "15px" }}>
                        Modification
                      </th>
                      <th style={{ width: 120, padding: "15px" }}>
                        Suppression
                      </th>
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
                        <tr key={u.ID_Utilisateurs}>
                          <td style={{ padding: "1.5rem .5rem" }}>
                            <span className="badge bg-primary">
                              {u.ID_Utilisateurs}
                            </span>
                          </td>
                          <td
                            style={{ padding: "1.5rem .5rem" }}
                            className="text-break"
                          >
                            {u.adresseMail}
                          </td>
                          <td
                            style={{ padding: "1.5rem .5rem" }}
                            className="text-break"
                          >
                            {u.Nom}
                          </td>
                          <td
                            style={{ padding: "1.5rem .5rem" }}
                            className="text-break"
                          >
                            {u.Prenoms}
                          </td>

                          <td
                            className="text-center"
                            style={{ padding: "1.5rem .5rem" }}
                          >
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(u.ID_Utilisateurs)}
                              aria-label={`Modifier ${u.Nom} ${u.Prenoms}`}
                            >
                              <FiEdit />
                            </button>
                          </td>

                          <td
                            className="text-center"
                            style={{ padding: "1.5rem .5rem" }}
                          >
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(u.ID_Utilisateurs)}
                              aria-label={`Supprimer ${u.Nom} ${u.Prenoms}`}
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
