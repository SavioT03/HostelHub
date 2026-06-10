import { createContext, useContext, useState, useEffect } from "react";
import { SavedProvider } from "./SavedContext";

const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData) return null;
  if (userData._id) return userData;
  const { id, ...rest } = userData;
  return { _id: id, ...rest };
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const normalized = normalizeUser(JSON.parse(storedUser));
      localStorage.setItem("user", JSON.stringify(normalized));
      setUser(normalized);
    }
    setLoading(false);
  }, []);

  const loginWithData = (userData, token) => {
    const normalized = normalizeUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithData, logout }}>
      <SavedProvider>
        {children}
      </SavedProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);