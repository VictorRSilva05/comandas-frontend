import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Toolbar } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './ClienteList.css';

function ClienteList() {
    const navigate = useNavigate();

    return (
        <div className="table-container">
            <div className="card">
                <Toolbar className="toolbar">
                    <Typography variant="h6" className="title">Clientes</Typography>
                    <Button className="new-button" onClick={() => navigate('/cliente')} startIcon={<FiberNew />}>
                        Novo
                    </Button>
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-header-cell">ID</TableCell>
                            <TableCell className="table-header-cell">Nome</TableCell>
                            <TableCell className="table-header-cell">CPF</TableCell>
                            <TableCell className="table-header-cell">Telefone</TableCell>
                            <TableCell className="table-header-cell">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell className="table-cell">1</TableCell>
                            <TableCell className="table-cell">Lucas Pinheiro de Oliveira</TableCell>
                            <TableCell className="table-cell">123.456.789-00</TableCell>
                            <TableCell className="table-cell">(49) 98765-4321</TableCell>
                            <TableCell>
                                <IconButton className="actions-button"><Visibility color="primary" /></IconButton>
                                <IconButton className="actions-button"><Edit color="secondary" /></IconButton>
                                <IconButton className="actions-button"><Delete color="error" /></IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default ClienteList;