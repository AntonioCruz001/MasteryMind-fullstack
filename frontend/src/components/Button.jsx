
const btnClasses = {
    criar: "bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer",
    excluir: "bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer",
    editar: "bg-stone-400 hover:bg-stone-700 text-black font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer"
}

export default function Button({ type, className = "", title, btnType, ...props }) {

    return (
        <button type={type || "button"} className={className ? `${btnClasses[btnType]} ` + className : `${btnClasses[btnType]}`} {...props}>
            {title}
        </button>
    )

}