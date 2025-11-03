const API_URL = process.env.REACT_APP_API_URL;

export const fetchIntervenants = async () => {
  try {
    const response = await fetch(`${API_URL}/intervenants/`);
    if (!response.ok) throw new Error("Erreur chargement intervenants");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const fetchIntervenantById = async (id) => {
  try {
    if (!id) throw new Error("ID intervenant manquant");
    const response = await fetch(`${API_URL}/intervenants/${id}`);
    if (!response.ok) throw new Error("Erreur chargement intervenant");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const createIntervenant = async (intervenantData) => {
  try {
    const response = await fetch(`${API_URL}/intervenants/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(intervenantData),
    });
    if (!response.ok) throw new Error("Erreur création intervenant");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const updateIntervenant = async (id, intervenantData) => {
  try {
    const response = await fetch(`${API_URL}/intervenants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(intervenantData),
    });
    if (!response.ok) throw new Error("Erreur mise à jour intervenant");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const deleteIntervenant = async (id) => {
  try {
    if (!id) throw new Error("ID intervenant manquant");
    const response = await fetch(`${API_URL}/intervenants/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur suppression intervenant");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
