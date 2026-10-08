// src/components/FlashcardModal.jsx (Parte 1/2)
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../ui/Button';

export default function FlashcardModal({ isOpen, onClose, onSubmit, onDelete, onReset, initialData = null }) {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [level, setLevel] = useState('');

    const [resetCautionToast, setResetCautionToast] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFront(initialData.front || '');
            setBack(initialData.back || '');
            setLevel(initialData.level || '');
        } else {
            setFront('');
            setBack('');
            setLevel('');
        }

        setResetCautionToast(false);
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

    const handleReset = (e) => {
        e.preventDefault();
        if (initialData && onReset) {
            onReset(initialData.id);
            setResetCautionToast(false);
            onClose();
        }
    }

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
                    {/* Testando posição do level e reset level */}
                    <div className='flex justify-start gap-2 pt-2'>
                        {initialData && onReset && (
                            <div className='flex flex-col gap-1 w-68'>
                                <div className='flex justify-between items-center  p-2 px-1 py-1'>
                                    <span className='text-sm text-brandText'> {`Level atual: ${level ? level : '0'}`} </span>
                                    {level > 0 && <Button
                                        type='button'
                                        btnType='editar'
                                        title={'Resetar Level'}
                                        onClick={(e) => { e.preventDefault(); setResetCautionToast(true); }}
                                    />}
                                </div>
                                {/* border border-red-200 */}
                                {resetCautionToast &&
                                    <div className='flex items-center justify-between gap-2 bg-red-50 p-2 rounded-lg  px-1 py-1'>
                                        <span className='text-xs text-red-700 font-medium'>Deseja mesmo resetar?</span>
                                        <Button
                                            type='button'
                                            btnType='excluir'
                                            title={'Não'}
                                            onClick={() => setResetCautionToast(false)}
                                        />
                                        <Button
                                            type='button'
                                            btnType='excluir'
                                            title={'Sim'}
                                            onClick={handleReset}
                                        />
                                    </div>
                                }
                            </div>
                        )}
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