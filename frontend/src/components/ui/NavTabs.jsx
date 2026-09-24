import ContentLink from "./ContentLink"

export default function NavTabs({ desktopMode = false }) {
    return (
        <nav className={desktopMode ? "bg-transparent" : 'bg-brandPrimary'}>
            <div className={`flex flex-row ${desktopMode ? "gap-2 items-center" : "gap-3 mx-3 justify-around py-2 border-t border-brandNavBg"}`}>
                <ContentLink link="/home/subjects" desktopMode={desktopMode}>
                    Assuntos
                </ContentLink>

                <ContentLink link="/home/review" desktopMode={desktopMode}>
                    Revisão
                </ContentLink>

                <ContentLink link="/home/statistics" desktopMode={desktopMode}>
                    Estatísticas
                </ContentLink>
            </div>
        </nav>
    )
}