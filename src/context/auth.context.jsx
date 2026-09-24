import { createContext, useContext, useState, useEffect } from "react";
import userService from "../services/user.service";
import { getCompanies } from "../services/company.service";

const AuthContext = createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("authToken"));
  const [db, setDb] = useState(sessionStorage.getItem("db"));
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const storedDb = sessionStorage.getItem("db");
    if (storedToken) {
      setToken(storedToken);
      setDb(storedDb);
    }
  }, [token]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        console.log("Companies loaded:", data);
        setCompanies(data);
      } catch (error) {
        setCompaniesError("No se pudo cargar la lista de compañías. Intente recargar la página.");
      } finally {
        setCompaniesLoading(false);
      }
    };
    loadCompanies();
  }, []);

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
      value={{ user, db, token, companies, companiesLoading, companiesError, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
