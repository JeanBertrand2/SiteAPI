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
import { createUser, updateUser } from "../../services/userService";

const cardStyle = {
  borderRadius: 14,
  border: "none",
  boxShadow: "0 8px 30px rgba(20, 20, 50, 0.08)",
  overflow: "hidden",
};

const headerStyle = {
  background: " #3a7bd5ff ",
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
    Nom: "",
    Prenoms: "",
    adresseMail: "",
    MotDePasse: "",
    Login: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      const result = await updateUser(id, form);
      if (!result) {
        alert("Erreur lors de la modification de l'utilisateur.");
        return;
      }
      alert("Utilisateur modifié avec succès !");
    } else {
      const result = await createUser(form);
      if (!result) {
        alert("Erreur lors de l'ajout de l'utilisateur.");
        return;
      }
      alert("Utilisateur ajouté avec succès !");
    }
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
        {id ? "Modifier un utilisateur" : "Créer un utilisateur"}
      </h2>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={12}>
          <Card style={cardStyle}>
            <div
              style={headerStyle}
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center">
                <FiUsers style={{ fontSize: 22, marginRight: 10 }} />
                <div>
                  <h5 className="mb-0">{id ? "Modification" : "Création"}</h5>
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
                  Liste des utilisateur
                </Button>
              </div>
            </div>

            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="Nom">
                      <Form.Label className="small text-muted">Nom</Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiUser />
                        </InputGroup.Text>
                        <Form.Control
                          name="Nom"
                          value={form.Nom}
                          onChange={handleChange}
                          placeholder="Entrez le nom"
                          aria-label="Nom"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="Prenoms">
                      <Form.Label className="small text-muted">
                        Prénoms
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiUser />
                        </InputGroup.Text>
                        <Form.Control
                          name="Prenoms"
                          value={form.Prenoms}
                          onChange={handleChange}
                          placeholder="Entrez les prénoms"
                          aria-label="Prenoms"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="adresseMail" className="mt-2">
                      <Form.Label className="small text-muted">
                        Adresse email
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiMail />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="adresseMail"
                          value={form.adresseMail}
                          onChange={handleChange}
                          placeholder="adresse@mail.com"
                          aria-label="adresseMail"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="Login" className="mt-2">
                      <Form.Label className="small text-muted">
                        Login
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiEdit />
                        </InputGroup.Text>
                        <Form.Control
                          name="Login"
                          value={form.Login}
                          onChange={handleChange}
                          placeholder="Nom d'utilisateur"
                          aria-label="Login"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="MotDePasse" className="mt-2">
                      <Form.Label className="small text-muted">
                        Mot de passe
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text style={iconBg}>
                          <FiLock />
                        </InputGroup.Text>
                        <Form.Control
                          type="password"
                          name="MotDePasse"
                          value={form.MotDePasse}
                          onChange={handleChange}
                          placeholder="Mot de passe"
                          aria-label="MotDePasse"
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
