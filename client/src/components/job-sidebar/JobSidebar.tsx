import { X, CheckCircle2, Terminal, Box } from 'lucide-react';
import { useGraphStore } from '../../store/graphStore';

const JobSidebar = () => {
  const { selectedNode, setSelectedNode } = useGraphStore();

  if (!selectedNode) return null;

  const jobDetails = selectedNode.data.details;
  const steps = jobDetails?.steps || [];

  return (
    <div className="absolute bottom-0 right-0 top-0 z-20 w-80 transform border-l border-light-border bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col">
      <div className="flex items-center justify-between border-b border-light-border bg-light-panel px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <h3 className="font-bold text-light-text truncate">{selectedNode.data.label}</h3>
        </div>
        <button 
          onClick={() => setSelectedNode(null)}
          className="rounded-lg p-1 text-light-text-muted hover:bg-light-hover hover:text-light-text transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-light-text-muted">
            Environment
          </h4>
          <div className="inline-flex items-center gap-2 rounded-lg border border-light-border bg-light-bg px-3 py-1.5 text-sm font-medium text-light-text-secondary">
            {jobDetails?.['runs-on'] || 'N/A'}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-light-text-muted">
            Execution Steps ({steps.length})
          </h4>
          <div className="relative border-l-2 border-light-border ml-2 space-y-4 pb-4">
            {steps.map((step: any, idx: number) => (
              <div key={idx} className="relative pl-6">
       
                <div className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                  <CheckCircle2 size={16} className="text-accent" />
                </div>
                
                <div className="rounded-lg border border-light-border bg-light-bg p-3 shadow-sm hover:border-accent/50 transition-colors">
                  <div className="font-semibold text-sm text-light-text mb-1">
                    {step.name || `Step ${idx + 1}`}
                  </div>
                  
                  {step.uses && (
                    <div className="flex items-center gap-1.5 text-xs text-light-text-secondary">
                      <Box size={12} className="text-accent" />
                      <span className="font-mono bg-light-hover px-1 rounded">{step.uses}</span>
                    </div>
                  )}
                  
                  {step.run && (
                    <div className="mt-2 flex items-start gap-1.5 rounded-md bg-slate-900 p-2 text-xs font-mono text-green-400">
                      <Terminal size={12} className="mt-0.5 shrink-0 text-slate-500" />
                      <span className="break-all">{step.run}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {steps.length === 0 && (
              <p className="pl-6 text-sm text-light-text-muted italic">Кроків не знайдено</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSidebar;