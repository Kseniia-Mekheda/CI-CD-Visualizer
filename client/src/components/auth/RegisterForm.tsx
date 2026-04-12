import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../../api/axios';
import { ROUTES } from '../../constants/routes';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const inputClass =
  'peer h-14 w-full rounded-md border border-slate-300 bg-white px-3 pb-2.5 pt-5 text-slate-900 outline-none transition placeholder:text-transparent focus:border-sky-400 focus:ring-1 focus:ring-sky-400';

const labelClass =
  'pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 bg-white px-1 text-slate-500 transition-all peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs';

const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    setError('');
    try {
      await api.post(ROUTES.REGISTER, {
        email: data.email,
        password: data.password,
      });
      onSwitchToLogin();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || 'Помилка при реєстрації');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-left">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[26px]">
        Приєднуйтесь безкоштовно!
      </h2>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="relative">
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder=" "
          className={inputClass}
          {...register('email', { required: 'Введіть email' })}
        />
        <label htmlFor="register-email" className={labelClass}>
          Email
        </label>
        {errors.email && (
          <span className="mt-1 block text-xs text-red-500">{errors.email.message as string}</span>
        )}
      </div>

      <div className="relative">
        <input
          id="register-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder=" "
          className={`${inputClass} pr-11`}
          {...register('password', { required: 'Введіть пароль', minLength: 6 })}
        />
        <label htmlFor="register-password" className={labelClass}>
          Пароль
        </label>
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="relative">
        <input
          id="register-confirm"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder=" "
          className={`${inputClass} pr-11`}
          {...register('confirm', {
            validate: (val) => watch('password') === val || 'Паролі не співпадають',
          })}
        />
        <label htmlFor="register-confirm" className={labelClass}>
          Підтвердіть пароль
        </label>
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          onClick={() => setShowConfirm((v) => !v)}
          aria-label={showConfirm ? 'Приховати пароль' : 'Показати пароль'}
        >
          {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.confirm && (
          <span className="mt-1 block text-xs text-red-500">{errors.confirm.message as string}</span>
        )}
      </div>

      <button
        type="submit"
        className="mt-1 w-full rounded-md bg-slate-800 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition hover:bg-slate-900"
      >
        Створити акаунт
      </button>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="shrink-0 text-xs text-slate-400">або продовжити</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <p className="text-center text-sm text-slate-500">
        Вже є акаунт?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-slate-900 underline-offset-2 hover:underline"
        >
          Увійти
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
