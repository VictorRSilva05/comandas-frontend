import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL;

// Criação do contexto
const AuthContext = createContext();

// Provedor
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("loginRealizado") === "true";
    });

    const loginComUsuarioSenha = async (username, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post(
                PROXY_URL + "teste_token",
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            const { access_token, token_type, expire_minutes } = response.data;

            sessionStorage.setItem("token", access_token);
            sessionStorage.setItem("token_type", token_type);
            sessionStorage.setItem("token_expira_em", Date.now() + expire_minutes * 60000);
            sessionStorage.setItem("loginRealizado", "true");

            setIsAuthenticated(true);
            return { sucesso: true };
        } catch (error) {
            console.error("Erro no login local:", error);
            return { sucesso: false, mensagem: "Usuário ou senha inválidos (@)." };
        }
    };

    const loginComCpfSenha = async (cpf, senha) => {
        try {
            const response = await axios.post(PROXY_URL + "funcionario/login", {
                nome: "",
                matricula : "",
                cpf,
                telefone: "",
                grupo: 1,
                senha,
            });

            const funcionario = response.data;
            sessionStorage.setItem("funcionario", JSON.stringify(funcionario));
            sessionStorage.setItem("loginRealizado", "true");

            setIsAuthenticated(true);
            return { sucesso: true };
        } catch (error) {
            console.error("Erro no login por CPF:", error);
            const msg = error.response?.data?.erro || "CPF ou senha inválidos.";
            return { sucesso: false, mensagem: msg };
        }
    };

    const login = async (usuario, senha) => {
        if (usuario.startsWith("@")) {
            const resultado = await loginComUsuarioSenha(usuario.slice(1), senha);
            if (resultado.sucesso) {
                sessionStorage.setItem("tipoUsuario", "Administrador");
            }
            return resultado;
        } else {
            const resultado = await loginComCpfSenha(usuario, senha);
            if (resultado.sucesso) {
                sessionStorage.setItem("tipoUsuario", "Funcionario");
            }
            return resultado;
        }
    };

    // Logout
    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para consumo
export const useAuth = () => useContext(AuthContext);
