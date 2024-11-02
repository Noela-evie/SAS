import { createContext, useContext, useState, useReducer, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MaterialUI = createContext();

// Initial state for AuthContext
const initialState = {
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
  register: () => {},
};

// Creating AuthContext
export const AuthContext = createContext(initialState);

// AuthContextProvider to manage and provide authentication state
const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Check authentication status on initial render and update state accordingly
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      navigate(location.pathname);
    }
  }, []);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(isAuthenticated);
      navigate(location.pathname);
    }
  }, [isAuthenticated]);

  const login = async (loginData) => {
    try {
      const response = await axios.post('/login', loginData);
      const data = response.data;
      const { token, role, id } = data; 
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id); 
      setRole(role);
      setIsAuthenticated(true);
      console.log("Login successful. Redirecting to dashboard...");
      navigate("/dashboard");
      return data;
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Logout function to clear token, role, and reset authentication status
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

  // Register function for initial registration (sets role as "patient" by default)
  const register = async (registerData) => {
  try {
    const response = await axios.post('/register', registerData);
    const token = response.data;
    const role = "patient";
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setRole(role);
    setIsAuthenticated(true);
    console.log("Registration successful. Redirecting to dashboard...");
    navigate("/dashboard");
  } catch (error) {
    console.error("Registration error:", error);
  }
};

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    isAuthenticated,
    role,
    login,
    logout,
    register,
  }), [isAuthenticated, role]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Prop validation
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// useAuth custom hook to access the AuthContext values, including role for conditional rendering
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth should be used inside the AuthContextProvider."
    );
  }

  const { role, isAuthenticated, login, logout, register } = context;
  
  return {
    role,
    isAuthenticated,
    login,
    logout,
    register,
  };
};

export default AuthContextProvider;


// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

// Material Dashboard 2 React reducer
function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      return { ...state, transparentSidenav: action.value };
    }
    case "WHITE_SIDENAV": {
      return { ...state, whiteSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "DIRECTION": {
      return { ...state, direction: action.value };
    }
    case "LAYOUT": {
      return { ...state, layout: action.value };
    }
    case "DARKMODE": {
      return { ...state, darkMode: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Material Dashboard 2 React context provider
function MaterialUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    sidenavColor: "info",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) => dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

export {
  AuthContextProvider,
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};

