import { useState, useEffect } from 'react';

export function useCountdownTimer(targetDate = null, defaultMinutes = 5, onComplete = () => { }) {
    const calculateSecondsleft = () => {
        if (targetDate) {
            const diffInSeconds = Math.floor((new Date(targetDate).getTime() - new Date().getTime()) / 1000)
            return diffInSeconds > 0 ? diffInSeconds : 0
        }
        return defaultMinutes * 60
    }


    const [secondsLeft, setSecondsLeft] = useState(calculateSecondsleft)


    useEffect(() => {
        setSecondsLeft(calculateSecondsleft())
    }, [targetDate])

    // useEffect usado para iniciar o countdown e chamar a função onComplete quando o tempo acabar
    useEffect(() => {
        if (secondsLeft <= 0) {
            onComplete()
            return
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)

    }, [secondsLeft])

    // Formatação visual
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    return {
        formattedTime,
        secondsLeft,
        isFinished: secondsLeft <= 0
    }
}
