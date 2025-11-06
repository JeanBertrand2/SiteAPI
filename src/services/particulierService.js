const API_URL = process.env.VITE_URSSAF;

export const handlePostParticulier = async (data) => {
  try {
    const response = await fetch(API_URL, {
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
