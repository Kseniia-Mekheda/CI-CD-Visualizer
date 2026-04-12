import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { api } from '../../api/axios';
import { ROUTES } from '../../constants/routes';
import { useAuthStore } from '../../store/authStore';

interface LoginFormProps {
    onSuccess: () => void;
    onSwitchToRegister: () => void;
};

const LoginForm = ({onSuccess, onSwitchToRegister}: LoginFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [error, setError] = useState<string>('');
    const login = useAuthStore((state) => state.login);

    const onSubmit = async (data: any) => {
        setError('');
        try {
            await api.post(ROUTES.LOGIN, {
                email: data.email,
                password: data.password,
            });

            await login();
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.detail || 'Невірні дані для входу');
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}

            <div className='flex flex-col gap-1'>
                <label className='text-sm font-medium text-slate-700'>Email</label>
                <input 
                    {...register('email', { required: 'Введіть Email'})}
                    className='rounded-lg border border-slate-300 p-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Пароль</label>
                <input 
                type="password"
                {...register('password', { required: 'Введіть пароль' })}
                className="rounded-lg border border-slate-300 p-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
            </div>

            <button className="mt-2 rounded-lg bg-purple-600 py-2.5 font-semibold text-white hover:bg-purple-700 transition-colors">
                Увійти
            </button>

            <p className="text-center text-sm text-slate-500">
                Немає акаунту?{' '}
                <button type="button" onClick={onSwitchToRegister} className="font-bold text-purple-600 hover:underline">
                    Зареєструватися
                </button>
            </p>
        </form>
    )
};

export default LoginForm;