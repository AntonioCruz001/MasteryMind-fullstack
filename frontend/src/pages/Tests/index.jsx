// src/pages/TestGroups/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import GroupModal from '../../components/tests/GroupModal';
import ResultsModal from '../../components/tests/ResultsModal';

// Mock temporário para os resultados
const MOCK_RESULTS = {
    1: [ // ID do grupo 1 (substitua pelos IDs reais dos seus grupos se forem diferentes)
        { id: 1, created_at: '2026-11-08T10:30:00', correct_count: 8, total_cards: 10, score_percentage: 80.0 },
        { id: 2, created_at: '2026-11-07T15:20:00', correct_count: 6, total_cards: 10, score_percentage: 60.0 },
        { id: 2, created_at: '2026-11-07T15:20:00', correct_count: 7, total_cards: 10, score_percentage: 70.0 },
        { id: 2, created_at: '2026-11-07T15:20:00', correct_count: 9, total_cards: 10, score_percentage: 90.0 },
        { id: 2, created_at: '2026-11-07T15:20:00', correct_count: 10, total_cards: 10, score_percentage: 100.0 }
    ],
    2: [ // ID do grupo 2
        { id: 3, created_at: '2026-11-06T09:10:00', correct_count: 5, total_cards: 5, score_percentage: 100.0 }
    ]
};

export default function TestGroups() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);

    const [groups, setGroups] = useState([]);
    const [allCards, setAllCards] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    // Estados para o Modal de Resultados (Mockup)
    const [selectedGroupResults, setSelectedGroupResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(false);

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

    // Função para abrir o modal de resultados e simular o carregamento (Mock)
    const handleOpenResults = (group, e) => {
        e.stopPropagation();
        console.log("=== [MOCK DEBUG] ID do grupo clicado:", group.id);
        setEditingGroup(group);
        setIsResultsOpen(true);
        setLoadingResults(true);

        setTimeout(() => {
            // Se o ID existir no mock, usa ele; senão, usa os dados do grupo 1 como padrão para o mockup aparecer!
            const resultadosDoGrupo = MOCK_RESULTS[group.id] || MOCK_RESULTS[1];
            setSelectedGroupResults(resultadosDoGrupo);
            setLoadingResults(false);
        }, 300);
    };

    const handleSaveGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || selectedCards.length === 0) return;

        try {
            if (editing && editingGroup) {
                const response = await api.put(`/test-groups/${editingGroup.id}`, {
                    name: groupName,
                    flashcard_ids: selectedCards
                });

                setGroups(prev =>
                    prev.map(group => group.id === editingGroup.id ? response.data : group)
                );
            } else {
                const response = await api.post('/test-groups', {
                    name: groupName,
                    flashcard_ids: selectedCards
                });

                setGroups(prev => [...prev, response.data]);
            }

            setGroupName('');
            setSelectedCards([]);
            setIsModalOpen(false);
            setEditing(false);
            setEditingGroup(null);
        } catch (err) {
            console.error('Erro ao salvar o grupo de teste:', err);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!groupId) return;

        try {
            await api.delete(`/test-groups/${groupId}`);
            setGroups(prev => prev.filter(group => group.id !== groupId));
            setIsModalOpen(false);
            setEditing(false);
            setEditingGroup(null);
            setGroupName('');
            setSelectedCards([]);
        } catch (err) {
            console.error('Erro ao excluir o grupo de teste:', err);
        }
    };

    return (
        <div className='flex flex-col w-full gap-6'>
            <div className='flex justify-between items-center gap-2 bg-brandCard p-4 rounded-2xl border border-brandBorder shadow-xs'>
                <div className='w-60'>
                    <h2 className='text-xl font-bold text-brandText'>Grupos de Testes</h2>
                    <p className='text-xs text-brandTextMuted'>Simulados personalizados sem impacto na repetição espaçada</p>
                </div>
                <Button
                    title={"+ Novo Grupo"}
                    btnType={'criar'}
                    onClick={() => {
                        setEditing(false);
                        setEditingGroup(null);
                        setGroupName('');
                        setSelectedCards([]);
                        setIsModalOpen(true);
                    }}
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
                            className='bg-brandCard p-5 rounded-xl border border-brandBorder shadow-sm flex justify-center items-center cursor-pointer hover:border-brandPrimary hover:shadow-md transition-all group'
                        >
                            <div className='content w-full flex flex-row justify-between items-center gap-2'>
                                <span className='font-semibold text-brandText group-hover:text-brandPrimary transition-colors'>
                                    {grupo.name}
                                </span>
                                <div className='flex flex-row items-center gap-3'>
                                    <span className='min-w-10 text-xs text-brandTextMuted'>
                                        {grupo.flashcard_ids.length} cards
                                    </span>
                                    <Button
                                        className="w-5 flex justify-center items-center bg-green-300 rounded-sm hover:bg-green-400 cursor-pointer"
                                        title="%"
                                        onClick={(e) => handleOpenResults(grupo, e)}
                                    />
                                    <Button
                                        className="w-8 flex justify-center cursor-pointer"
                                        btnType='gear'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditing(true);
                                            setEditingGroup(grupo);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de lista de resultados anteriores (Mockup) */}
            {isResultsOpen && (
                <ResultsModal
                    isOpen={isResultsOpen}
                    onClose={() => setIsResultsOpen(false)}
                    group={editingGroup}
                    results={selectedGroupResults}
                    loading={loadingResults}
                />
            )}

            {/* Modal de Criação / Edição */}
            {isModalOpen && (
                <GroupModal
                    initialData={editingGroup}
                    editing={editing}
                    setEditing={setEditing}
                    handleSaveGroup={handleSaveGroup}
                    onClose={() => setIsModalOpen(false)}
                    allCards={allCards}
                    setAllCards={setAllCards}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                    groupName={groupName}
                    setGroupName={setGroupName}
                    onDelete={handleDeleteGroup}
                />
            )}
        </div>
    );
}