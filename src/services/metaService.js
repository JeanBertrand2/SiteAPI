const API_URL = process.env.REACT_APP_API_URL;

export const fetchMetaData = async () => {
  try {
    const res = await fetch(`${API_URL}/meta/all`);
    if (!res.ok) throw new Error("Erreur chargement meta");
    return await res.json();
  } catch (err) {
    console.error("Erreur dans fetchMetaData:", err);
    throw err;
  }
};
