import { useState, useEffect } from "react";

// Função que recebe valor em milisegundos e retorna a hora atual a cada intervalo de tempo
// Valor padrão : 5 segundos (5000ms)

export function useCurrentTime(intervalo = 5000) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, intervalo);

        return () => clearInterval(timer)
    }, [intervalo]);


    return currentTime;
}

