import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    Toolbar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    createCliente,
    updateCliente,
    getClienteById,
    verificarCpfExistente
} from '../services/clienteService';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import './ClienteForm.css';

const ClienteForm = () => {
    const { id, opr } = useParams(); // usa "opr" como no FuncionarioForm
    const navigate = useNavigate();

    const isReadOnly = opr === 'view';

    const title = isReadOnly
        ? `Visualizar Cliente: ${id}`
        : id ? `Editar Cliente: ${id}` : 'Novo Cliente';

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (id) {
          getClienteById(id).then((cliente) => {
            reset(cliente);
          }).catch((error) => {
            console.error('Erro ao buscar cliente:', error);
            toast.error('Erro ao buscar cliente.', { position: 'top-center' });
          });
        }
      }, [id, reset]);
      
    
    const onSubmit = async (data) => {
        try {
            data.telefone = data.telefone?.replace(/\D/g, '');
            data.cpf = data.cpf?.replace(/\D/g, '');
            console.log(data)

            let retorno;
            if (id) {
                retorno = await updateCliente(id, data);
            } else {
                retorno = await createCliente(data);
            }

            toast.success('Cliente salvo com sucesso!', { position: 'top-center' });
            navigate('/clientes');
        } catch (err) {
            console.error('Erro ao salvar cliente:', err);
            toast.error('Erro ao salvar cliente.', { position: 'top-center' });
        }
    };

    const verificarDuplicidadeCpf = async (cpfDigitado) => {
        try {
            const resultadoArray = await verificarCpfExistente(cpfDigitado);
            const resultado = resultadoArray?.[0];

            if (resultado?.id_cliente && resultado.id_cliente.toString() !== id?.toString()) {
                toast.warning('Este CPF já está cadastrado para outro cliente.', {
                    position: 'top-center',
                    autoClose: 5000
                });
                reset((prev) => ({ ...prev, cpf: '' }));
            }
        } catch (error) {
            console.error('Erro ao verificar CPF:', error);
            toast.error('Erro ao verificar CPF. Tente novamente.', { position: 'top-center' });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="form-container">
            <Box className="card">
                <Toolbar sx={{
                    backgroundColor: "transparent",
                    padding: 1,
                    borderRadius: 2,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <Typography variant="h6" className="title">
                        {title}
                    </Typography>
                </Toolbar>

                {isReadOnly && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}

                {/* Nome */}
                <TextField
                    label="Nome"
                    fullWidth
                    margin="normal"
                    className="textfield"
                    {...register('nome', { required: 'Nome é obrigatório' })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                    inputProps={{ maxLength: 100 }}
                    disabled={isReadOnly}
                />

                {/* CPF */}
                <Controller
                    name="cpf"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'CPF é obrigatório',
                        minLength: {
                            value: 11,
                            message: 'CPF deve conter 11 dígitos',
                        },
                        maxLength: {
                            value: 11,
                            message: 'CPF deve conter 11 dígitos',
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="CPF"
                            fullWidth
                            margin="normal"
                            className="textfield"
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                            disabled={isReadOnly}
                            onBlur={async (e) => {
                                field.onBlur();
                                if (!isReadOnly && e.target.value) {
                                    const cpfSemMascara = e.target.value.replace(/\D/g, '');
                                    await verificarDuplicidadeCpf(cpfSemMascara);
                                }
                            }}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "000.000.000-00",
                                    definitions: { "0": /\d/ },
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />

                {/* Telefone */}
                <Controller
                    name="telefone"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Telefone"
                            fullWidth
                            margin="normal"
                            className="textfield"
                            disabled={isReadOnly}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: ['(00) 0000-0000', '(00) 00000-0000'],
                                    dispatch: function (appended, dynamicMasked) {
                                        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
                                        return dynamicMasked.compiledMasks[number.length > 10 ? 1 : 0];
                                    }
                                }
                            }}
                        />
                    )}
                />

                {/* Botões */}
                <Box className="buttons-container">
                    <Button className="cancel-button" onClick={() => navigate('/clientes')}>
                        Cancelar
                    </Button>
                    {!isReadOnly && (
                        <Button type="submit" variant="contained">
                            {id ? "Atualizar" : "Cadastrar"}
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ClienteForm;
