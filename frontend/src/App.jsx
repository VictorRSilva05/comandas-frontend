import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Container } from "@mui/material";
import Navbar from "./pages/Navbar";
import AppRoutes from "./routes/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* O ToastContainer é o componente que renderiza as notificações na tela */}
        <ToastContainer position="top-center" autoClose={3000} />
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <AppRoutes />
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
