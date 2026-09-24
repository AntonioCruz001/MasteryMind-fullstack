import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavTabs from '../components/ui/NavTabs'
import AuthContext from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import profileDefaultImage from '../assets/profile/profile-default.svg';

export default function HomeLayout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-brandBg text-brandText">
            {/* Cabeçalho Responsivo */}
            <header className="bg-brandPrimary h-14 flex justify-between items-center px-4 shadow-sm">
                
                {/* Bloco Esquerdo: Menu, Logótipo e NavTabs no Desktop */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <button
                            className="text-white text-xl focus:outline-none cursor-pointer p-1 md:hidden"
                            aria-label="Abrir menu"
                        >
                            ☰
                        </button>
                        <span className="text-white font-bold text-base sm:text-lg tracking-wide">
                            MasteryMind
                        </span>
                    </div>

                    {/* NavTabs integradas ao lado da logo apenas no Desktop */}
                    <div className="hidden sm:block">
                        <NavTabs desktopMode={true} />
                    </div>
                </div>

                {/* Bloco Direito: Ações do Utilizador */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleLogout}
                        title={'Sair'}
                        btnType={'criar'}
                        className="bg-teal-700 hover:bg-teal-800 text-xs py-1.5 px-3"
                    />

                    <div className="flex items-center p-1.5 justify-center 
                    w-8 h-8 rounded-full 
                    bg-gray-300 border border-white overflow-hidden
                    hover:cursor-pointer
                    ">
                        <img src={profileDefaultImage} alt="Perfil" className="w-full h-full object-contain" />
                    </div>
                </div>
            </header>

            {/* NavTabs exibidas abaixo do cabeçalho apenas no Mobile */}
            <div className="block sm:hidden">
                <NavTabs />
            </div>

            {/* Conteúdo Principal */}
            <main className="flex-1 w-full max-w-md mx-auto p-4 pb-20">
                <Outlet />
            </main>
        </div>
    );
}