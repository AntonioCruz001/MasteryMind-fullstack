import { createPortal } from "react-dom";
import profileDefaultImage from '../../assets/profile/profile-default.svg';
import { useEffect } from "react";
import Button from "./Button";

export default function Profile({ onClose, onCloseMenu, onHandleLogout }) {

    useEffect(() =>
        onCloseMenu(false)
        , [])

    return (createPortal(
        <div className="w-1/2 md:w-1/4 h-full  fixed right-0 z-50
                        flex flex-col items-center
                        bg-brandPrimary/98">
            <div className="w-full flex flex-row justify-start text-zinc-300 ">
                {/* Subistituir por <Button/> */}
                <Button
                    btnType="close"
                    className="p-2"
                    onClick={() => { onClose(false) }}
                ></Button>
            </div>
            <img src={profileDefaultImage} alt="Imagem de perfil" className="w-20 h-20 rounded-full" />

            <span>Nome</span>

            <ul className="w-full mt-8 flex flex-col gap-3 text-zinc-300 justify-center items-start">
                <li className="w-full hover:bg-brandNavHoverBg">Conta</li>
                <li className="w-full hover:bg-brandNavHoverBg">Tema</li>
                <li className="w-full hover:bg-brandNavHoverBg">Preferências</li>
                <li className="w-full hover:bg-brandNavHoverBg">Exportar / Backup</li>
                <li className="w-full hover:bg-brandNavHoverBg">Ajuda</li>
                <li className="w-full hover:bg-brandNavHoverBg">Configurações</li>
                <Button
                    onClick={() => onHandleLogout()}
                    title={'Sair'}
                    btnType={'sair'}
                    className="bg-teal-700 hover:bg-teal-800 text-xs py-1.5 px-3"
                />
            </ul>


        </div>, document.getElementById('modal')))
}