import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import Button from '../ui/Button';

export default function SubjectModal({ isOpen, onClose, onSubmit, onDelete, initialData = null }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('');
    const [deleteCautionToast, setDeleteCautionToast] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '')
            setDescription(initialData.description || '')
        } else {
            setName('')
            setDescription('')
        }

    }, [initialData, isOpen])

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
        onClose();
    }

    const handleDelete = () => {
        if (initialData && onDelete) {
            onDelete(initialData.id);
            setDeleteCautionToast(false);
            onClose();
        }
    }


    return createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-brandCard rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 relative">
                <Button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold cursor-pointer"
                />

                <h2 className="text-xl font-bold mb-4 text-brandText">
                    {initialData ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-brandText">Nome da Categoria</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Informática, Inglês..."
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-brandText focus:outline-none focus:ring-2 focus:ring-brandPrimary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-brandText">Descrição (opcional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg resize-none h-24 text-sm bg-gray-50 text-brandText focus:outline-none focus:ring-2 focus:ring-brandPrimary"
                        />
                    </div>

                    {deleteCautionToast && (
                        <div className="flex flex-col gap-2 bg-red-50 p-3 rounded-lg border border-red-200">
                            <span className="text-xs text-red-700 font-semibold leading-relaxed">
                                ⚠️ Ao excluir um assunto, todos os cards relacionados também serão excluídos.
                            </span>
                            <div className="flex justify-end gap-2 pt-1">
                                <Button
                                    type="button"
                                    btnType="editar"
                                    title="Não"
                                    className="text-xs py-1 px-3"
                                    onClick={() => setDeleteCautionToast(false)}
                                />
                                <Button
                                    type="button"
                                    btnType="excluir"
                                    title="Sim, Excluir"
                                    className="text-xs py-1 px-3"
                                    onClick={handleDelete}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        {initialData && onDelete && (
                            <Button
                                type="button"
                                btnType="excluir"
                                title="Excluir"
                                onClick={() => setDeleteCautionToast(true)}
                            />
                        )}

                        <Button
                            type="button"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-bold"
                            onClick={onClose}
                            title="Cancelar"
                        />
                        <Button
                            type="submit"
                            btnType="criar"
                            title="Salvar"
                        />
                    </div>

                </form>
            </div>
        </div>,
        document.getElementById('modal')
    )
}