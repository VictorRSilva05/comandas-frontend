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
import './FuncionarioForm.css';
import IMaskInputWrapper from '../components/IMaskInputWrapper';

const FuncionarioForm = () => {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Dados do funcionário:", data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="form-container">
            <Box className="card">
                <Toolbar
                    sx={{
                        backgroundColor: "transparent",
                        padding: 1,
                        borderRadius: 2,
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="h6" className="title">
                        Dados Funcionário
                    </Typography>
                </Toolbar>
                <Box>
                    <TextField
                        label="Nome" fullWidth margin="normal"
                        className="textfield"
                        {...register('nome', { required: 'Nome é obrigatório' })}
                        error={!!errors.nome}
                        helperText={errors.nome?.message}
                    />

                    {/* CPF com máscara */}
                    <Controller
                        name="cpf"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'CPF é obrigatório' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="CPF"
                                fullWidth
                                margin="normal"
                                className="textfield"
                                error={!!errors.cpf}
                                helperText={errors.cpf?.message}
                                InputProps={{
                                    inputComponent: IMaskInputWrapper,
                                    inputProps: {
                                        mask: "000.000.000-00",
                                        definitions: {
                                            "0": /[0-9]/,
                                        },
                                        unmask: true,
                                    },
                                }}
                            />
                        )}
                    />

                    <TextField
                        label="Matrícula" fullWidth margin="normal"
                        className="textfield"
                        {...register('matricula', { required: 'Matrícula é obrigatória' })}
                        error={!!errors.matricula}
                        helperText={errors.matricula?.message}
                    />
                    {/* Telefone com máscara */}
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
                                InputProps={{
                                    inputComponent: IMaskInputWrapper,
                                    inputProps: {
                                        mask: [
                                            '(00) 0000-0000',
                                            '(00) 00000-0000'
                                        ],
                                        dispatch: function (appended, dynamicMasked) {
                                            const number = (dynamicMasked.value + appended).replace(/\D/g, '');
                                            return dynamicMasked.compiledMasks[number.length > 10 ? 1 : 0];
                                        }
                                    },
                                }}
                            />
                        )}
                    />
                    <TextField
                        label="Senha" type="password" fullWidth margin="normal"
                        className="textfield"
                        {...register('senha', {
                            required: 'Senha é obrigatória',
                            minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                        })}
                        error={!!errors.senha}
                        helperText={errors.senha?.message}
                    />
                    <FormControl fullWidth margin="normal" className="select-group">
                        <InputLabel id="grupo-label">Grupo</InputLabel>
                        <Select
                            labelId="grupo-label"
                            label="Grupo"
                            {...register('grupo')}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="gerente">Gerente</MenuItem>
                            <MenuItem value="funcionario">Funcionário</MenuItem>
                        </Select>
                    </FormControl>

                    <Box className="buttons-container">
                        <Button className="cancel-button">
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained">
                            Cadastrar
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default FuncionarioForm;
