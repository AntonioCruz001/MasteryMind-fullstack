// src/pages/CardTestList/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import backIcon from '../../assets/navigation/back.svg';

export default function CardTestList() {
    const { grupoId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    // Contadores de desempenho do teste
    const [results, setResults] = useState({ acertos: 0, erros: 0 });
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const fetchTestGroupDetails = async () => {
            try {
                setLoading(true);
                // Busca os grupos do utilizador para encontrar o grupo atual e seus IDs de cards
                const groupsRes = await api.get('/test-groups');
                const currentGroup = groupsRes.data.find(g => String(g.id) === String(grupoId));

                if (currentGroup) {
                    setGroupName(currentGroup.name);
                    // Busca todos os flashcards para filtrar apenas os que pertencem a este grupo
                    const cardsRes = await api.get('/flashcards');
                    const groupCards = cardsRes.data.filter(c => currentGroup.flashcard_ids.includes(c.id));
                    setCards(groupCards);
                }
            } catch (err) {
                console.error('Erro ao carregar o grupo de teste:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTestGroupDetails();
    }, [grupoId]);

    const handleAnswer = (resposta) => {
        if (resposta === 'acerto') {
            setResults(prev => ({ ...prev, acertos: prev.acertos + 1 }));
        } else {
            setResults(prev => ({ ...prev, erros: prev.erros + 1 }));
        }

        setFlipped(false);

        if (currentIndex + 1 < cards.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-stone-500 text-sm">Carregando simulado...</div>;
    }

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4 bg-brandCard p-6 rounded-2xl border border-brandBorder">
                <p className="text-stone-600 text-sm">Este grupo não possui flashcards associados.</p>
                <Button title="Voltar aos Grupos" btnType="criar" onClick={() => navigate('/home/tests')} />
            </div>
        );
    }

    // Tela de Relatório / Conclusão do Teste
    if (isFinished) {
        const total = cards.length;
        const pctAcerto = total > 0 ? Math.round((results.acertos / total) * 100) : 0;
        const pctErro = total > 0 ? Math.round((results.erros / total) * 100) : 0;

        return (
            <div className="flex flex-col gap-6 max-w-md mx-auto bg-brandCard p-6 rounded-2xl border border-brandBorder shadow-sm">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-brandText">Simulado Concluído!</h2>
                    <p className="text-xs text-brandTextMuted">Resultado do grupo: <span className="font-semibold text-brandPrimary">{groupName}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4 my-2">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
                        <span className="block text-2xl font-extrabold text-green-700">{pctAcerto}%</span>
                        <span className="text-xs text-green-600 font-medium">Acertos ({results.acertos})</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                        <span className="block text-2xl font-extrabold text-red-700">{pctErro}%</span>
                        <span className="text-xs text-red-600 font-medium">Erros ({results.erros})</span>
                    </div>
                </div>

                <Button
                    title="Voltar aos Grupos de Testes"
                    btnType="criar"
                    onClick={() => navigate('/home/tests')}
                    className="w-full py-3"
                />
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto">
            {/* Header do Teste */}
            <div className="flex justify-between items-center bg-brandCard p-3 rounded-xl border border-brandBorder text-xs text-brandTextMuted">
                <button onClick={() => navigate('/home/tests')} className='flex items-center justify-center
              gap-2 px-8 sm:px-4 py-2.5 
              bg-brandCard border border-brandBorder shadow-xs rounded-xl 
              text-brandText fontmedium text-sm
              hover:bg-[#d4dddf] active:scale-95 transition-all shrink-0 select-none
              '>
                    <img src={backIcon} alt="voltar" className='w-6 h-6 object-contain pointer-events-none' /> Sair


                </button>
                <div className='flex items-center justify-center
              gap-2 px-8 sm:px-4 py-2.5'>
                    <span className="font-semibold">{groupName}</span>
                </div>

                <div className='flex items-center justify-center
              gap-2 px-8 sm:px-4 py-2.5'>
                    <span>{currentIndex + 1} de {cards.length}</span>
                </div>
            </div>

            {/* Cartão de Execução */}
            <div
                onClick={() => setFlipped(!flipped)}
                className="bg-brandCard min-h-[220px] p-6 rounded-2xl border border-brandBorder shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-brandPrimary transition-all"
            >
                <span className="text-[10px] uppercase tracking-wider text-brandTextMuted mb-2">
                    {flipped ? 'Verso (Resposta)' : 'Frente (Pergunta)'} — (Clique para virar)
                </span>
                <p className="text-brandText font-semibold text-base whitespace-pre-wrap">
                    {flipped ? currentCard.back : currentCard.front}
                </p>
            </div>

            {/* Botões de Resposta (Aparecem apenas se o card foi virado) */}
            {flipped ? (
                <div className="flex gap-4">
                    <Button
                        title="Errei"
                        btnType="erro"
                        onClick={() => handleAnswer('erro')}
                        className="flex-1 py-3"
                    />
                    <Button
                        title="Acertei"
                        btnType="acerto"
                        onClick={() => handleAnswer('acerto')}
                        className="flex-1 py-3"
                    />
                </div>
            ) : (
                <div className="text-center text-xs text-stone-400 py-2">
                    Clique no cartão para revelar a resposta
                </div>
            )}
        </div>
    );
}