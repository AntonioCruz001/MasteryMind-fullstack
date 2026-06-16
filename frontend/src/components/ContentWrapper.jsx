// Menu / Links / Config / Tema / User / Tuto
import ContentLink from "./ContentLink"

export default function ContentWrapper() {

    return (
        <div className="content">
            <main>
                <ContentLink link="/login">Login</ContentLink>
                <ContentLink link="/subjects">Assuntos</ContentLink>
                <ContentLink link="/review">Revisão</ContentLink>
            </main>
        </div>
    )
}
