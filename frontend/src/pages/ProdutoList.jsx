import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Typography, Button, Box, useMediaQuery
} from '@mui/material';
import { Edit, Delete, Visibility, FiberNew, PictureAsPdf } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { getProdutos, deleteProduto } from '../services/produtoService';
import { toast } from 'react-toastify';
import './ProdutoList.css';
import { gerarRelatorioPDF } from '../utils/pdfReport';

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

    const handleExportPDF = () => {
        const colunas = ['ID', 'Nome', 'Valor', 'Descrição'];
        const dados = produtos.map(p => ({
            ID: p.id_produto,
            Nome: p.nome,
            Valor: `R$ ${p.valor_unitario.toFixed(2)}`,
            Descrição: p.descricao || '-',
            foto: p.foto || null
        }));
        gerarRelatorioPDF({
            titulo: 'Relatório de Produtos',
            colunas,
            dados,
            incluirImagem: true
        });
    };

    return (
        <div className="table-container">
            <div className="card">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Produtos</Typography>
                    <Box display="flex" gap={1}>
                        <Button className="pdf-button" onClick={handleExportPDF} startIcon={<PictureAsPdf />}>
                            Exportar PDF
                        </Button>
                        <Button
                            onClick={() => navigate('/produto')}
                            startIcon={<FiberNew />}
                            variant="contained"
                        >
                            Novo
                        </Button>
                    </Box>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Valor</TableCell>
                                {!isSmallScreen && (
                                    <>
                                        <TableCell>Foto</TableCell>
                                        <TableCell>Descrição</TableCell>
                                    </>
                                )}
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {produtos.map((produto) => (
                                <TableRow key={produto.id_produto}>
                                    <TableCell>{produto.id_produto}</TableCell>
                                    <TableCell>{produto.nome}</TableCell>
                                    <TableCell>R$ {produto.valor_unitario.toFixed(2)}</TableCell>
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
                                            <TableCell>{produto.descricao}</TableCell>
                                        </>
                                    )}
                                    <TableCell>
                                        <IconButton onClick={() => navigate(`/produto/view/${produto.id_produto}`)}>
                                            <Visibility color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => navigate(`/produto/edit/${produto.id_produto}`)}>
                                            <Edit color="secondary" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(produto)}>
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
