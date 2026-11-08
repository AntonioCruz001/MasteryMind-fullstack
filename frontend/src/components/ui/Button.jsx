import edit_gear from '../../assets/edit/edit_gear.svg';

const btnClasses = {
    criar: "bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    excluir: "bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    editar: "bg-stone-400 hover:bg-stone-700 text-black font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    erro: "bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    acerto: "bg-green-300 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer ",
    default: "",
    gear:""
}

export default function Button({ type, className = "", btnType = "default", title = null, children = null, ...props }) {

    return (
        <button type={type || "button"} className={`${btnClasses[btnType]} ${className}`.trim()} {...props}>
            {title ? title : children}

            {btnType == 'gear' ? <img className='w-4 h-4  object-contain hover:animate-spin' src={edit_gear} alt="edit" /> : ''}

        </button>

        // <button type={type || "button"} className={className ? `${btnClasses[btnType]}  ${className} ` : `${btnClasses[btnType]}`} {...props}>
        //     {title}
        // </button>
    )

}