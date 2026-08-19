import { useContext } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import NavTabs from '../components/NavTabs'
import AuthContext from '../contexts/AuthContext'

export default function HomeLayout() {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen flex flex-col bg-brandBg text-brandText">
            <header className="bg-brandPrimary h-14 flex  justify-between items-center px-4 shadow-sm">
                <button className="text-white text-xl">☰</button>
                <span className="text-white font-bold">Mastery Mind</span>

                <button
                    onClick={handleLogout}
                    className="text-xs bg-teal-800 hover:bg-teal-900 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                >
                    Sair
                </button>

                <div className="w-8 h-8 rounded-full bg-gray-300 border border-white overflow-hidden">
                    <img src="" alt="Perfil" />
                </div>
            </header>

            <NavTabs />

            <main className="flex-1 w-full max-w-md mx-auto p-4">
                <Outlet />
            </main>
        </div>
    )
}