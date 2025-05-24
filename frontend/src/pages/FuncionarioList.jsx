import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Typography, Button, Toolbar, useMediaQuery
} from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getFuncionarios, deleteFuncionario } from '../services/funcionarioService';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import './FuncionarioList.css';

function FuncionarioList() {
    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState([]);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const fetchFuncionarios = async () => {
        try {
            const data = await getFuncionarios();
            setFuncionarios(data);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    const handleDeleteClick = (funcionario) => {
        toast(
            <div>
                <Typography>
                    Tem certeza que deseja excluir o funcionário <strong>{funcionario.nome}</strong>?
                </Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(funcionario.id_funcionario)}
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

    const handleDeleteConfirm = async (id) => {
        try {
            await deleteFuncionario(id);
            fetchFuncionarios();
            toast.dismiss();
            toast.success('Funcionário excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar funcionário:', error);
            toast.error('Erro ao excluir funcionário.', { position: "top-center" });
        }
    };

    return (
        <div className="table-container">
            <div className="card">
                <Toolbar className="toolbar">
                    <Typography variant="h6" className="title">Funcionários</Typography>
                    <Button className="new-button" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />}>
                        Novo
                    </Button>
                </Toolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-header-cell">ID</TableCell>
                            <TableCell className="table-header-cell">Nome</TableCell>
                            <TableCell className="table-header-cell">CPF</TableCell>
                            {!isSmallScreen && <TableCell className="table-header-cell">Matrícula</TableCell>}
                            <TableCell className="table-header-cell">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {funcionarios.map((funcionario) => (
                            <TableRow key={funcionario.id_funcionario}>
                                <TableCell className="table-cell">{funcionario.id_funcionario}</TableCell>
                                <TableCell className="table-cell">{funcionario.nome}</TableCell>
                                <TableCell className="table-cell">{funcionario.cpf}</TableCell>
                                {!isSmallScreen && (
                                    <TableCell className="table-cell">{funcionario.matricula}</TableCell>
                                )}
                                <TableCell>
                                    <IconButton className="actions-button"
                                        onClick={() => navigate(`/funcionario/view/${funcionario.id_funcionario}`)}
                                    >
                                        <Visibility color="primary" />
                                    </IconButton>
                                    <IconButton className="actions-button"
                                        onClick={() => navigate(`/funcionario/edit/${funcionario.id_funcionario}`)}
                                    >
                                        <Edit color="secondary" />
                                    </IconButton>
                                    <IconButton className="actions-button"
                                        onClick={() => handleDeleteClick(funcionario)}
                                    >
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

export default FuncionarioList;
 