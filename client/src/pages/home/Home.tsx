import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Upload, LogOut } from 'lucide-react';
import Modal from '../../components/modal/Modal';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';

export default function Home() {
  const { user, logout } = useAuthStore();
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
          <div className="text-2xl font-black text-purple-600 tracking-tight">CI/CD VISUALIZER</div>
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">{user.email}</span>
                <button 
                  onClick={logout} 
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Вийти
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setActiveModal('login')} 
                  className="text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors"
                >
                  Увійти
                </button>
                <button 
                  onClick={() => setActiveModal('register')} 
                  className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-purple-200 hover:bg-purple-700 transition-colors"
                >
                  Зареєструватися
                </button>
              </>
            )}
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold text-slate-900 leading-tight">
              Перетворіть ваші YAML у зрозумілі графи
            </h1>
            <p className="mb-10 text-lg text-slate-500">
              Завантажуйте конфігурації GitHub Actions та візуалізуйте залежності між Jobs та Steps в реальному часі.
            </p>
            
            <div className="group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 transition-all hover:border-purple-400 hover:bg-purple-50/30">
              <div className="mb-4 rounded-full bg-purple-100 p-4 text-purple-600 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <p className="mb-2 font-bold text-slate-700">Перетягніть файл сюди або натисніть</p>
              <p className="text-sm text-slate-400">Підтримуються .yaml та .yml</p>
              <input type="file" className="absolute inset-0 cursor-pointer opacity-0" />
            </div>
          </div>
        </main>
      </div>

      <Modal 
        isOpen={activeModal === 'login'} 
        onClose={() => setActiveModal(null)} 
        title="Вхід"
      >
        <LoginForm 
          onSuccess={() => setActiveModal(null)} 
          onSwitch={() => setActiveModal('register')} 
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'register'} 
        onClose={() => setActiveModal(null)} 
        title="Реєстрація"
      >
        <RegisterForm 
          onSwitch={() => setActiveModal('login')} 
        />
      </Modal>
    </>
  );
}