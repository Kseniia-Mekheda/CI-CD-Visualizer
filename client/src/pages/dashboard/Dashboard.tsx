import { useEffect } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { useAuthStore } from '../../store/authStore';
import { Plus, FileText, ChevronRight, LogOut } from 'lucide-react';
import GraphVisualizer from '../../components/graph-canvas/GraphVisualizer';
import JobSidebar from '../../components/job-sidebar/JobSidebar';
import UploadFile from '../../components/upload-file/UploadFile';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const { nodes, history, fetchHistory, clearGraph, setGraph } = useGraphStore();

    useEffect(() => {
        fetchHistory();
    }, []);

    const loadHistoryItem = (item: any) => {
        clearGraph();
        const graph = JSON.parse(item.analysis_result)
        setGraph(graph.nodes, graph.edges);
    };

    return (
        <div className="flex h-screen w-full bg-light-bg font-sans overflow-hidden">
            <aside className="w-72 flex flex-col border-r border-light-border bg-light-panel">
                <div className="p-6 border-b border-light-border">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold">V</div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-dark">
                            Visualizer
                        </span>
                    </div>
                    <button
                        onClick={clearGraph}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-bold text-white shadow-md hover:bg-accent-dark transition-colors"
                    >
                        <Plus size={18} /> Новий пайплайн
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-light-text-muted px-2">
                        Історія
                    </h3>
                    <div className="space-y-1">
                        {history.length > 0 ? history.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => loadHistoryItem(item)}
                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-light-text-secondary hover:bg-light-hover hover:text-light-text transition-colors"
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <FileText size={16} className="text-light-text-muted shrink-0" />
                                    <span className="truncate">{item.name}</span>
                                </div>
                                <ChevronRight size={14} className="text-light-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        )) : (
                            <div className="px-2 py-4 text-center text-sm text-light-text-muted italic">
                                У вас ще немає збережених файлів.
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-light-border p-4 bg-white/50">
                    <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-light-border">
                        <div className="flex flex-col truncate pr-2">
                            <span className="text-[10px] uppercase font-bold text-light-text-muted">Акаунт</span>
                            <span className="text-sm font-semibold text-light-text truncate">{user?.email}</span>
                        </div>
                        <button 
                            onClick={logout}
                            className="rounded-lg p-2 text-light-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Вийти"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 relative flex flex-col bg-white">
                {nodes.length > 0 ? (
                    <div className="flex-1 relative">
                        <GraphVisualizer />
                        <JobSidebar />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
                        <div className="w-full max-w-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-extrabold text-light-text mb-3">Робочий простір</h2>
                                <p className="text-light-text-secondary">Завантажте новий конфігураційний файл, щоб почати візуалізацію.</p>
                            </div>
                            <UploadFile />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
};

export default Dashboard;