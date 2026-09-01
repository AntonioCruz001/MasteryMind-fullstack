import { useState } from "react"
export default function ReviewControls({cardPontos}) {
    // const accentColor = "border-2 border-pink-800"
    const accentColor = "border-2 border-b-indigo-700"

    // let cardPontos = pontos     // Preciso dos pontos do card

    const [statusColors, setStatusColors] = useState([
        { actualStatusColor: "bg-gray-500", offStatusColor: "bg-gray-200" },
        { actualStatusColor: "bg-red-500", offStatusColor: "bg-red-200" },
        { actualStatusColor: "bg-orange-500", offStatusColor: "bg-orange-200" },
        { actualStatusColor: "bg-lime-500", offStatusColor: "bg-lime-200" },
        { actualStatusColor: "bg-green-500", offStatusColor: "bg-green-200" },
    ])

    // busca dos dados do card no backend
    // Map() a partir do index dos pontos - OK

    return <div className="flex flex-row justify-between px-4 grow">
        
        <div>data de revisao</div>

        <ul className="flex flex-row items-center gap-2 ">
            {statusColors.map((color, index) => {
                // Se cardPontos for 5, 6... o Math.min trava o valor em 4 (5ª bolinha)
                const activeIndex = Math.min(cardPontos, statusColors.length - 1);

                return (
                    <li
                        key={index}
                        className={
                            `rounded-full h-4 w-4 ${activeIndex === index ?
                                `${color.actualStatusColor} ${accentColor}` : color.offStatusColor}`
                        }
                    ></li>
                );
            })}
        </ul>
    </div>
}