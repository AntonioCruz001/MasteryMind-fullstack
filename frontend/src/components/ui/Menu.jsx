import { createPortal } from "react-dom";
import { useEffect } from "react";
import Button from "./Button";

// className="w-1/2  fixed inset-0 z-50  flex flex-col items-center bg-brandPrimary/98"

export default function Menu({ onClose, onCloseProfile }) {

    useEffect(() =>
        onCloseProfile(false)
        , [])

    return (createPortal(
        <div className="w-1/2 md:w-1/4 h-full  fixed left-0 z-50
                        flex flex-col items-center
                        bg-brandPrimary/98">


            <div className="w-full flex flex-row justify-end text-zinc-300 ">
                {/* Subistituir por <Button/> */}

                <Button
                    btnType="close"
                    className="p-2"
                    onClick={() => { onClose(false) }}
                ></Button>

            </div>


            <div className="w-full ">
                <ul className=" mt-8 ml-6 flex flex-col gap-3 text-zinc-300  justify-center items-start">
                    <li className="w-full hover:bg-brandNavHoverBg hover:rounded-sm px-1">Estatísticas</li>
                    <li className="w-full hover:bg-brandNavHoverBg hover:rounded-sm px-1">Calendário</li>
                    <li className="w-full hover:bg-brandNavHoverBg hover:rounded-sm px-1">Metas</li>
                    <li className="w-full hover:bg-brandNavHoverBg hover:rounded-sm px-1">Pontos Fracos</li>
                    <li className="w-full hover:bg-brandNavHoverBg hover:rounded-sm px-1">Histórico</li>
                    <li className="w-full hover:bg-brandNavHoverBg hover:rounded-sm px-1">Testes</li>
                </ul>
            </div>

        </div>, document.getElementById('modal'))
    )
}