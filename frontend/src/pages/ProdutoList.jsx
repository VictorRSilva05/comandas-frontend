import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Typography, Button, Toolbar, useMediaQuery
} from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { getProdutos, deleteProduto } from '../services/produtoService';
import { toast } from 'react-toastify';
import './ProdutoList.css';

function ProdutoList() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            const data = await getProdutos();
            setProdutos(data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handleDeleteClick = (produto) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o produto <strong>{produto.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteConfirm(produto.id_produto)}
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
                closeButton: false,
            }
        );
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await deleteProduto(id);
            fetchProdutos();
            toast.dismiss();
            toast.success('Produto excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            toast.error('Erro ao excluir produto.', { position: "top-center" });
        }
    };

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

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="table-header-cell">ID</TableCell>
                                <TableCell className="table-header-cell">Nome</TableCell>
                                <TableCell className="table-header-cell">Valor</TableCell>
                                {!isSmallScreen && (
                                    <>
                                        <TableCell className="table-header-cell">Foto</TableCell>
                                        <TableCell className="table-header-cell">Descrição</TableCell>
                                    </>
                                )}
                                <TableCell className="table-header-cell">Ações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {produtos.map((produto) => (
                                <TableRow key={produto.id_produto}>
                                    <TableCell className="table-cell">{produto.id_produto}</TableCell>
                                    <TableCell className="table-cell">{produto.nome}</TableCell>
                                    <TableCell className="table-cell">R$ {produto.valor_unitario.toFixed(2)}</TableCell>
                                    {!isSmallScreen && (
                                        <>
                                            <TableCell>
                                                {produto.foto ? (
                                                    <img
                                                        src={produto.foto}
                                                        alt={produto.nome}
                                                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Sem imagem
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell className="table-cell">{produto.descricao}</TableCell>
                                        </>
                                    )}
                                    <TableCell>
                                        <IconButton className="actions-button" onClick={() => navigate(`/produto/view/${produto.id_produto}`)}>
                                            <Visibility color="primary" />
                                        </IconButton>
                                        <IconButton className="actions-button" onClick={() => navigate(`/produto/edit/${produto.id_produto}`)}>
                                            <Edit color="secondary" />
                                        </IconButton>
                                        <IconButton className="actions-button" onClick={() => handleDeleteClick(produto)}>
                                            <Delete color="error" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default ProdutoList;
