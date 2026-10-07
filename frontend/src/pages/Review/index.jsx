import { Fragment, useEffect } from "react";
import { CardContex } from "../Flashcards";
export default function Review() {

    useEffect(()=>{
        
    },[])

    return (
        // <Fragment>
        //     <h1>Revisão</h1>
        // </Fragment>
        // <h1>Revisão (Em breve)</h1>

        <div className="w-full">
            {/* CABEÇALHO */}
            <div className='flex justify-between items-center mb-4 gap-3 w-full '>
                <ul className="flex flex-row gap-1">
                    <li className="bg-brandNavBg hover:bg-brandNavActiveBg rounded-sm cursor-pointer">Hoje</li>
                    <li className="bg-brandNavBg hover:bg-brandNavActiveBg rounded-sm cursor-pointer">Amanhã</li>
                    <li className="bg-brandNavBg hover:bg-brandNavActiveBg rounded-sm cursor-pointer">Próxima semana</li>
                    <li className="bg-brandNavBg hover:bg-brandNavActiveBg rounded-sm cursor-pointer">Próximos 15 dias</li>
                    <li className="bg-brandNavBg hover:bg-brandNavActiveBg rounded-sm cursor-pointer">Atrasados</li>
                </ul>
                <div>
                    
                </div>
            </div>
        </div>
    )
}