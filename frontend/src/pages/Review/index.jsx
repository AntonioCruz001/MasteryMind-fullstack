import { useState, useMemo } from "react";
import { useCurrentTime } from "../../hooks/useCurrentTime";
import { useFlashcards } from "../../hooks/useFlashcards";

const tabs = [
    { id: 'HOJE', label: 'Hoje' },
    { id: 'AMANHA', label: 'Amanhã' },
    { id: 'SEMANA', label: 'Próxima semana' },
    { id: 'QUINZENA', label: 'Próximos 15 dias' },
    { id: 'ATRASADOS', label: 'Atrasados' }
];

const parseCardDate = (rawDate) => {
    if (!rawDate) return null;
    let str = String(rawDate);

    if (!str.endsWith('Z') && !str.includes('+') && !str.includes('T')) {
        str = `${str}Z`;
    } else if (str.includes('T') && !str.endsWith('Z') && !str.includes('+')) {
        str = `${str}Z`;
    }

    const parsedDate = new Date(str);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export default function Review() {
    const currentTime = useCurrentTime(5000);

    const { flashcards, loading } = useFlashcards();

    const [activeTab, setActiveTab] = useState('HOJE');

    const [expandedSubjects, setExpandedSubjects] = useState({});

    // 1. Filtra os cards baseado na aba ativa (seu código original de filtro)
    const filteredCards = useMemo(() => {
        // console.log("Card recebido:", flashcards[0]);
        if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) return [];

        const now = currentTime ? new Date(currentTime) : new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        return flashcards.filter((card) => {
            const cardStatus = card.status ? String(card.status).toUpperCase() : '';

            if (cardStatus === 'MASTERED' || Number(card.level) >= 4) return false;

            if (cardStatus === 'NEW' || !card.next_review_date) {
                return activeTab === 'HOJE';
            }

            const reviewDate = parseCardDate(card.next_review_date);
            if (!reviewDate) return false;

            switch (activeTab) {
                case 'ATRASADOS':
                    return reviewDate < startOfToday;
                case 'HOJE':
                    return reviewDate <= endOfToday;
                case 'AMANHA': {
                    const endOfTomorrow = new Date(endOfToday);
                    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
                    return reviewDate > endOfToday && reviewDate <= endOfTomorrow;
                }
                case 'SEMANA': {
                    const nextWeek = new Date(endOfToday);
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    return reviewDate > endOfToday && reviewDate <= nextWeek;
                }
                case 'QUINZENA': {
                    const next15Days = new Date(endOfToday);
                    next15Days.setDate(next15Days.getDate() + 15);
                    return reviewDate > endOfToday && reviewDate <= next15Days;
                }
                default:
                    return true;
            }
        });
    }, [flashcards, activeTab, currentTime]);

    // 2. Agrupa os cards filtrados por assunto de forma limpa e otimizada (sem useState!)
    const cardsBySubject = useMemo(() => {
        const groups = {};

        filteredCards.forEach((card) => {
            // Pega o nome do assunto (ou define um padrão se não vier preenchido)
            const subjectName = card.subject?.name || 'Sem Assunto';
            const subjectId = card.subject_id || 'unknown';

            if (!groups[subjectId]) {
                groups[subjectId] = {
                    subjectId,
                    subjectName,
                    cards: []
                };
            }
            groups[subjectId].cards.push(card);
        });

        // Transforma o objeto de volta em um array para facilitar o mapeamento na UI
        return Object.values(groups);
    }, [filteredCards]);

    const toggleSubject = (subjectId) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subjectId]: !prev[subjectId]
        }));
    };

    const baseTabStyle = "px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer select-none";
    const inactiveStyle = "bg-brandNavBg text-brandText hover:bg-brandNavActiveBg";
    const activeStyle = "bg-brandNavActiveBg text-white font-bold shadow-xs";

    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 border-3 border-brandPrimary border-t-transparent rounded-full animate-spin" />
                    <span className="text-stone-500 text-sm font-medium">Carregando Revisões...</span>
                </div>
            ) : (
                <div className="w-full">
                    {/* Navegação de Tabs */}
                    <div className="flex justify-between items-center mb-4 gap-3 w-full overflow-x-auto pb-2">
                        <ul className="flex flex-row gap-1.5">
                            {tabs.map((tabItem) => {
                                const isActive = activeTab === tabItem.id;
                                return (
                                    <li
                                        key={tabItem.id}
                                        onClick={() => setActiveTab(tabItem.id)}
                                        className={`${baseTabStyle} ${isActive ? activeStyle : inactiveStyle}`}
                                    >
                                        {tabItem.label}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Exibição Agrupada por Assunto */}
                    <div className="flex flex-col gap-6 mt-4">
                        {cardsBySubject.length === 0 ? (
                            <div className="text-stone-500 text-center py-8 text-sm bg-brandCard rounded-xl border border-brandBorder">
                                Nenhum flashcard agendado para este período.
                            </div>
                        ) : (
                            cardsBySubject.map((group) => {
                                // expandedSubjects guarda true ou false para os grupos
                                const isExpanded = expandedSubjects[group.subjectId] || false

                                return <div key={group.subjectId} className="flex flex-col gap-3">
                                    {/* Cabeçalho do Assunto */}
                                    <div
                                        onClick={() => toggleSubject(group.subjectId)}
                                        // hover:opacity-80
                                        className="flex justify-between items-center px-1 cursor-pointer select-none py-1  hover:opacity-80 transition-opacity"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-brandTextMuted font-bold">
                                                {/* ▶ */}
                                                {/* {isExpanded ? '▼' : '►'} */}

                                                <svg
                                                    className={`w-3.5 h-3.5 text-brandTextMuted transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>

                                            </span>
                                            <h3 className="font-bold text-sm text-brandText hover:text-brandPrimary">
                                                {group.subjectName}
                                            </h3>
                                        </div>
                                        <span className="text-xs bg-brandPrimary/10 text-brandPrimary px-2 py-0.5 rounded-full font-semibold">
                                            {group.cards.length} {group.cards.length === 1 ? 'card' : 'cards'}
                                        </span>
                                    </div>

                                    {/* Lista de cards pertencentes a este assunto */}
                                    {isExpanded && (
                                        <div className="flex flex-col gap-2.5 pt-2 border-t border-brandBorder/60">
                                            {group.cards.map((card) => (
                                                <div key={card.id} className="p-3 bg-gray-50 border border-brandBorder rounded-lg shadow-2xs">
                                                    {/* Conteúdo do flashcard */}
                                                    <p className="font-semibold text-brandText text-sm">{card.front}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}