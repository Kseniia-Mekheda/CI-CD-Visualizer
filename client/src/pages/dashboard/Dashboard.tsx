import { useEffect, useState } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { useAuthStore } from '../../store/authStore';
import { Plus, FileText, ChevronRight, LogOut, Waypoints, LayoutTemplate, Code2, Trash2 } from 'lucide-react';
import CodeEditor from '../../components/code-editor/CodeEditor';
import GraphVisualizer from '../../components/graph-canvas/GraphVisualizer';
import JobSidebar from '../../components/job-sidebar/JobSidebar';
import UploadFile from '../../components/upload-file/UploadFile';
import Modal from '../../components/modal/Modal';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../../components/lang-toggle/langToggle';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const { nodes, history, fetchHistory, clearGraph, loadHistoryItem, deleteHistoryItem } =
    useGraphStore();
  const [chosenItemId, setChosenItemId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'code'>('graph');

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleLoadHistoryItem = async (itemId: string) => {
    await loadHistoryItem(itemId);
    setChosenItemId(itemId);
  };

  const handleDeleteHistoryItem = async (itemId: string) => {
    try {
      await deleteHistoryItem(itemId);
      if (chosenItemId === itemId) {
        setChosenItemId(null);
      }
    } catch {
      /* logged in store */
    }
  };

  const confirmDeleteHistoryItem = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    await handleDeleteHistoryItem(id);
  };

  return (
    <div className="flex h-screen w-full bg-light-bg font-sans overflow-hidden">
      <aside className="w-72 flex flex-col border-r border-light-border bg-light-panel">
        <div className="p-6 border-b border-light-border">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold">
              <Waypoints size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-dark">
              Pipely
            </span>
            <LanguageToggle />
          </div>
          <button
            onClick={clearGraph}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-bold text-white shadow-md hover:bg-accent-dark transition-colors"
          >
            <Plus size={18} /> {t('ui.dashboardPage.uploadBtn')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-light-text-muted px-2">
            {t('ui.dashboardPage.historyTitle')}
          </h3>
          <div className="space-y-1">
            {history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className={`group flex w-full items-center gap-1 rounded-lg ${item.id === chosenItemId ? 'bg-accent-light' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => handleLoadHistoryItem(item.id)}
                    className="flex min-w-0 flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-light-text-secondary hover:bg-light-hover hover:text-light-text transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <FileText
                        size={16}
                        className="text-light-text-muted shrink-0"
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-light-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteId(item.id);
                    }}
                    className="shrink-0 rounded-lg p-2 text-light-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                    title={t('ui.dashboardPage.deleteHistoryTitle')}
                    aria-label={t('ui.dashboardPage.deleteHistoryTitle')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="px-2 py-4 text-center text-sm text-light-text-muted italic">
                {t('ui.dashboardPage.emptyHistory')}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-light-border p-4 bg-white/50">
          <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-light-border">
            <div className="flex flex-col truncate pr-2">
              <span className="text-[10px] uppercase font-bold text-light-text-muted">
                {t('ui.dashboardPage.accountTitle')}
              </span>
              <span className="text-sm font-semibold text-light-text truncate">
                {user?.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-light-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
              title={t('ui.dashboardPage.logoutTitle')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col bg-white">
        {nodes.length > 0 ? (
          <div className="flex flex-col h-full relative">
          <div className="h-14 border-b border-light-border bg-white flex items-center px-4 justify-center shadow-sm z-20 shrink-0">
             <div className="flex items-center bg-light-panel p-1 rounded-xl border border-light-border">
               <button
                 onClick={() => setViewMode('graph')}
                 className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${viewMode === 'graph' ? 'bg-white shadow-sm text-accent' : 'text-light-text-muted hover:text-light-text'}`}
               >
                 <LayoutTemplate size={16} /> {t('ui.dashboardPage.graphViewBtn')}
               </button>
               <button
                 onClick={() => setViewMode('code')}
                 className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${viewMode === 'code' ? 'bg-white shadow-sm text-accent' : 'text-light-text-muted hover:text-light-text'}`}
               >
                 <Code2 size={16} /> {t('ui.dashboardPage.codeViewBtn')}
               </button>
             </div>
          </div>

          <div className="flex-1 relative w-full h-full overflow-hidden">
            {viewMode === 'graph' ? (
              <>
                <GraphVisualizer />
                <JobSidebar />
              </>
            ) : (
              <CodeEditor />
            )}
          </div>
          
        </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
            <div className="w-full max-w-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-light-text mb-3">
                  {t('ui.dashboardPage.title')}
                </h2>
                <p className="text-light-text-secondary">
                  {t('ui.dashboardPage.description')}
                </p>
              </div>
              <UploadFile />
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        title={t('ui.dashboardPage.deleteHistoryModalTitle')}
      >
        <p className="mb-8 text-base leading-relaxed text-light-text-secondary">
          {t('ui.dashboardPage.deleteHistoryModalMessage')}
        </p>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={confirmDeleteHistoryItem}
            className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-white shadow-md hover:bg-accent-dark transition-colors"
          >
            {t('ui.dashboardPage.deleteHistoryConfirmBtn')}
          </button>
          <button
            type="button"
            onClick={() => setPendingDeleteId(null)}
            className="rounded-xl border border-light-border bg-white px-5 py-2.5 font-semibold text-light-text-secondary hover:bg-light-hover transition-colors"
          >
            {t('ui.dashboardPage.deleteHistoryCancelBtn')}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
