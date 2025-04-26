import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './LoginForm.css';
import { toast } from "react-toastify";

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (data) => {
        const sucesso = await login(data.usuario, data.senha);
        if (sucesso) {
            // Exibe notificação de sucesso
            toast.success("Login realizado com sucesso!");
            navigate("/home");
        } else {
            // Exibe notificação de erro
            toast.error("Usuário ou senha inválidos!");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <h2 className="login-title">Login</h2>

                <div className="form-group">
                    <label className="label">Usuário</label>
                    <input
                        {...register("usuario", { required: "Usuário é obrigatório" })}
                        className="input"
                    />
                    {errors.usuario && <p className="error">{errors.usuario.message}</p>}
                </div>

                <div className="form-group">
                    <label className="label">Senha</label>
                    <input
                        type="password"
                        {...register("senha", {
                            required: "Senha é obrigatória",
                            minLength: { value: 6, message: "Senha deve ter pelo menos 6 caracteres" },
                        })}
                        className="input"
                    />
                    {errors.senha && <p className="error">{errors.senha.message}</p>}
                </div>

                <button type="submit" className="submit-btn">Entrar</button>
            </form>
        </div>
    );
};

export default LoginForm;
