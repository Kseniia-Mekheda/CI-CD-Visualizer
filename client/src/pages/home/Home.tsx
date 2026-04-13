import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft } from 'lucide-react';
import Modal from '../../components/modal/Modal';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import UploadFile from '../../components/upload-file/UploadFile';
import GraphVisualizer from '../../components/graph-canvas/GraphVisualizer';
import { useGraphStore } from '../../store/graphStore';
import JobSidebar from '../../components/job-sidebar/JobSidebar';
import Header from '../../components/header/Header';

export default function Home() {
  const { user } = useAuthStore();
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(
    null,
  );
  const { nodes, clearGraph } = useGraphStore();

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gradient-to-r from-indigo-50 to-purple-50">
        <Header setActiveModal={setActiveModal} />

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
                  Завантажуйте конфігурації GitHub Actions та візуалізуйте
                  залежності між Jobs та Steps в реальному часі.
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
        <RegisterForm onSwitch={() => setActiveModal('login')} />
      </Modal>
    </>
  );
}
