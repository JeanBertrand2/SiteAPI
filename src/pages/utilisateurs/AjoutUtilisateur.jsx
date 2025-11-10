import { useEffect, useState, useMemo } from "react";
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
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { createUser, updateUser } from "../../services/userService";
import Confirmation from "../../components/Modal/Confirmation";
import { isValidEmail } from "../../utils/validationUtils";

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
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState({
    success: false,
    error: false,
    warning: false,
    emailError: false,
  });

  const emptyForm = {
    Nom: "",
    Prenoms: "",
    adresseMail: "",
    MotDePasse: "",
    Login: "",
  };

  const [form, setForm] = useState({ ...emptyForm });
  const [initialForm, setInitialForm] = useState({ ...emptyForm });

  useEffect(() => {
    if (userToEdit) {
      // set both form and initialForm to the user values so we can detect changes
      setForm((prev) => ({ ...prev, ...userToEdit }));
      setInitialForm((prev) => ({ ...prev, ...userToEdit }));
    } else {
      // ensure initialForm stays empty for "create" mode
      setForm({ ...emptyForm });
      setInitialForm({ ...emptyForm });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToEdit]);

  const handleViewList = () => {
    navigate("/liste-user");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => setShowPassword((s) => !s);

  // normalize helper: trim values and stringify for comparison
  const normalize = (obj) =>
    Object.keys(obj)
      .sort()
      .reduce((acc, k) => {
        acc[k] = (obj[k] ?? "").toString().trim();
        return acc;
      }, {});

  const isDisabled = useMemo(() => {
    const normForm = normalize(form);
    const normInitial = normalize(initialForm);

    const allEmpty = Object.values(normForm).every((v) => v === "");
    const unchanged = JSON.stringify(normForm) === JSON.stringify(normInitial);

    // disable if all fields empty OR form unchanged compared to initial
    return allEmpty || unchanged;
  }, [form, initialForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "Nom",
      "Prenoms",
      "adresseMail",
      "MotDePasse",
      "Login",
    ];

    if (form.adresseMail && !isValidEmail(form.adresseMail)) {
      setMessage("Adresse email invalide.");
      setTitle("Validation");
      setShowModal((prev) => ({ ...prev, emailError: true }));
      return false;
    }

    const missing = requiredFields.filter(
      (f) => !form[f] || form[f].toString().trim() === ""
    );

    if (missing.length > 0) {
      setMessage("Tous les champs sont requis, veuillez les remplir.");
      setTitle("Attention");
      setShowModal((prev) => ({ ...prev, warning: true }));
      return;
    }

    if (id) {
      try {
        const result = await updateUser(id, form);
        if (!result) {
          setMessage("Erreur lors de la modification de l'utilisateur.");
          setTitle("Erreur");
          setShowModal((prev) => ({ ...prev, error: true }));
          return;
        }
        setMessage("Utilisateur modifié avec succès !");
        setTitle("Succès");
        setShowModal((prev) => ({ ...prev, success: true }));
      } catch (error) {
        setMessage("Erreur lors de la modification de l'utilisateur.");
        setTitle("Erreur");
        setShowModal((prev) => ({ ...prev, error: true }));
      }
    } else {
      try {
        const result = await createUser(form);
        if (!result) {
          setMessage("Erreur lors de l'ajout de l'utilisateur.");
          setTitle("Erreur");
          setShowModal((prev) => ({ ...prev, error: true }));
          return;
        }
        setMessage("Utilisateur ajouté avec succès !");
        setTitle("Succès");
        setShowModal((prev) => ({ ...prev, success: true }));
      } catch (error) {
        setMessage("Erreur lors de l'ajout de l'utilisateur.");
        setTitle("Erreur");
        setShowModal((prev) => ({ ...prev, error: true }));
      }
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
                  Liste des utilisateurs
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
                          type="text"
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
                          type={showPassword ? "text" : "password"}
                          name="MotDePasse"
                          value={form.MotDePasse}
                          onChange={handleChange}
                          placeholder="Mot de passe"
                          aria-label="MotDePasse"
                        />
                        <InputGroup.Text
                          onClick={toggleShowPassword}
                          style={{
                            ...iconBg,
                            cursor: "pointer",
                            position: "relative",
                            zIndex: 1,
                            right: "3rem",
                          }}
                          title={
                            showPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </InputGroup.Text>
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
                    disabled={isDisabled}
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

      {showModal.success && (
        <Confirmation
          isOpen={showModal.success}
          title={title}
          message={message}
          onClose={() => {
            setShowModal((prev) => ({ ...prev, success: false }));
          }}
        />
      )}

      {showModal.error && (
        <Confirmation
          isOpen={showModal.error}
          title={title}
          message={message}
          onClose={() => {
            setShowModal((prev) => ({ ...prev, error: false }));
          }}
        />
      )}

      {showModal.warning && (
        <Confirmation
          isOpen={showModal.warning}
          title={title}
          message={message}
          onClose={() => {
            setShowModal((prev) => ({ ...prev, warning: false }));
          }}
        />
      )}
      {showModal.emailError && (
        <Confirmation
          isOpen={showModal.emailError}
          title={title}
          message={message}
          onClose={() => {
            setShowModal((prev) => ({ ...prev, emailError: false }));
          }}
        />
      )}
    </Container>
  );
};

export default AjoutUtilisateur;
