import { parseTargetDate } from './parseTargetDate';

const DAY_MS = 1000 * 60 * 60 * 24;

export function formatNextReviewLabel(card, referenceTime = new Date()) {
    if (!card) return '';

    if (card.status === 'MASTERED' || Number(card.level) >= 4 || !card.next_review_date) {
        return 'Card Dominado';
    }

    const targetDate = parseTargetDate(card.next_review_date);
    if (!targetDate || Number.isNaN(targetDate.getTime())) {
        return '';
    }

    const now = referenceTime instanceof Date ? referenceTime : new Date(referenceTime);
    const diffMs = targetDate.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    if (diffMinutes < 0) { return 'Disponível agora' };

    if (diffMinutes < 60) {
        return `Revisão em ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    // Compara por dias civis para "amanhã" e intervalos em dias/semanas
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startTarget = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
    );
    const diffDays = Math.round((startTarget.getTime() - startToday.getTime()) / DAY_MS);

    if (diffDays <= 0) {
        const hours = Math.max(1, Math.round(diffMinutes / 60));
        return `Revisão em ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    if (diffDays === 1) {
        return 'Revisão amanhã';
    }

    if (diffDays % 7 === 0) {
        const weeks = diffDays / 7;
        return `Revisão em ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }

    return `Revisão em ${diffDays} dias`;
}

/**
 * Registro extensível de mensagens de feedback.
 * Para adicionar novas mensagens no futuro, basta incluir um novo objeto
 * em REVIEW_FEEDBACK_MESSAGES com `when` e `getText`.
 */
export const REVIEW_FEEDBACK_MESSAGES = [
    {
        id: 'mastered-congrats',
        when: ({ updatedCard }) =>
            updatedCard?.status === 'MASTERED' || Number(updatedCard?.level) >= 4,
        getText: () => 'Card dominado',
    },
    {
        id: 'default-next-review',
        when: () => true,
        getText: ({ updatedCard, now }) => formatNextReviewLabel(updatedCard, now),
    },
    // Exemplo futuro (descomente ou adicione novos quando quiser):
    // {
    //   id: 'mastered-congrats',
    //   when: ({ updatedCard }) => updatedCard?.status === 'MASTERED' || Number(updatedCard?.level) >= 4,
    //   getText: () => 'Nível máximo atingido!',
    // },
    // {
    //   id: 'error-retry-soon',
    //   when: ({ result, updatedCard }) => result === 'erro' && Number(updatedCard?.level) === 0,
    //   getText: ({ updatedCard, now }) => formatNextReviewLabel(updatedCard, now),
    // },
];

export function getFeedbackMessage({ result, updatedCard, now = new Date() }) {
    const context = { result, updatedCard, now };
    const matched = REVIEW_FEEDBACK_MESSAGES.find((rule) => rule.when(context));
    return matched ? matched.getText(context) : formatNextReviewLabel(updatedCard, now);
}
