import edit_gear from '../../assets/edit/edit_gear.svg';

const btnClasses = {
    criar: "bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    excluir: "bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    editar: "bg-stone-400 hover:bg-stone-700 text-black font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    erro: "bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    acerto: "bg-green-300 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    sair: "group inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 hover:text-red-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-xs cursor-pointer ",
    default: "",
    gear: "",
    close: "group p-1 rounded-lg text-zinc-300 hover:text-[#005f5a] transition-colors cursor-pointer",
    link:"bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer"
}

export default function Button({ type, className = "", btnType = "default", title = null, children = null, ...props }) {

    return (
        <button type={type || "button"} className={`${btnClasses[btnType]}  ${className}`.trim()} {...props}>
            {title ? title : children}

            {btnType == 'gear' ? <img className='w-4 h-4  object-contain hover:animate-spin' src={edit_gear} alt="edit" /> : ''}

            {btnType === 'sair' ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                </svg>
            ) : ''}

            {btnType === 'close' ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-6 h-6 transition-transform duration-150 group-hover:scale-105"
                    aria-hidden="true"
                >
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                        ry="5"
                        strokeWidth={1.6}
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.5 15.5L15.5 8.5M8.5 8.5l7 7"
                    />
                </svg>
            ) : ''}
        </button>

        // <button type={type || "button"} className={className ? `${btnClasses[btnType]}  ${className} ` : `${btnClasses[btnType]}`} {...props}>
        //     {title}
        // </button>
    )

}