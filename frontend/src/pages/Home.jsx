import React from "react";
import { Box, Typography } from "@mui/material";
import './Home.css';

const Home = () => {
    return (
        <Box className="home-container">
            <Box className="card">
                <Typography variant="h5" className="title">
                    Home
                </Typography>
                <Typography variant="body1" className="subtitle">
                    Bem-vindo ao aplicativo Comandas!
                </Typography>
                <Typography variant="body2" className="description">
                    Explore as funcionalidades e aproveite sua experiência.
                </Typography>
                <Typography variant="caption" className="date">
                    {`Data atual: ${new Date().toLocaleDateString()}`}
                </Typography>
            </Box>
        </Box>
    );
};

export default Home;