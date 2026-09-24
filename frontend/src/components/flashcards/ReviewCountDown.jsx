import { useCountdownTimer } from '../../hooks/useCountdownTimer';

export default function ReviewCountDown({ targetDate, defaultMinutes = 5, onReady }) {
    const { formattedTime, isFinished } = useCountdownTimer(targetDate, defaultMinutes, onReady)

    if (isFinished) {
        return (
            // Depois deixar vazio
            <span className="text-brandPrimary font-semibold animate-pulse">
                Pronto para revisar!
            </span>
        )
    }

    return (
        <span className='text-brandWarning font-semibold font-mono'>
            Tente em {formattedTime}
        </span>
    )
}