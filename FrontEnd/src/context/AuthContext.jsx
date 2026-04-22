import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Axios instance with default configs
export const api = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/api/auth/register", { name, email, password });
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Could be a nicer spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
