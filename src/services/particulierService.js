const API_URL =
  import.meta?.env?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || "";

// Posts the json to the URSSAF proxy endpoint. Returns the URSSAF response (expected to contain idClient on success).
export const postToUrssaf = async (data) => {
  try {
    const res = await fetch(`${API_URL}/api/urssaf/particulier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `URSSAF returned ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error posting to URSSAF:", error);
    throw error;
  }
};

export const createParticulier = async (data) => {
  try {
    const res = await fetch(`${API_URL}/particuliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Backend returned ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error creating Particulier in backend:", error);
    throw error;
  }
};
