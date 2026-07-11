import { Outlet } from "react-router-dom";

export default function AuthLayout(){
    return(
        <div className="min-h-screen flex flex-col bg-brandBg">
            <header className="bg-brandPrimary h-14 flex items-center justify-center shadow-md">
                <h1 className="text-white font-bold text-lg">Mastery Mind</h1>
            </header>

            <main className="flex-1 w-full max-w-md mx-auto p-4">
                <Outlet/>
            </main>

        </div>
    )
}