import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Toolbar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import {
    createFuncionario,
    updateFuncionario,
    getFuncionarioById,
    verificarCpfExistente
} from '../services/funcionarioService';
import './FuncionarioForm.css';

const FuncionarioForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const [mostrarSenha, setMostrarSenha] = useState(!id);

    const isReadOnly = opr === 'view';

    const title = opr === 'view'
        ? `Visualizar Funcionário: ${id}`
        : id ? `Editar Funcionário: ${id}` : 'Novo Funcionário';

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (id) {
            const fetchFuncionario = async () => {
                const data = await getFuncionarioById(id);
                reset(data);
            };
            fetchFuncionario();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            let retorno;
            // Remove máscara do telefone
            data.telefone = data.telefone.replace(/\D/g, '')
            console.log("Telefone enviado:", data.telefone);

            if (id && !data.senha) {
                delete data.senha;
            }

            if (id) {
                retorno = await updateFuncionario(id, data);
            } else {
                retorno = await createFuncionario(data);
            }

            if (!retorno || !retorno.id) {
                throw new Error(retorno.erro || "Erro ao salvar funcionário.");
            }

            toast.success(`Funcionário salvo com sucesso. ID: ${retorno.id}`, { position: "top-center" });
            navigate('/funcionarios');
        } catch (error) {
            toast.error(`Erro ao salvar funcionário: \n${error.message}`, { position: "top-center" });
        }
    };

    const grupos = [
        { label: 'Admin', value: 1 },
        { label: 'Gerente', value: 2 },
        { label: 'Funcionário', value: 3 }
    ];

    const verificarDuplicidadeCpf = async (cpfDigitado) => {
        try {
            const resultadoArray = await verificarCpfExistente(cpfDigitado);
            const resultado = resultadoArray?.[0];

            if (resultado?.id_funcionario && resultado.id_funcionario.toString() !== id?.toString()) {
                toast.warning('Este CPF já está cadastrado para outro funcionário.', {
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

                {opr === 'view' && (
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
                    inputProps={{ maxLength: 100 }}
                    {...register('nome', {
                        required: 'Nome é obrigatório',
                        maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                    })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
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

                {/* Matrícula */}
                <TextField
                    label="Matrícula"
                    fullWidth
                    margin="normal"
                    className="textfield"
                    inputProps={{ maxLength: 10 }}
                    {...register('matricula', {
                        required: 'Matrícula é obrigatória',
                        maxLength: {
                            value: 10,
                            message: 'Matrícula deve ter no máximo 10 caracteres',
                        },
                    })}
                    error={!!errors.matricula}
                    helperText={errors.matricula?.message}
                    disabled={isReadOnly}
                />

                {/* Telefone */}
                <Controller
                    name="telefone"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Telefone é obrigatório',
                        validate: (value) => {
                            const digits = value.replace(/\D/g, '');
                            if (digits.length < 10 || digits.length > 11) {
                                return 'Telefone deve ter entre 10 e 11 dígitos';
                            }
                            return true;
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Telefone"
                            fullWidth
                            margin="normal"
                            className="textfield"
                            disabled={isReadOnly}
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
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

                {/* Alterar Senha */}
                {id && !isReadOnly && (
                    <FormControl component="fieldset" margin="normal">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setMostrarSenha((prev) => !prev)}
                        >
                            {mostrarSenha ? "Cancelar alteração de senha" : "Alterar senha"}
                        </Button>
                    </FormControl>
                )}

                {/* Senha */}
                {(!id || mostrarSenha) && (
                    <TextField
                        label="Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        className="textfield"
                        inputProps={{ maxLength: 200 }}
                        {...register('senha', {
                            required: !id ? 'Senha é obrigatória' : false,
                            minLength: {
                                value: 6,
                                message: 'Senha deve ter pelo menos 6 caracteres',
                            },
                            maxLength: {
                                value: 200,
                                message: 'Senha muito longa',
                            },
                        })}
                        error={!!errors.senha}
                        helperText={
                            errors.senha?.message ||
                            (id && 'Preencha somente se quiser alterar a senha.')
                        }
                        disabled={isReadOnly}
                    />
                )}

                {/* Grupo */}
                <Controller
                    name="grupo"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Grupo é obrigatório' }}
                    render={({ field }) => (
                        <FormControl fullWidth margin="normal" className="select-group">
                            <InputLabel id="grupo-label">Grupo</InputLabel>
                            <Select
                                labelId="grupo-label"
                                label="Grupo"
                                value={field.value || ""}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                disabled={isReadOnly}
                            >
                                {grupos.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />

                {/* Botões */}
                <Box className="buttons-container">
                    <Button className="cancel-button" onClick={() => navigate('/funcionarios')}>
                        Cancelar
                    </Button>
                    {opr !== 'view' && (
                        <Button type="submit" variant="contained">
                            {id ? "Atualizar" : "Cadastrar"}
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default FuncionarioForm;