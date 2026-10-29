// src/pages/TestGroups/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import GroupModal from '../../components/tests/GroupModal';

export default function TestGroups() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [groups, setGroups] = useState([]);
    const [allCards, setAllCards] = useState([]); //
    const [groupName, setGroupName] = useState(''); // 
    const [selectedCards, setSelectedCards] = useState([]); //
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingGroup, setEditingGroup] = useState('')

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

    const handleSaveGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || selectedCards.length === 0) return;

        try {
            if (editing && editingGroup) {
                // Atualiza o grupo existente (PUT)
                const response = await api.put(`/test-groups/${editingGroup.id}`, {
                    name: groupName,
                    flashcard_ids: selectedCards
                });

                console.log("=== [FRONTEND LOG] Resposta do PUT:", response.data);
                setGroups(prev =>
                    prev.map(group => group.id === editingGroup.id ? response.data : group)
                );
            } else {
                // Cria um novo grupo (POST)
                const response = await api.post('/test-groups', {
                    name: groupName,
                    flashcard_ids: selectedCards
                });

                setGroups(prev => [...prev, response.data]);
            }

            // Limpa os estados e fecha o modal
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
                            <Button className="w-8" title={'⚙'} onClick={(e) => (setIsModalOpen(true), e.stopPropagation(), setEditing(true), setEditingGroup(grupo))} />
                        </div>
                    ))
                )}
            </div>


            {/* Modal de Criação */}
            {isModalOpen
                &&
                <GroupModal
                    initialData={editingGroup}
                    editing={editing}
                    setEditing={setEditing}
                    handleSaveGroup={handleSaveGroup}
                    setIsModalOpen={setIsModalOpen}
                    allCards={allCards}
                    setAllCards={setAllCards}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                    groupName={groupName}
                    setGroupName={setGroupName}
                    onDelete={handleDeleteGroup}
                />}
        </div>
    );
}