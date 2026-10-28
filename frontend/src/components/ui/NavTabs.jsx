import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ContentLink from "./ContentLink";

export default function NavTabs({ desktopMode = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Fecha o menu flutuante ao clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (desktopMode) {
        return (
            <nav className="bg-transparent">
                <div className="flex flex-row gap-2 items-center">
                    <ContentLink link="/home/subjects" desktopMode={true}>Assuntos</ContentLink>
                    <ContentLink link="/home/review" desktopMode={true}>Revisão</ContentLink>
                    <ContentLink link="/home/statistics" desktopMode={true}>Estatísticas</ContentLink>
                    <ContentLink link="/home/tests" desktopMode={true}>Testes</ContentLink>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-brandPrimary relative" ref={menuRef}>
            {/* Menu Popover Flutuante para Opções Secundárias */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-3 w-44 bg-brandCard border border-brandBorder rounded-xl shadow-lg p-1.5 flex flex-col gap-1 z-50">
                    <NavLink
                        to="/home/statistics"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `
                            px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors
                            ${isActive
                                ? 'bg-brandNavActiveBg text-white font-bold'
                                : 'text-brandText hover:bg-brandNavHoverBg hover:text-white'
                            }
                        `}
                    >
                        Estatísticas
                    </NavLink>
                    <NavLink
                        to="/home/tests"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `
                            px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors
                            ${isActive
                                ? 'bg-brandNavActiveBg text-brandNavActiveText font-bold'
                                : 'text-brandText hover:bg-brandNavHoverBg hover:text-brandNavActiveText'
                            }
                        `}
                    >
                        Grupos de Testes
                    </NavLink>
                </div>
            )}

            {/* Barra Inferior Fixa */}
            <div className="flex flex-row gap-3 mx-3 justify-around py-2 border-t border-brandNavBg items-center">
                <ContentLink link="/home/subjects">Assuntos</ContentLink>
                <ContentLink link="/home/review">Revisão</ContentLink>

                {/* Botão Gatilho "Mais" */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex-1 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer text-center bg-brandNavBg text-brandNavInactiveText hover:bg-brandNavHoverBg hover:text-brandNavActiveText flex items-center justify-center gap-1 select-none"
                >
                    Mais <span>{isOpen ? '▲' : '▼'}</span>
                </button>
            </div>
        </nav>
    );
}