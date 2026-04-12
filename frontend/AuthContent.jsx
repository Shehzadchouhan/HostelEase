const API = "http://localhost:5000/api/auth";

const register = async (data) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};

const login = async (emailOrPhone, password) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emailOrPhone, password }),
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { success: false };
    }

    const res = await fetch(`${API}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch {
    return { success: false };
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

return { register, login, getProfile, logout };