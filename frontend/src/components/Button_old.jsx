
const btnCriar = "bg-brandPrimary hover:bg-teal-700 text-white font-bold py - 2 px - 4 rounded - lg shadow - sm transition - all text - sm cursor - pointer";
const btnExcluir = "bg-brandPrimary hover:bg-red-500 text-white font-bold py - 2 px - 4 rounded - lg shadow - sm transition - all text - sm cursor - pointer";

export default function Button({ type, className = "", title, btnType, ...props }) {



    return (
        <button type={type || "button"} className={className} {...props}>
            {title}
        </button>
        // <button type={type || "button"} className={className} {...props}>
        //     {title}
        // </button>


    )
}