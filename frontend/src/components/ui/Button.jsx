
const btnClasses = {
    criar: "bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    excluir: "bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    editar: "bg-stone-400 hover:bg-stone-700 text-black font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    erro: "bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    acerto: "bg-green-300 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    default: ""
}

export default function Button({ type, className = "", title, btnType = "default", ...props }) {

    return (
        <button type={type || "button"} className={`${btnClasses[btnType]} ${className}`.trim()} {...props}>
            {title}
        </button>

        // <button type={type || "button"} className={className ? `${btnClasses[btnType]}  ${className} ` : `${btnClasses[btnType]}`} {...props}>
        //     {title}
        // </button>
    )

}