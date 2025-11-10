import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const AjoutUtilisateur = () => {
  const [form, setForm] = useState({
    nom: "",
    prenoms: "",
    email: "",
    mdp: "",
    login: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const initialForm = {
    nom: "",
    prenoms: "",
    email: "",
    mdp: "",
    login: "",
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Utilisateur ajouté avec succès !");
    setForm(initialForm);
    console.log(form);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Inscription</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="nom" className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Entrez le nom"
                  />
                </Form.Group>

                <Form.Group controlId="prenoms" className="mb-3">
                  <Form.Label>Prénoms</Form.Label>
                  <Form.Control
                    name="prenoms"
                    value={form.prenoms}
                    onChange={handleChange}
                    placeholder="Entrez les prénoms"
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Adresse email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="adresse@mail.com"
                  />
                </Form.Group>

                <Form.Group controlId="login" className="mb-3">
                  <Form.Label>Login</Form.Label>
                  <Form.Control
                    name="login"
                    value={form.login}
                    onChange={handleChange}
                    placeholder="Nom d'utilisateur"
                  />
                </Form.Group>

                <Form.Group controlId="mdp" className="mb-4">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="mdp"
                    value={form.mdp}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    S'inscrire
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
