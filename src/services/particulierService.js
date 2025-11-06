const API_URL = import.meta?.env?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || '';

export const handlePostParticulier = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/urssaf/particulier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de l'appel au backend");
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi du particulier:", error);
    throw error;
  }
};
