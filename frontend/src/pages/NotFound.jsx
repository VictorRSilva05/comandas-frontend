import React from "react";
import { Box, Typography, Toolbar } from "@mui/material";

const NotFound = () => {
    return (
        <Box sx={{ backgroundColor: '#1e293b', padding: 1, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#1e293b', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary" sx={{ color: '#1976d2' }}>404 - NotFound</Typography>
            </Toolbar>
            <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 2, borderRadius: 3, mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
                    Página não encontrada. Verifique a URL ou retorne à página inicial.
                </Typography>
            </Box>
        </Box>
    );
};

export default NotFound;
