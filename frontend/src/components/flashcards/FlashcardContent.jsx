import { cardParaRevisar } from '../../functions/IsAvailable';
import { useCurrentTime } from "../../hooks/useCurrentTime";

export default function FlashcardContent({ fliped, handleClick, cardItem, feedback = null, ...props }) {
    const card = cardItem;
    const currentTime = useCurrentTime(5000);

    const liberarTeste = false;
    const available = cardParaRevisar(card, currentTime, liberarTeste);

    const getCardStyle = () => {
        if (feedback?.type === 'acerto') {
            return 'bg-emerald-500 text-white border-2 border-emerald-600 scale-[1.01]';
        }
        if (feedback?.type === 'erro') {
            return 'bg-red-500 text-white border-2 border-red-600 scale-[1.01]';
        }

        if (available) {
            if (!fliped) {
                return 'bg-amber-100 cursor-pointer hover:scale-[1.01]';
            } else if (fliped) {
                return 'bg-cyan-200 cursor-pointer hover:scale-[1.01]';
            }
        }

        if (card.status === "MASTERED") {
            return 'bg-brandSuccess text-white opacity-90 cursor-not-allowed';
        }

        return 'bg-stone-200 opacity-60 cursor-not-allowed';
    };

    return (
        <div
            onClick={available && !feedback ? handleClick : null}
            {...props}
            className={`min-h-25 px-4 flex flex-col items-center
                justify-center rounded-2xl shadow
                shadow-taupe-700 transition-all duration-200
                ${getCardStyle()}`}
        >
            {feedback ? (
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-sm font-bold tracking-wide">
                        {feedback.type === 'acerto' ? 'Acertou!' : 'Errou!'}
                    </span>
                    {feedback.message && (
                        <span className="text-xs font-semibold bg-black/15 px-3 py-1 rounded-full">
                            {feedback.message}
                        </span>
                    )}
                </div>
            ) : (
                <>
                    {!available && (
                        <span className="text-xs text-center text-stone-800 font-semibold">
                            {card.status === "MASTERED"
                                ? 'Card Dominado!'
                                : 'Em espera (Aguardando data de revisão)'}
                        </span>
                    )}

                    {!fliped ? (
                        <div className="text-center whitespace-pre-wrap">
                            {card.front}
                        </div>
                    ) : (
                        <div className="text-center whitespace-pre-wrap">
                            {card.back}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}