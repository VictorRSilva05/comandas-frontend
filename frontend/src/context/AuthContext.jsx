import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// Criação do contexto
const AuthContext = createContext();
// Provedor do contexto
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("loginRealizado") === "true";
    });

    const login = (username, password) => {
        if (username === "abc" && password === "bolinhas") {
            setIsAuthenticated(true);
            sessionStorage.setItem("loginRealizado", "true");
            return true; // Agora retorna sucesso
        } else {
            return false; // Agora retorna erro
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("loginRealizado");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);