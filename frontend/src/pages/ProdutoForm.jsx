import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import { createProduto, updateProduto, getProdutoById } from '../services/produtoService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import './ProdutoForm.css';

const ProdutoForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isReadOnly = opr === 'view';

    let title;
    if (opr === 'view') title = `Visualizar Produto: ${id}`;
    else if (id) title = `Editar Produto: ${id}`;
    else title = "Novo Produto";

    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 100,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);
                setFoto(compressedFile);
                const previewUrl = URL.createObjectURL(compressedFile);
                setFotoPreview(previewUrl);
            } catch (error) {
                console.error("Erro ao redimensionar a imagem:", error);
                toast.error("Erro ao redimensionar a imagem.");
            }
        } else {
            setFoto(null);
            setFotoPreview(null);
        }
    };

    useEffect(() => {
        if (id) {
            getProdutoById(id)
                .then((produto) => {
                    if (!produto) {
                        toast.error("Produto não encontrado.");
                        return;
                    }
    
                    // Resetando campos do formulário
                    reset({
                        nome: produto.nome || '',
                        descricao: produto.descricao || '',
                        valor_unitario: produto.valor_unitario || ''
                    });
    
                    // Tratamento da imagem
                    if (produto.foto) {
                        const isBase64 = typeof produto.foto === 'string' && produto.foto.startsWith('data:image/');
                        const preview = isBase64
                            ? produto.foto
                            : `data:image/jpeg;base64,${produto.foto.replace(/^data:image\/[a-z]+;base64,/, '')}`;
                        setFoto(produto.foto);
                        setFotoPreview(preview);
                    }
                })
                .catch((error) => {
                    console.error("Erro ao buscar produto:", error);
                    toast.error("Erro ao carregar produto.", { position: "top-center" });
                });
        }
    }, [id, reset]);
    
    

    const onSubmit = async (data) => {
        try {
            if (!foto && id) {
                const produto = await getProdutoById(id);
                data.foto = produto?.foto || null;
            } else if (foto) {
                data.foto = foto;
            }

            let retorno;
            if (id) {
                retorno = await updateProduto(id, data);
            } else {
                retorno = await createProduto(data);
            }

            if (!retorno?.id) {
                throw new Error(retorno?.erro || "Erro ao salvar produto.");
            }

            toast.success(`Produto salvo com sucesso. ID: ${retorno.id}`, { position: "top-center" });
            navigate('/produtos');
        } catch (error) {
            toast.error(`Erro ao salvar produto: \n${error.message}`, { position: "top-center" });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="form-container">
            <Box className="card">
                <Toolbar className="toolbar">
                    <Typography variant="h6" className="title">{title}</Typography>
                </Toolbar>

                {opr === 'view' && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}

                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Nome é obrigatório", maxLength: 100 }}
                    render={({ field }) => (
                        <TextField {...field}
                            disabled={isReadOnly}
                            label="Nome"
                            fullWidth
                            margin="normal"
                            className="textfield"
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                        />
                    )}
                />

                <Controller
                    name="descricao"
                    control={control}
                    defaultValue=""
                    rules={{ maxLength: 200 }}
                    render={({ field }) => (
                        <TextField {...field}
                            disabled={isReadOnly}
                            label="Descrição"
                            fullWidth
                            margin="normal"
                            className="textfield"
                            multiline
                            rows={3}
                        />
                    )}
                />

                <Controller
                    name="valor_unitario"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Valor é obrigatório" }}
                    render={({ field }) => (
                        <TextField {...field}
                            type="number"
                            label="Valor Unitário (R$)"
                            fullWidth
                            margin="normal"
                            className="textfield"
                            inputProps={{ step: "0.01", min: "0" }}
                            disabled={isReadOnly}
                            error={!!errors.valor_unitario}
                            helperText={errors.valor_unitario?.message}
                        />
                    )}
                />

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom color='primary'>Foto do Produto:</Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isReadOnly}
                        style={{ marginTop: '8px' }}
                    />
                </Box>

                {fotoPreview && typeof fotoPreview === 'string' && fotoPreview.startsWith('data:image/') && (
                    <Box sx={{ mt: 2 }}>
                        <img
                            src={fotoPreview}
                            alt="Pré-visualização"
                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                        />
                    </Box>
                )}

                <Box className="buttons-container">
                    <Button className="cancel-button" onClick={() => navigate('/produtos')}>Cancelar</Button>
                    {opr !== 'view' && (
                        <Button type="submit" variant="contained">Cadastrar</Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ProdutoForm;
