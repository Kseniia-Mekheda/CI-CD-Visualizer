import { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { Save, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CodeEditor() {
  const { rawYaml, updateYamlContent, downloadYaml, isLoading, fetchHistory } = useGraphStore();
  const [localYaml, setLocalYaml] = useState(rawYaml || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLocalYaml(rawYaml || '');
    setError('');
    setSuccess(false);
  }, [rawYaml]);

  const handleSave = async () => {
    setError('');
    setSuccess(false);
    try {
      await updateYamlContent(localYaml);
      setSuccess(true);
      await fetchHistory();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isChanged = localYaml !== rawYaml;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-full animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-accent-light">config.yml</span>
          {isChanged && <span className="text-xs text-yellow-500 italic">● незбережені зміни</span>}
          {error && <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle size={14}/> {error}</span>}
          {success && <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle2 size={14}/> Збережено! Граф оновлено.</span>}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadYaml} 
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <Download size={14} /> Завантажити
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading || !isChanged} 
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} /> {isLoading ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </div>

      <textarea
        value={localYaml}
        onChange={(e) => setLocalYaml(e.target.value)}
        className="flex-1 w-full p-4 font-mono text-sm bg-transparent outline-none resize-none focus:ring-0 leading-relaxed tab-size-2"
        spellCheck={false}
        placeholder="Вставте ваш YAML код сюди..."
      />
    </div>
  );
}