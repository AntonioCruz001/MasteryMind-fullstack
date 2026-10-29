import { useState, useEffect } from "react";
import Button from "../ui/Button";
import { createPortal } from "react-dom";

export default function GroupModal({ editing, setEditing, allCards, setAllCards, selectedCards, setSelectedCards, groupName, setGroupName, handleSaveGroup, initialData = null, setIsModalOpen, onDelete, ...props }) {


    useEffect(() => {
        if (initialData) {
            setGroupName(initialData.name || '');
            setSelectedCards(initialData.flashcard_ids || []);
        } else {
            setGroupName('');
            setSelectedCards([]);
        }
    }, [initialData, setSelectedCards]);

    const handleCheckboxChange = (cardId) => {
        setSelectedCards(prev =>
            prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
        );
    };

    return createPortal(
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
            <div className='bg-brandCard rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-hidden'>
                <div className='flex justify-between items-center pb-2 border-b border-gray-100'>
                    {editing ? (<h3 className='text-lg font-bold text-brandText'>Editar Grupo de Teste</h3>)
                        : (<h3 className='text-lg font-bold text-brandText'>Criar Novo Grupo de Teste</h3>)}
                    <button onClick={() => setIsModalOpen(false)} className='text-gray-400 hover:text-gray-700 font-bold cursor-pointer'>✕</button>
                </div>

                <form onSubmit={handleSaveGroup} className='flex flex-col gap-4 overflow-hidden'>
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-sm font-semibold text-brandText'>Nome do Grupo</label>
                        <input
                            type='text'
                            placeholder='Ex: Simulado Geral'
                            className='w-full border rounded-lg border-gray-300 p-2.5 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-1.5 flex-1 overflow-hidden'>
                        <label className='text-sm font-semibold text-brandText'>
                            Escolha os cards ({selectedCards.length} selecionados)
                        </label>
                        <div className='border border-gray-200 rounded-lg overflow-y-auto max-h-60 p-2 flex flex-col gap-2 bg-gray-50'>
                            {allCards.map((card) => {
                                const isChecked = selectedCards.includes(card.id);
                                return (
                                    <div
                                        key={card.id}
                                        onClick={() => handleCheckboxChange(card.id)}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${isChecked ? 'bg-brandPrimaryLight border-brandPrimary' : 'bg-white border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={isChecked}
                                            onChange={() => { }}
                                            className='accent-brandPrimary w-4 h-4 cursor-pointer'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-xs font-semibold text-brandText truncate'>{card.front}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='flex justify-end gap-2 pt-2 border-t border-gray-100'>
                        <Button type='button' title={'Cancelar'} className='bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-bold' onClick={() => { setEditing(false), setIsModalOpen(false) }} />
                        {editing && initialData && onDelete && (
                            <Button type='button' btnType='excluir' title={'Excluir'} onClick={() => onDelete(initialData.id)} />
                        )}
                        <Button type='submit' title={'Salvar Grupo'} btnType={'criar'} />
                    </div>
                </form>
            </div>
        </div>,
        document.getElementById('modal')
    )
}