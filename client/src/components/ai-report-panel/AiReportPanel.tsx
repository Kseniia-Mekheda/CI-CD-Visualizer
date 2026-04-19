import { useState } from 'react';
import { useGraphStore } from '../../store/graphStore';
import {
  Sparkles,
  ShieldAlert,
  Zap,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const AiReportPanel = () => {
  const { aiReport, isAnalyzing, analyzePipeline } = useGraphStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!aiReport && !isAnalyzing) {
    return (
      <button
        onClick={analyzePipeline}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-bold text-white shadow-lg transition-transform hover:scale-105"
      >
        <Sparkles size={18} /> Проаналізувати з AI
      </button>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3 rounded-xl bg-white p-4 shadow-xl border border-light-border">
        <Sparkles className="animate-spin text-purple-600" size={20} />
        <span className="font-semibold text-light-text text-sm">
          AI аналізує архітектуру...
        </span>
      </div>
    );
  }

  const getSeverityStyle = (severity: string, category: string) => {
    if (severity === 'Висока') return 'bg-red-50 text-red-600 border-red-200';
    if (category === 'Продуктивність')
      return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    return 'bg-green-50 text-green-600 border-green-200';
  };

  const getIcon = (category: string) => {
    if (category === 'Безпека') return <ShieldAlert size={16} />;
    if (category === 'Продуктивність') return <Zap size={16} />;
    return <CheckCircle size={16} />;
  };

  if (isCollapsed) {
    return (
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-white py-2 pl-3 pr-2 shadow-lg border border-light-border">
        <Sparkles className="shrink-0 text-purple-600" size={18} />
        <div className="min-w-0 pr-1">
          <p className="text-xs font-bold text-light-text leading-tight">
            AI аудит
          </p>
          <p
            className={`text-[11px] font-semibold tabular-nums ${aiReport.score > 80 ? 'text-green-600' : 'text-amber-600'}`}
          >
            {aiReport.score}/100
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="shrink-0 rounded-lg p-1.5 text-light-text-secondary transition-colors hover:bg-indigo-50 hover:text-purple-700"
          aria-expanded={false}
          aria-label="Розгорнути панель AI-звіту"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 w-96 max-h-[80vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-light-border overflow-hidden animate-in slide-in-from-right-4 duration-300">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-light-border flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600 shrink-0" size={20} />
            <h3 className="font-bold text-light-text text-lg">AI аудит</h3>
          </div>
          <p className="text-xs text-light-text-secondary mt-1">
            {aiReport.summary}
          </p>
        </div>
        <div className="flex shrink-0 items-start gap-1">
          <div className="flex flex-col items-end pl-1">
            <span className="text-[10px] uppercase font-bold text-light-text-muted">
              Індекс здоров'я
            </span>
            <span
              className={`text-2xl font-black ${aiReport.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}
            >
              {aiReport.score}/100
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="rounded-lg p-1.5 text-light-text-muted transition-colors hover:bg-white/60 hover:text-light-text"
            aria-expanded={true}
            aria-label="Згорнути панель AI-звіту"
          >
            <ChevronUp size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {aiReport.findings.map((finding: any, idx: number) => (
          <div
            key={idx}
            className={`rounded-xl border p-3 ${getSeverityStyle(finding.severity, finding.category)}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {getIcon(finding.category)}
              <span className="text-xs font-bold uppercase tracking-wider">
                {finding.category} • {finding.severity}
              </span>
            </div>
            <h4 className="font-bold text-sm mb-1">{finding.title}</h4>
            <p className="text-xs opacity-90 leading-relaxed mb-2">
              {finding.description}
            </p>
            {finding.job_name && (
              <span className="inline-block bg-white/50 px-2 py-1 rounded text-[10px] font-mono font-semibold">
                Job: {finding.job_name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiReportPanel;
