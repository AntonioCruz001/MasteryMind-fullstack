// src/pages/TestGroups/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Button from '../../components/ui/Button';
import api from '../../services/api';

export default function TestGroups() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [groups, setGroups] = useState([]);
    const [allCards, setAllCards] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [loading, setLoading] = useState(false);

    // Buscar Grupos e Cards do Servidor em paralelo
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [groupsRes, cardsRes] = await Promise.all([
                    api.get('/test-groups'),
                    api.get('/flashcards')
                ]);
                setGroups(groupsRes.data);
                setAllCards(Array.isArray(cardsRes.data) ? cardsRes.data : []);
            } catch (err) {
                console.error('Erro ao carregar dados de testes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (cardId) => {
        setSelectedCards(prev => 
            prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
        );
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || selectedCards.length === 0) return;

        try {
            const response = await api.post('/test-groups', {
                name: groupName,
                flashcard_ids: selectedCards
            });

            setGroups(prev => [...prev, response.data]);
            setGroupName('');
            setSelectedCards([]);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Erro ao criar grupo de teste:', err);
        }
    };

    return (
        <div className='flex flex-col w-full gap-6'>
            <div className='flex justify-between items-center bg-brandCard p-4 rounded-2xl border border-brandBorder shadow-xs'>
                <div>
                    <h2 className='text-xl font-bold text-brandText'>Grupos de Testes</h2>
                    <p className='text-xs text-brandTextMuted'>Simulados personalizados sem impacto na repetição espaçada</p>
                </div>
                <Button
                    title={"+ Novo Grupo"}
                    btnType={'criar'}
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            <div className='flex flex-col gap-3'>
                {loading ? (
                    <div className="text-center py-10 text-sm text-gray-500">A carregar grupos...</div>
                ) : groups.length === 0 ? (
                    <p className='text-gray-500 text-sm text-center py-10 bg-brandCard rounded-2xl border border-gray-100 shadow-sm'>
                        Nenhum grupo de teste criado. Clique no botão acima!
                    </p>
                ) : (
                    groups.map((grupo) => (
                        <div
                            key={grupo.id}
                            onClick={() => navigate(`/home/CardTest/${grupo.id}/CardTestList`)}
                            className='bg-brandCard p-4 rounded-xl border border-brandBorder shadow-xs flex justify-between items-center cursor-pointer hover:border-brandPrimary hover:shadow-md transition-all group'
                        >
                            <span className='font-semibold text-brandText group-hover:text-brandPrimary transition-colors'>
                                {grupo.name}
                            </span>
                            <span className='text-xs text-brandTextMuted'>
                                {grupo.flashcard_ids.length} cards
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Criação */}
            {isModalOpen && createPortal(
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
                    <div className='bg-brandCard rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-hidden'>
                        <div className='flex justify-between items-center pb-2 border-b border-gray-100'>
                            <h3 className='text-lg font-bold text-brandText'>Criar Novo Grupo de Teste</h3>
                            <button onClick={() => setIsModalOpen(false)} className='text-gray-400 hover:text-gray-700 font-bold cursor-pointer'>✕</button>
                        </div>

                        <form onSubmit={handleCreateGroup} className='flex flex-col gap-4 overflow-hidden'>
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
                                                className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                                                    isChecked ? 'bg-brandPrimaryLight border-brandPrimary' : 'bg-white border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                <input
                                                    type='checkbox'
                                                    checked={isChecked}
                                                    onChange={() => {}}
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
                                <Button type='button' title={'Cancelar'} className='bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-bold' onClick={() => setIsModalOpen(false)} />
                                <Button type='submit' title={'Salvar Grupo'} btnType={'criar'} />
                            </div>
                        </form>
                    </div>
                </div>,
                document.getElementById('modal')
            )}
        </div>
    );
}