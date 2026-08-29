export default function Button({type, className="", title, ...props}) {
    return (
        <button type={type || "button"} className={className} {...props}>
            {title}
        </button>
    )
}