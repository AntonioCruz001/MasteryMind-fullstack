export default function Button({type, className="", children, ...props}) {
    return (
        <button type={type || "button"} className={className}>
            {children}
        </button>
    )
}