import { useState } from "react";
import Button from "./Button";
import FlashcardContent from "./FlashcardContent";
import ReviewControls from "./ReviewControls";

export default function FlashcardItem() {
    const [fliped, setFliped] = useState(true);
    const [frontContent, setFrontContent] = useState('');
    const [backContent, setBackContent] = useState('');
    

    function handleFlipClick (){
        {fliped === false ? setFliped(true) : setFliped(false)}
    }

    return (
        // wrapper
        <div className="rounded-2xl bg-stone-300 shadow-sm flex flex-col gap-4 p-4">
            {/* header */}
            <div className="flex flex-row  px-4">
                <ReviewControls />
                <Button className="w-6" title={'⚙'} />
            </div>

            {/* frente e verso - conteudo */}
            <FlashcardContent onClick={handleFlipClick} front={frontContent} back={backContent}/>

            {/* Botoes */}
            <div>
                {fliped ?
                    <div className="flex flex-row justify-center gap-20 px-16">
                        <Button title={'Errei'} className="" />
                        <Button title={'Acertei'} className="" />
                    </div> : ''}

                {/* Botao excluir sera movido para o modal! */}

                {/* <div className="flex justify-end">
                    <Button title={'Excluir'} className="px-6" />
                </div> */}
            </div>
        </div>
    )
}