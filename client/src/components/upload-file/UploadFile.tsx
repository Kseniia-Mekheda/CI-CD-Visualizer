import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useGraphStore } from '../../store/graphStore';
import { ROUTES } from '../../constants/routes';
import { api } from '../../api/axios';
import { MIN_LOADER_MS } from '../../constants/common';

const UploadFile = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { setGraph, setLoading, isLoading } = useGraphStore();

    const handleFile = async (file: File) => {
        if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml')) {
          setError('Будь ласка, завантажте .yaml або .yml файл');
          return;
        }
    
        setError('');
        setLoading(true);
        const startedAt = Date.now();
        const rawYaml = await file.text();
    
        try {
          const formData = new FormData();
          formData.append('file', file);
    
          const { data } = await api.post(ROUTES.UPLOAD_YAML, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          setGraph(data.graph_data.nodes, data.graph_data.edges, rawYaml);
        } catch (err: any) {
          setError(err.response?.data?.detail || 'Помилка при обробці файлу');
        } finally {
            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
            if (remaining > 0) {
              await new Promise((resolve) => setTimeout(resolve, remaining));
            }
            setLoading(false);
        }
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };
    
    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };
    
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-white p-12 transition-all ${
              isDragging ? 'border-accent bg-accent-light/50 scale-105' : 'border-light-border hover:border-accent hover:bg-accent-light/30'
            }`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center text-accent">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="font-bold">Аналізуємо конфігурацію...</p>
              </div>
            ) : (
              <>
                <div className={`mb-4 rounded-full p-4 transition-transform ${isDragging ? 'bg-accent text-white' : 'bg-accent-light text-accent group-hover:scale-110'}`}>
                  <Upload size={32} />
                </div>
                <p className="mb-2 font-bold text-light-text text-center">Перетягніть файл сюди або натисніть</p>
                <p className="text-sm text-light-text-muted">Підтримуються формати .yaml та .yml</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileChange} 
              accept=".yaml,.yml" 
              className="hidden" 
            />
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
        </div>
    );
};

export default UploadFile;