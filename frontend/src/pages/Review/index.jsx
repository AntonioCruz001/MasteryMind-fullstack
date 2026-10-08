import { useState, useMemo } from "react";
import { useOutletContext } from 'react-router-dom';

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
    const { flashcards, currentTime } = useOutletContext();
    const [activeTab, setActiveTab] = useState('HOJE');

    const filteredCards = useMemo(() => {
        if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) return [];

        const now = currentTime ? new Date(currentTime) : new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        return flashcards.filter((card) => {
            const cardStatus = card.status ? String(card.status).toUpperCase() : '';

            // 1. Descarta cards dominados ou no nível 4 ou superior
            if (cardStatus === 'MASTERED' || Number(card.level) >= 4) return false;

            // 2. Cards novos ou sem data entram direto na aba 'HOJE'
            if (cardStatus === 'NEW' || !card.next_review_date) {
                return activeTab === 'HOJE';
            }

            // 3. Converte a data do card com validação segura
            const reviewDate = parseCardDate(card.next_review_date);
            if (!reviewDate) return false;

            // 4. Filtragem por janela de tempo segundo a tab ativa
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

    const baseTabStyle = "px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer select-none";
    const inactiveStyle = "bg-brandNavBg text-brandText hover:bg-brandNavActiveBg";
    const activeStyle = "bg-brandNavActiveBg text-white font-bold shadow-xs";

    return (
        <div className="w-full">
            {/* Navegação de Tabs */}
            <div className="flex  justify-between items-center mb-4 gap-3 w-full overflow-x-auto pb-2">
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

            {/* Fila de Flashcards Filtrados */}
            <div className="flex flex-col gap-3 mt-4">
                {filteredCards.length === 0 ? (
                    <div className="text-stone-500 text-center py-8 text-sm">
                        Nenhum flashcard agendado para este período.
                    </div>
                ) : (
                    filteredCards.map((card) => (
                        <div key={card.id} className="p-4 bg-brandCard border border-brandBorder rounded-xl shadow-xs">
                            <div className="flex justify-between text-xs text-stone-500 mb-1">
                                <span>Level {card.level}</span>
                                <span>{card.status}</span>
                            </div>
                            <p className="font-semibold text-brandText">{card.front}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}