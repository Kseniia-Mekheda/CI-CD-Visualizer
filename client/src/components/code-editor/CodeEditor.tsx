import { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { Save, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import Editor, { useMonaco } from '@monaco-editor/react';

export default function CodeEditor() {
  const { rawYaml, updateYamlContent, downloadYaml, isLoading, fetchHistory } = useGraphStore();
  const [localYaml, setLocalYaml] = useState(rawYaml || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('pipeSightLight', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'type', foreground: '8b5cf6', fontStyle: 'bold' },
          { token: 'string', foreground: '0ea5e9' },
          { token: 'number', foreground: 'f59e0b' },
          { token: 'keyword', foreground: 'ec4899' },
          { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
        ],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#1e293b',
          'editorLineNumber.foreground': '#cbd5e1',
          'editorLineNumber.activeForeground': '#8b5cf6',
          'editor.lineHighlightBackground': '#f8fafc',
          'editorCursor.foreground': '#8b5cf6',
          'editor.selectionBackground': '#f3e8ff',
        }
      });
    }
  }, [monaco]);

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
    <div className="flex flex-col h-full bg-white border-l border-light-border w-full animate-in fade-in duration-200">
      
      <div className="flex items-center justify-between p-3 border-b border-light-border bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-light-text-secondary">config.yml</span>
          {isChanged && <span className="text-xs text-amber-600 font-medium italic">● незбережені зміни</span>}
          {error && <span className="flex items-center gap-1 text-xs text-red-500 font-medium"><AlertCircle size={14}/> {error}</span>}
          {success && <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle2 size={14}/> Збережено!</span>}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadYaml} 
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg text-light-text-secondary hover:bg-light-hover hover:text-light-text transition-colors"
          >
            <Download size={14} /> Завантажити
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading || !isChanged} 
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Save size={14} /> {isLoading ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full pt-2">
        <Editor
          height="100%"
          defaultLanguage="yaml"
          theme="pipeSightLight"
          value={localYaml}
          onChange={(value) => setLocalYaml(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            lineNumbersMinChars: 3,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
          }}
          loading={
            <div className="flex h-full items-center justify-center text-light-text-muted">
              Завантаження редактора...
            </div>
          }
        />
      </div>
    </div>
  );
}