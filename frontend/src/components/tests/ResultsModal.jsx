// src/components/tests/ResultsModal.jsx
import { createPortal } from 'react-dom';
import { getScoreColorStyle } from '../../functions/getScoreColorStyle';

export default function ResultsModal({ isOpen, onClose, group, results, loading }) {
    if (!isOpen) return null;

    return createPortal(
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
            <div className='bg-brandCard rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 flex flex-col gap-4 max-h-[85vh] overflow-hidden'>
                
                {/* Cabeçalho do Modal */}
                <div className='flex justify-between items-center pb-2 border-b border-gray-100'>
                    <div>
                        <h3 className='text-lg font-bold text-brandText'>Histórico de Resultados</h3>
                        <p className='text-xs text-brandTextMuted truncate max-w-[260px]'>
                            {`${group?.name} ` || 'Grupo de Teste'}
                        </p>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className='text-gray-400 hover:text-gray-700 font-bold cursor-pointer text-base px-2 py-1'
                    >
                        ✕
                    </button>
                </div>

                {/* Conteúdo / Lista de Resultados */}
                <div className='flex-1 overflow-y-auto space-y-3 pr-1'>
                    {loading ? (
                        <div className="text-center py-10 text-sm text-gray-500">A carregar histórico...</div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-10 text-sm text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                            Nenhum resultado registado para este grupo ainda.
                        </div>
                    ) : (
                        results.map((res, index) => (
                            <div 
                                key={res.id || index}
                                className="flex justify-between items-center p-3.5 rounded-xl border border-brandBorder bg-white/60 shadow-2xs hover:border-brandPrimary/50 transition-colors"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-brandTextMuted font-medium">
                                        {new Date(res.created_at).toLocaleDateString('pt-PT', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <span className="text-sm font-semibold text-brandText">
                                        Acertos: {res.correct_count} / {res.total_cards}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className={ `text-base font-bold px-2.5 py-1 rounded-lg inline-block ${getScoreColorStyle(res.score_percentage)}` }>
                                        {res.score_percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Rodapé / Botão Fechar */}
                <div className='flex justify-end pt-2 border-t border-gray-100'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-bold transition-colors cursor-pointer'
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal') || document.body
    );
}