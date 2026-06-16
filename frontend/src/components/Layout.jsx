import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
    return (
        <div className='layout-wrapper'>
            <Header title="MasteryMind" subtitle="Domine sua memorização" />
            <main >
                <Outlet />
                {/* Futuro Footer */}
            </main>
        </div>
    )
}