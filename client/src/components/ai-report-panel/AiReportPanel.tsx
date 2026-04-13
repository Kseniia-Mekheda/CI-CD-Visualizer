import { useGraphStore } from "../../store/graphStore";
import { Sparkles, ShieldAlert, Zap, CheckCircle, X } from 'lucide-react';

const AiReportPanel = () => {
    const { aiReport, isAnalyzing, analyzePipeline } = useGraphStore();

    if (!aiReport && !isAnalyzing) {
        return (
            <button 
              onClick={analyzePipeline}
              className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              <Sparkles size={18} /> Analyze with AI
            </button>
        );
    }

    if (isAnalyzing) {
        return (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3 rounded-xl bg-white p-4 shadow-xl border border-light-border">
            <Sparkles className="animate-spin text-purple-600" size={20} />
            <span className="font-semibold text-light-text text-sm">AI аналізує архітектуру...</span>
          </div>
        );
    }

    const getSeverityStyle = (severity: string, category: string) => {
        if (severity === 'High') return 'bg-red-50 text-red-600 border-red-200';
        if (category === 'Performance') return 'bg-yellow-50 text-yellow-600 border-yellow-200';
        return 'bg-green-50 text-green-600 border-green-200';
    };
    
    const getIcon = (category: string) => {
        if (category === 'Security') return <ShieldAlert size={16} />;
        if (category === 'Performance') return <Zap size={16} />;
        return <CheckCircle size={16} />;
    };

    return (
        <div className="absolute top-4 right-4 z-10 w-96 max-h-[80vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-light-border overflow-hidden animate-in slide-in-from-right-4 duration-300">
          {/* Header панелі */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-light-border flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-600" size={20} />
                <h3 className="font-bold text-light-text text-lg">AI Report</h3>
              </div>
              <p className="text-xs text-light-text-secondary mt-1">{aiReport.summary}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-light-text-muted">Health Score</span>
              <span className={`text-2xl font-black ${aiReport.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                {aiReport.score}/100
              </span>
            </div>
          </div>
    
          {/* Список знахідок */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiReport.findings.map((finding: any, idx: number) => (
              <div key={idx} className={`rounded-xl border p-3 ${getSeverityStyle(finding.severity, finding.category)}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {getIcon(finding.category)}
                  <span className="text-xs font-bold uppercase tracking-wider">{finding.category} • {finding.severity}</span>
                </div>
                <h4 className="font-bold text-sm mb-1">{finding.title}</h4>
                <p className="text-xs opacity-90 leading-relaxed mb-2">{finding.description}</p>
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