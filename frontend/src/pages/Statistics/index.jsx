import { useMemo, useState } from 'react';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSubjects } from '../../hooks/useSubjects';

const LEVEL_CONFIG = [
  { level: 0, label: 'Nível 0 (Aprendizado)', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { level: 1, label: 'Nível 1 (Revisão 1)', color: 'bg-red-50 text-red-700 border-red-200' },
  { level: 2, label: 'Nível 2 (Revisão 2)', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { level: 3, label: 'Nível 3 (Revisão 3)', color: 'bg-lime-50 text-lime-700 border-lime-200' },
  { level: 4, label: 'Nível 4 (Dominado)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export default function Statistics() {
  const { flashcards, setFlashcards, loading: loadingFlashcards } = useFlashcards();
  const { subjects, loading: loadingSubjects } = useSubjects();

  const [activeTab, setActiveTab] = useState('GERAL');

  const loading = loadingFlashcards || loadingSubjects;

  const filteredFlashcards = useMemo(() => {
    if (!Array.isArray(flashcards)) return [];
    if (activeTab === 'GERAL') return flashcards;

    return flashcards.filter(card => String(card.subject_id) === String(activeTab));
  }, [flashcards, activeTab]);

  // Mapeia e conta quantos cards existem em cada nível
  const statsByLevel = useMemo(() => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

    filteredFlashcards.forEach((card) => {
      // ?? checa se é nulo ou undefined
      const lvl = card.level ?? 0;
      if (counts[lvl] !== undefined) {
        counts[lvl] += 1;
      } else if (lvl >= 4) {
        counts[4] += 1;
      }
    });

    return counts;
  }, [filteredFlashcards]);

  const totalFilteredCards = filteredFlashcards?.length || 0;
  const totalCards = flashcards?.length || 0;

  const baseTabStyle = "px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer select-none shrink-0";
  const inactiveStyle = "bg-brandNavBg text-brandText hover:bg-brandNavActiveBg";
  const activeStyle = "bg-brandNavActiveBg text-white font-bold shadow-xs";

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-3 border-brandPrimary border-t-transparent rounded-full animate-spin" />
          <span className="text-stone-500 text-sm font-medium">Carregando Estatísticas...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Título da Página */}
          <div className="flex justify-between items-center bg-brandCard p-4 rounded-2xl border border-brandBorder shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-brandText">Estatísticas</h2>
              <p className="text-xs text-brandTextMuted">Progresso dos seus flashcards por nível</p>
            </div>

            {/* Bloco da direita com fundo sutil para dar peso visual e equilíbrio */}
            <div className="text-right bg-brandPrimary/5 px-3.5 py-1.5 rounded-xl border border-brandPrimary/10">
              <span className="text-2xl font-extrabold text-brandPrimary">{totalCards}</span>
              <p className="text-[6px] md:text-[8px] lg:text-[10px] uppercase tracking-wider font-semibold text-brandTextMuted whitespace-nowrap">Total de Cards</p>
            </div>
          </div>

          {/* Navegação de Abas por Assunto */}
          <div className="flex flex-row gap-1.5 overflow-x-auto pb-2 w-full">
            {/* Aba Geral */}
            <button
              onClick={() => setActiveTab('GERAL')}
              className={`${baseTabStyle} ${activeTab === 'GERAL' ? activeStyle : inactiveStyle}`}
            >
              Geral ({flashcards.length})
            </button>

            {/* Abas dinâmicas para cada Assunto */}
            {subjects.map((sub) => {
              const isActive = activeTab === sub.id;
              // Conta quantos cards pertencem a este assunto específico
              const countCards = flashcards.filter(c => c.subject_id === sub.id).length;

              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id)}
                  className={`${baseTabStyle} ${isActive ? activeStyle : inactiveStyle}`}
                >
                  {sub.name} ({countCards})
                </button>
              );
            })}
          </div>

          {/* Grid de Cards por Nível */}
          <div className="flex flex-col gap-3">
            {LEVEL_CONFIG.map(({ level, label, color }) => {
              const count = statsByLevel[level] || 0;
              const percentage = totalFilteredCards > 0 ? Math.round((count / totalFilteredCards) * 100) : 0;

              return (
                <div
                  key={level}
                  className={`p-4 rounded-xl border flex items-center justify-between shadow-2xs transition-all ${color}`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{label}</span>
                    <div className="w-32 bg-black/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-current h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-bold">{count}</span>
                    <span className="text-xs opacity-75 ml-1">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}