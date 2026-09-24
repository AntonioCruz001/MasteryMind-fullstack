// src/components/FlashcardModal.jsx (Parte 1/2)
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function FlashcardModal({ isOpen, onClose, onSubmit, onDelete, initialData = null }) {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    useEffect(() => {
        if (initialData) {
            setFront(initialData.front || '');
            setBack(initialData.back || '');
        } else {
            setFront('');
            setBack('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ front, back });
        onClose();
    };

    const handleDelete = () => {
        if (initialData && onDelete) {
            onDelete(initialData.id);
            onClose();
        }
    };

    // src/components/FlashcardModal.jsx (Parte 2/2)
    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-brandCard rounded-xl p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-brandText">
                    {initialData ? 'Editar Flashcard' : 'Novo Flashcard'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-brandText">Frente (Pergunta)</label>
                        <textarea
                            value={front}
                            onChange={(e) => setFront(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg resize-none h-20 text-brandText focus:outline-none focus:ring-2 focus:ring-brandPrimary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-brandText">Verso (Resposta)</label>
                        <textarea
                            value={back}
                            onChange={(e) => setBack(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg resize-none h-20 text-brandText focus:outline-none focus:ring-2 focus:ring-brandPrimary"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        {initialData && onDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Excluir
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-xs bg-gray-200 text-brandText rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs bg-brandPrimary text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.getElementById('modal')
    );

}