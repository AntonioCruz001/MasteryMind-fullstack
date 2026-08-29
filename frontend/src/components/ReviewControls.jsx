import { useState } from "react"
export default function ReviewControls() {
    let statusColors = ['X', 'o', 'o', 'o']
    let actualStatusColor = "border-2 border-pink-800"
    let offStatusColor = ""
    // busca dos dados do card no backend

    return <div className="flex flex-row justify-between px-4 grow">
        <div>data de revisao</div>
        {/* <div>{statusColors[actualStatusColor]}</div> */}
        <div className="flex flex-row items-center">
            <div className={`rounded-full bg-red-300 h-4 w-4 ${actualStatusColor} `}></div>
            <div className={`rounded-full bg-orange-300 h-4 w-4 ${offStatusColor} `}></div>
            <div className={`rounded-full bg-lime-300 h-4 w-4 ${offStatusColor} `}></div>
            <div className={`rounded-full bg-green-500 h-4 w-4 ${offStatusColor} `}></div>
        </div>
    </div>

}