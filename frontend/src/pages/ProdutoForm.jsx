import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import './ProdutoForm.css'; 

const ProdutoForm = () => {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Dados do produto:", data);
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
                        Dados Produto
                    </Typography>
                </Toolbar>

                <Box>
                    <TextField
                        label="Nome do Produto"
                        fullWidth
                        margin="normal"
                        className="textfield"
                        {...register('nome', { required: 'Nome é obrigatório' })}
                        error={!!errors.nome}
                        helperText={errors.nome?.message}
                    />

                    <TextField
                        label="Descrição"
                        fullWidth
                        margin="normal"
                        className="textfield"
                        multiline
                        rows={3}
                        {...register('descricao')}
                    />

                    <TextField
                        label="Valor Unitário (R$)"
                        fullWidth
                        margin="normal"
                        className="textfield"
                        type="number"
                        inputProps={{ step: "0.01", min: "0" }}
                        {...register('valor_unitario', { 
                            required: 'Valor unitário é obrigatório',
                            valueAsNumber: true
                        })}
                        error={!!errors.valor_unitario}
                        helperText={errors.valor_unitario?.message}
                    />

                    <Controller
                        name="foto"
                        control={control}
                        defaultValue={null}
                        render={({ field: { onChange, ...rest } }) => (
                            <TextField
                                type="file"
                                fullWidth
                                margin="normal"
                                className="textfield"
                                inputProps={{ accept: "image/*" }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            const base64 = reader.result.split(',')[1];
                                            onChange(base64); 
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                {...rest}
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

export default ProdutoForm;
