// src/pages/Statistics/index.jsx
import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

const LEVEL_CONFIG = [
  { level: 0, label: 'Nível 0 (Aprendizado)', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { level: 1, label: 'Nível 1 (Revisão 1)', color: 'bg-red-50 text-red-700 border-red-200' },
  { level: 2, label: 'Nível 2 (Revisão 2)', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { level: 3, label: 'Nível 3 (Revisão 3)', color: 'bg-lime-50 text-lime-700 border-lime-200' },
  { level: 4, label: 'Nível 4 (Dominado)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export default function Statistics() {
  const { flashcards } = useOutletContext();

  // Mapeia e conta quantos cards existem em cada nível
  const statsByLevel = useMemo(() => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };

    if (Array.isArray(flashcards)) {
      flashcards.forEach((card) => {
        const lvl = card.level ?? 0;
        if (counts[lvl] !== undefined) {
          counts[lvl] += 1;
        } else if (lvl >= 4) {
          counts[4] += 1;
        }
      });
    }

    return counts;
  }, [flashcards]);

  const totalCards = flashcards?.length || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Título e Resumo Geral */}
      <div className="flex justify-between items-center bg-brandCard p-4 rounded-2xl border border-brandBorder shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-brandText">Estatísticas</h2>
          <p className="text-xs text-brandTextMuted">Progresso dos seus flashcards por nível</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-brandPrimary">{totalCards}</span>
          <p className="text-xs text-brandTextMuted">Total de Cards</p>
        </div>
      </div>

      {/* Grid de Cards por Nível */}
      <div className="flex flex-col gap-3">
        {LEVEL_CONFIG.map(({ level, label, color }) => {
          const count = statsByLevel[level] || 0;
          const percentage = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;

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
  );
}