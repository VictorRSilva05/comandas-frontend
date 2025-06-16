import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, IconButton, Typography, Button, Toolbar, useMediaQuery
} from '@mui/material';
import { Edit, Delete, Visibility, FiberNew, PictureAsPdf } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getClientes, deleteCliente } from '../../src/services/clienteService';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import './ClienteList.css';
import { gerarRelatorioPDF } from '../utils/pdfReport';

function ClienteList() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const data = await getClientes();
            setClientes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            setClientes([]);
        }
    };

    const handleDeleteClick = (cliente) => {
        toast(
            <div>
                <Typography>
                    Tem certeza que deseja excluir o cliente <strong>{cliente.nome}</strong>?
                </Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(cliente.id_cliente)}
                        style={{ marginRight: '10px' }}
                    >
                        Excluir
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false
            }
        );
    };

    const handleDeleteConfirm = async (id_cliente) => {
        try {
            await deleteCliente(id_cliente);
            fetchClientes();
            toast.dismiss();
            toast.success('Cliente excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            toast.error('Erro ao excluir cliente.', { position: "top-center" });
        }
    };

    const handleExportarPDF = () => {
        const colunas = ['ID', 'Nome', 'CPF', 'Telefone'];

        const dados = clientes.map(c => ({
            ID: c.id_cliente,
            Nome: c.nome,
            CPF: c.cpf,
            Telefone: c.telefone,
            foto: c.foto || null
        }));

        gerarRelatorioPDF({
            titulo: "Relatório de Clientes",
            colunas,
            dados,
            incluirImagem: true
        });
    };

    return (
        <div className="table-container">
            <div className="card">
                <Toolbar className="toolbar">
                    <Typography variant="h6" className="title">Clientes</Typography>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button className="pdf-button" onClick={handleExportarPDF} startIcon={<PictureAsPdf />}>
                            Exportar PDF
                        </Button>
                        <Button className="new-button" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />}>
                            Novo
                        </Button>
                    </div>
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-header-cell">ID</TableCell>
                            <TableCell className="table-header-cell">Nome</TableCell>
                            <TableCell className="table-header-cell">CPF</TableCell>
                            {!isSmallScreen && (
                                <TableCell className="table-header-cell">Telefone</TableCell>
                            )}
                            <TableCell className="table-header-cell">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map((cliente) => (
                            <TableRow key={cliente.id_cliente}>
                                <TableCell className="table-cell">{cliente.id_cliente}</TableCell>
                                <TableCell className="table-cell">{cliente.nome}</TableCell>
                                <TableCell className="table-cell">{cliente.cpf}</TableCell>
                                {!isSmallScreen && (
                                    <TableCell className="table-cell">{cliente.telefone}</TableCell>
                                )}
                                <TableCell>
                                    <IconButton className="actions-button"
                                        onClick={() => navigate(`/cliente/view/${cliente.id_cliente}?view=true`)}>
                                        <Visibility color="primary" />
                                    </IconButton>
                                    <IconButton className="actions-button"
                                        onClick={() => navigate(`/cliente/edit/${cliente.id_cliente}`)}>
                                        <Edit color="secondary" />
                                    </IconButton>
                                    <IconButton className="actions-button"
                                        onClick={() => handleDeleteClick(cliente)}>
                                        <Delete color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default ClienteList;
