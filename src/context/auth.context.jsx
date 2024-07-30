import { createContext, useContext, useState, useEffect } from "react";
import userService from "../services/user.service";
// Crear el contexto
const AuthContext = createContext();

// Crear un hook para usar el contexto
const useAuth = () => {
  return useContext(AuthContext);
};

// Crear el proveedor del contexto
// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("authToken"));
  const [db, setDb] = useState(sessionStorage.getItem("db"));

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const storedDb = sessionStorage.getItem("db");
    if (storedToken) {
      setToken(storedToken);
      setDb(storedDb);
    }
  }, [token]);

  const login = async (userData) => {
    try {
      const authToken = await userService.login(userData);
      setUser(userData);
      setToken(authToken);
      sessionStorage.setItem("authToken", authToken);
      sessionStorage.setItem("db", userData.company);
    } catch (error) {
      throw new Error(`Error al intentar loguear: ${error.message}`);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setDb(null);
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("db");
    window.location.href = "/login";
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{ user, db, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
