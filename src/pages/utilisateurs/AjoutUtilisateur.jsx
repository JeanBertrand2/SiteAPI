import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiUser,
  FiUsers,
  FiMail,
  FiLock,
  FiList,
  FiCheck,
  FiEdit,
} from "react-icons/fi";

const cardStyle = {
  borderRadius: 14,
  border: "none",
  boxShadow: "0 8px 30px rgba(20, 20, 50, 0.08)",
  overflow: "hidden",
};

const headerStyle = {
  background: " rgba(58,123,213,1) ",
  color: "white",
  padding: "1.25rem 1.5rem",
};

const iconBg = {
  background: "transparent",
  border: "none",
  color: "#495057",
  fontSize: "1.05rem",
};

const AjoutUtilisateur = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userToEdit = location.state?.user;

  const [form, setForm] = useState({
    nom: "",
    prenoms: "",
    email: "",
    mdp: "",
    login: "",
  });

  useEffect(() => {
    if (userToEdit) setForm((prev) => ({ ...prev, ...userToEdit }));
  }, [userToEdit]);

  const handleViewList = () => {
    navigate("/liste-user");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      alert("Utilisateur modifié avec succès !");
      console.log("Updated:", form);
    } else {
      alert("Utilisateur ajouté avec succès !");
      console.log("New:", form);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={9} lg={7}>
          <Card style={cardStyle}>
            <div
              style={headerStyle}
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center">
                <FiUsers style={{ fontSize: 22, marginRight: 10 }} />
                <div>
                  <h5 className="mb-0">
                    {id ? "Modifier utilisateur" : "Créer un compte"}
                  </h5>
                  <small className="opacity-85">
                    Entrez les informations ci-dessous
                  </small>
                </div>
              </div>

              <div>
                <Button
                  variant="light"
                  size="sm"
                  onClick={handleViewList}
                  className="d-flex align-items-center"
                  title="Voir la liste des utilisateurs"
                >
                  <FiList style={{ marginRight: 6 }} />
                  Liste
                </Button>
              </div>
            </div>

            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="nom">
                      <Form.Label className="small text-muted">Nom</Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiUser />
                        </InputGroup.Text>
                        <Form.Control
                          name="nom"
                          value={form.nom}
                          onChange={handleChange}
                          placeholder="Entrez le nom"
                          aria-label="nom"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="prenoms">
                      <Form.Label className="small text-muted">
                        Prénoms
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiUser />
                        </InputGroup.Text>
                        <Form.Control
                          name="prenoms"
                          value={form.prenoms}
                          onChange={handleChange}
                          placeholder="Entrez les prénoms"
                          aria-label="prenoms"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="email" className="mt-2">
                      <Form.Label className="small text-muted">
                        Adresse email
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiMail />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="adresse@mail.com"
                          aria-label="email"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="login" className="mt-2">
                      <Form.Label className="small text-muted">
                        Login
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiEdit />
                        </InputGroup.Text>
                        <Form.Control
                          name="login"
                          value={form.login}
                          onChange={handleChange}
                          placeholder="Nom d'utilisateur"
                          aria-label="login"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="mdp" className="mt-2">
                      <Form.Label className="small text-muted">
                        Mot de passe
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiLock />
                        </InputGroup.Text>
                        <Form.Control
                          type="password"
                          name="mdp"
                          value={form.mdp}
                          onChange={handleChange}
                          placeholder="Mot de passe"
                          aria-label="mdp"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4 gap-2">
                  <Button variant="outline-secondary" onClick={handleViewList}>
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="d-flex align-items-center"
                  >
                    <FiCheck style={{ marginRight: 8 }} />
                    {id ? "Enregistrer" : "S'inscrire"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AjoutUtilisateur;
