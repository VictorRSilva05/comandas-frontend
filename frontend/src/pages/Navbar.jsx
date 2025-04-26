import React from "react";
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1
                    className="navbar-title"
                    onClick={() => navigate('/home')}
                >
                    Comandas
                </h1>
                {isAuthenticated && (
                    <div className="navbar-links">
                        <button onClick={() => navigate('/home')} className="navbar-link">Home</button>
                        <button onClick={() => navigate('/funcionarios')} className="navbar-link">Funcionários</button>
                        <button onClick={() => navigate('/clientes')} className="navbar-link">Clientes</button>
                        <button onClick={() => navigate('/produtos')} className="navbar-link">Produtos</button>
                        <button onClick={handleLogout} className="navbar-link logout">Sair</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
