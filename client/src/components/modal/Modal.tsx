import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-light-text/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-light-bg p-8 shadow-modal animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-light-text-muted hover:text-light-text transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="mb-6 text-2xl font-bold text-light-text">{title}</h2>
        {children}
      </div>
    </div>
  );
}
