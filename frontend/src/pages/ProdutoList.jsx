import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Toolbar } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './ProdutoList.css';

function ProdutoList() {
    const navigate = useNavigate();

    return (
        <div className="table-container">
            <div className="card">
                <Toolbar className="toolbar">
                    <Typography variant="h6" className="title">Produtos</Typography>
                    <Button
                        className="new-button"
                        onClick={() => navigate('/produto')}
                        startIcon={<FiberNew />}
                    >
                        Novo
                    </Button>
                </Toolbar>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-header-cell">ID</TableCell>
                            <TableCell className="table-header-cell">Nome</TableCell>
                            <TableCell className="table-header-cell">Valor Unitário</TableCell>
                            <TableCell className="table-header-cell">Ações</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* Exemplo de Produto */}
                        <TableRow key={1}>
                            <TableCell className="table-cell">1</TableCell>
                            <TableCell className="table-cell">Produto Exemplo</TableCell>
                            <TableCell className="table-cell">R$ 99,90</TableCell>
                            <TableCell>
                                <IconButton className="actions-button">
                                    <Visibility color="primary" />
                                </IconButton>
                                <IconButton className="actions-button">
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton className="actions-button">
                                    <Delete color="error" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default ProdutoList;
