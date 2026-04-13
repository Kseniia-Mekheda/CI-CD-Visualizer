import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, ArrowLeft } from 'lucide-react';
import Modal from '../../components/modal/Modal';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import UploadFile from '../../components/upload-file/UploadFile';
import GraphVisualizer from '../../components/graph-canvas/GraphVisualizer';
import { useGraphStore } from '../../store/graphStore';
import JobSidebar from '../../components/job-sidebar/JobSidebar';

export default function Home() {
  const { user, logout } = useAuthStore();
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);
  const { nodes, clearGraph } = useGraphStore();

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

        <main className="flex-1 flex flex-col w-full relative">
          {nodes.length > 0 ? (
            <div className="absolute inset-0 flex flex-col">
              <div className="h-12 border-b border-light-border bg-white flex items-center px-4 justify-between z-10 shadow-sm">
                 <button 
                   onClick={clearGraph}
                   className="flex items-center gap-2 text-sm font-medium text-light-text-secondary hover:text-accent transition-colors"
                 >
                   <ArrowLeft size={16} /> Завантажити інший файл
                 </button>
                 {!user && (
                    <span className="text-xs text-light-text-muted">
                      Увійдіть, щоб зберігати історію конфігурацій
                    </span>
                 )}
              </div>
              
              <div className="flex-1 w-full relative">
                <GraphVisualizer />
                <JobSidebar />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
              <div className="max-w-3xl text-center">
                <h1 className="mb-6 text-5xl font-extrabold text-light-text leading-tight">
                  Перетворіть ваші YAML у зрозумілі графи
                </h1>
                <p className="mb-10 text-lg text-light-text-secondary">
                  Завантажуйте конфігурації GitHub Actions та візуалізуйте залежності між Jobs та Steps в реальному часі.
                </p>
                
                <UploadFile />
              </div>
            </div>
          )}
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