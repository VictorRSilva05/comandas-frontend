import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import './ClienteForm.css';

const ClienteForm = () => {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Dados do cliente:", data);
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
                        Dados Cliente
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
                                        definitions: { "0": /[0-9]/ },
                                        unmask: true,
                                    },
                                }}
                            />
                        )}
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

export default ClienteForm;