import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
};

const Modal = ({isOpen, onClose, title, children}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <button className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition" onClick={onClose}>
                    <X size={24}/>
                </button>
                {title && <h2 className="mb-6 text-2xl font-bold text-slate-800">{title}</h2>}
                {children}
            </div>
        </div>
    )
};

export default Modal;