import { Outlet } from "react-router-dom";
import NavTabs from '../components/NavTabs'

export default function HomeLayout(){
    return(
        <div className="min-h-screen flex flex-col bg-brandBg text-brandText">
            <header className="bg-brandPrimary h-14 flex  justify-between items-center px-4 shadow-sm">
                <button className="text-white text-xl">☰</button>
                <span className="text-white font-bold">Mastery Mind</span>
                <div className="w-8 h-8 rounded-full bg-gray-300 border border-white overflow-hidden">
                    <img src="" alt="Perfil" />
                </div>
            </header>

            <NavTabs/>

            <main className="flex-1 w-full max-w-md mx-auto p-4">
                <Outlet/>
            </main>
        </div>
    )
}