const API_URL =
  import.meta?.env?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || "";

export const updateUser = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/utilisateurs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Backend returned ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error updating user in backend:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await fetch(`${API_URL}/utilisateurs/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Backend returned ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error deleting user in backend:", error);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/utilisateurs`, {
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
    console.error("Error creating user in backend:", error);
    throw error;
  }
};
export const fetchUserById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/utilisateurs/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Backend returned ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching user by ID from backend:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/utilisateurs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Backend returned ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching users from backend:", error);
    throw error;
  }
};
