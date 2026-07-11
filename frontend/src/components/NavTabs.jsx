// Menu / Links / Config / Tema / User / Tuto
import ContentLink from "./ContentLink"

export default function NavTabs() {

    return (
        <nav className="bg-mauve-600">
            <ul className="flex flex-row justify-around">
                <li>
                    <ContentLink link="/home/subjects">Assuntos</ContentLink>
                </li>
                <li>
                    <ContentLink link="/home/review">Revisão</ContentLink>
                </li>
                <li>
                    <ContentLink link="/home/statistics">Estatísticas</ContentLink>
                </li>
            </ul>
        </nav>
    )
}
