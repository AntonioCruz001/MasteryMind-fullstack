import { useState } from 'react';
import { CardContex } from '../../pages/Flashcards';
import FlashcardItem from './FlashcardItem';

// Tabela de intervalos em minutos por nível
const LEVEL_INTERVALS_MINUTES = {
  0: 5,               // Nível 0: 5 minutos
  1: 1 * 24 * 60,     // Nível 1: 1 dia (1440 min)
  2: 3 * 24 * 60,     // Nível 2: 3 dias (4320 min)
  3: 7 * 24 * 60,     // Nível 3: 7 dias (10080 min)
  4: 14 * 24 * 60,    // Nível 4: 14 dias (20160 min)
};

const getNextReviewIso = (fromDate, level) => {
  const minutes = LEVEL_INTERVALS_MINUTES[level] ?? 5;
  return new Date(fromDate.getTime() + minutes * 60000).toISOString();
};

export default function DevFlashcardHarness() {
  // 1. Estado mockado do Card
  const [mockCard, setMockCard] = useState({
    id: 999,
    front: "O que é Optional Chaining no JS?",
    back: "Um operador (?.) para ler propriedades de objetos sem gerar erro de null/undefined.",
    subject_id: 1,
    level: 0,
    next_review_date: null,
    last_reviewed_at: null,
    last_result: null,
    status: "NEW",
    tags: [
      { id: 1, name: "Dev" },
      { id: 2, name: "FastAPI" }
    ]
  });

  // 2. Estado do Relógio Simulado
  const [mockTime, setMockTime] = useState(new Date());

  // 3. Funções de Presets Rápidos
  const applyPreset = (presetType) => {
    const now = new Date(mockTime);

    switch (presetType) {
      case 'NEW':
        setMockCard((prev) => ({
          ...prev,
          level: 0,
          status: 'NEW',
          next_review_date: null,
          last_reviewed_at: null,
          last_result: null
        }));
        break;

      case 'LEARNING_WAITING':
        setMockCard((prev) => ({
          ...prev,
          level: 0,
          status: 'LEARNING',
          last_result: 'erro',
          last_reviewed_at: now.toISOString(),
          next_review_date: getNextReviewIso(now, 0)
        }));
        break;

      case 'LEARNING_READY':
        setMockCard((prev) => ({
          ...prev,
          level: 0,
          status: 'LEARNING',
          last_result: 'erro',
          last_reviewed_at: new Date(now.getTime() - 6 * 60000).toISOString(),
          next_review_date: new Date(now.getTime() - 1 * 60000).toISOString()
        }));
        break;

      case 'REVIEW_LEVEL1':
        setMockCard((prev) => ({
          ...prev,
          level: 1,
          status: 'REVIEW',
          last_result: 'acerto',
          last_reviewed_at: now.toISOString(),
          next_review_date: getNextReviewIso(now, 1)
        }));
        break;

      case 'REVIEW_LEVEL2':
        setMockCard((prev) => ({
          ...prev,
          level: 2,
          status: 'REVIEW',
          last_result: 'acerto',
          last_reviewed_at: now.toISOString(),
          next_review_date: getNextReviewIso(now, 2)
        }));
        break;

      case 'REVIEW_LEVEL3':
        setMockCard((prev) => ({
          ...prev,
          level: 3,
          status: 'REVIEW',
          last_result: 'acerto',
          last_reviewed_at: now.toISOString(),
          next_review_date: getNextReviewIso(now, 3)
        }));
        break;

      case 'MASTERED':
        setMockCard((prev) => ({
          ...prev,
          level: 4,
          status: 'MASTERED',
          last_result: 'acerto',
          last_reviewed_at: now.toISOString(),
          next_review_date: getNextReviewIso(now, 4)
        }));
        break;

      case 'SUSPENDED':
        setMockCard((prev) => ({
          ...prev,
          status: 'SUSPENDED',
          next_review_date: null
        }));
        break;

      default:
        break;
    }
  };

  // 4. Contexto Mockado com Cálculo Dinâmico de Próxima Revisão
  const mockCtx = {
    subjectId: "dev-harness-subject",
    setModal: (val) => console.log("[DevHarness] Modal acionado:", val),
    setEdit: (card) => console.log("[DevHarness] Editar card acionado:", card),
    reviewCard: (id, resultado) => {
      console.log(`[DevHarness] reviewCard -> ID: ${id}, Resultado: ${resultado}`);
      const now = new Date(mockTime);

      if (resultado === 'acerto') {
        const nextLevel = Math.min(mockCard.level + 1, 4);
        const nextStatus = nextLevel === 4 ? 'MASTERED' : 'REVIEW';

        setMockCard((prev) => ({
          ...prev,
          level: nextLevel,
          last_result: 'acerto',
          last_reviewed_at: now.toISOString(),
          status: nextStatus,
          next_review_date: getNextReviewIso(now, nextLevel)
        }));
      } else {
        setMockCard((prev) => ({
          ...prev,
          level: 0,
          last_result: 'erro',
          last_reviewed_at: now.toISOString(),
          status: 'LEARNING',
          next_review_date: getNextReviewIso(now, 0)
        }));
      }
    },
    currentTime: mockTime,
  };

  // Função para avançar o relógio simulado diretamente para a data de revisão do card
  const jumpToNextReviewDate = () => {
    if (mockCard.next_review_date) {
      setMockTime(new Date(mockCard.next_review_date));
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUNA DA ESQUERDA: PAINEL DE CONTROLE E VISUALIZAÇÃO */}
        <div className="lg:col-span-2 space-y-6">

          {/* PAINEL DE CONTROLE DEV HARNESS */}
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                🛠️️ Painel de Controle Dev Harness
              </h2>
              <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                🕒 {mockTime.toLocaleString('pt-BR')}
              </span>
            </div>

            {/* PRESETS RÁPIDOS POR NÍVEL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                ⚡ Presets Rápidos por Nível:
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => applyPreset('NEW')}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sky-300 font-medium transition-all"
                >
                  ✨ Novo (Lvl 0)
                </button>
                <button
                  onClick={() => applyPreset('LEARNING_WAITING')}
                  className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 rounded font-medium transition-all"
                >
                  ⏳ Espera (+5 min)
                </button>
                <button
                  onClick={() => applyPreset('REVIEW_LEVEL1')}
                  className="px-2.5 py-1 bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 rounded font-medium transition-all"
                >
                  📅 Lvl 1 (+1d)
                </button>
                <button
                  onClick={() => applyPreset('REVIEW_LEVEL2')}
                  className="px-2.5 py-1 bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 rounded font-medium transition-all"
                >
                  📅 Lvl 2 (+3d)
                </button>
                <button
                  onClick={() => applyPreset('REVIEW_LEVEL3')}
                  className="px-2.5 py-1 bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 rounded font-medium transition-all"
                >
                  📅 Lvl 3 (+7d)
                </button>
                <button
                  onClick={() => applyPreset('MASTERED')}
                  className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 rounded font-medium transition-all"
                >
                  🏆 Lvl 4 (+14d)
                </button>
              </div>
            </div>

            {/* CONTROLES GRANULARES */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono pt-2 border-t border-slate-700/60">
              <div>
                <label className="block text-slate-400 mb-1">Status:</label>
                <select
                  value={mockCard.status}
                  onChange={(e) => setMockCard({ ...mockCard, status: e.target.value })}
                  className="w-full bg-slate-700 text-white p-1.5 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="NEW">NEW</option>
                  <option value="LEARNING">LEARNING</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="RELEARNING">RELEARNING</option>
                  <option value="MASTERED">MASTERED</option>
                  <option value="REOPENED">REOPENED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="HIDDEN">HIDDEN</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nível ({mockCard.level}):</label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={mockCard.level}
                  onChange={(e) => {
                    const newLevel = Number(e.target.value);
                    setMockCard({
                      ...mockCard,
                      level: newLevel,
                      next_review_date: getNextReviewIso(mockTime, newLevel)
                    });
                  }}
                  className="w-full mt-2 accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Último Resultado:</label>
                <select
                  value={mockCard.last_result || ''}
                  onChange={(e) => setMockCard({ ...mockCard, last_result: e.target.value || null })}
                  className="w-full bg-slate-700 text-white p-1.5 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">null (Nenhum)</option>
                  <option value="acerto">acerto</option>
                  <option value="erro">erro</option>
                </select>
              </div>
            </div>

            {/* CONTROLES AVANÇADOS DE TEMPO E DATA */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700 text-xs">
              <button
                onClick={() => setMockTime((prev) => new Date(prev.getTime() + 5 * 60000))}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-medium transition-all"
              >
                ⏩ +5 Min
              </button>

              <button
                onClick={() => setMockTime((prev) => new Date(prev.getTime() + 24 * 60 * 60000))}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-medium transition-all"
              >
                📆 +1 Dia
              </button>

              <button
                onClick={() => setMockTime((prev) => new Date(prev.getTime() + 7 * 24 * 60 * 60000))}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-medium transition-all"
              >
                🗓️ +7 Dias
              </button>

              <button
                onClick={jumpToNextReviewDate}
                disabled={!mockCard.next_review_date}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded text-white font-medium transition-all"
              >
                🎯 Saltar p/ Data do Card
              </button>

              <button
                onClick={() => setMockTime(new Date())}
                className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 font-medium transition-all ml-auto"
              >
                🔄 Reset Relógio
              </button>
            </div>

          </div>

          {/* ÁREA DE PREVISUALIZAÇÃO DO COMPONENTE REAL */}
          <div className="bg-stone-200 p-6 rounded-2xl text-slate-900 shadow-xl">
            <h3 className="text-xs font-semibold text-stone-500 uppercase mb-3 flex justify-between items-center">
              <span>Renderização do Componente (`FlashcardItem`)</span>
              <span className="text-[10px] text-stone-400 font-normal">Ambiente isolado</span>
            </h3>

            <CardContex.Provider value={[mockCard, mockCtx]}>
              <FlashcardItem />
            </CardContex.Provider>
          </div>

        </div>

        {/* COLUNA DA DIREITA: INSPECTOR DE ESTADO DO MOCKCARD */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col h-full">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>🔍 Inspeção do Estado (`mockCard`)</span>
            <span className="text-[10px] text-slate-400 font-normal">JSON Live</span>
          </h3>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto text-[11px] font-mono text-emerald-300 flex-1 max-h-[600px]">
            <pre>{JSON.stringify(mockCard, null, 2)}</pre>
          </div>
        </div>

      </div>
    </div>
  );
}