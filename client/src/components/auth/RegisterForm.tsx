import { useForm } from 'react-hook-form';
import { useState, type ReactElement } from 'react';
import { api } from '../../api/axios';
import { ROUTES } from '../../constants/routes';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

type TFormProps = {
    onSwitch: () => void;
};

const RegisterForm = ({ onSwitch }: TFormProps) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    setError('');
    try {
      await api.post(ROUTES.REGISTER, {
        email: data.email,
        password: data.password,
      });
      onSwitch();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Помилка при реєстрації');
    }
  };

  const SocialButton = ({ icon, text }: { icon: ReactElement; text: string; }) => (
    <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-light-border bg-light-bg px-4 py-2.5 text-sm font-semibold text-light-text hover:bg-light-hover transition-colors">
      {icon}
      {text}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-light-text-secondary">Email</label>
        <input 
          {...register('email')}
          className="rounded-lg border border-light-border bg-light-panel p-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          placeholder="email@example.com"
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-light-text-secondary">Пароль</label>
        <div className="relative">
          <input 
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full rounded-lg border border-light-border bg-light-panel p-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            placeholder="Мінімум 6 символів"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-muted hover:text-light-text transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-light-text-secondary">Підтвердіть пароль</label>
        <input 
            type='password'
            {...register('confirm')}
            className="rounded-lg border border-light-border bg-light-panel p-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />
        {errors.confirm && <span className="text-xs text-red-500">{errors.confirm.message as string}</span>}
      </div>

    <button type="submit" className="flex items-center gap-2 rounded-lg bg-accent py-2 px-6 font-semibold text-white hover:bg-accent-dark transition-colors">
        Зареєструватися
        <span>→</span>
    </button>

      <div className="relative flex items-center py-3 mt-2">
        <div className="flex-grow border-t border-light-border"></div>
        <span className="flex-shrink px-3 text-xs text-light-text-muted uppercase tracking-wider font-semibold">Або зареєструватися через</span>
        <div className="flex-grow border-t border-light-border"></div>
      </div>

      <div className="flex items-center gap-3">
        <SocialButton 
            icon={<img src="https://www.google.com/images/branding/product/1x/gsa_android_64dp.png" alt="Google" className="h-5 w-5"/>} 
            text="Google"
        />
      </div>

      <p className="text-center text-sm text-light-text-secondary mt-2">
        Вже маєте акаунт?{' '}
        <button type="button" onClick={onSwitch} className="font-bold text-accent hover:underline">
          Увійти
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;