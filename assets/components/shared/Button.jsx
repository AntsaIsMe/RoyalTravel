export default function Button({label, full=true, ...props}) {
    return(
        <button className={`
        ${full ? "bg-primary  p-2 px-4 rounded-lg text-text hover:bg-secondary transition" 
        : "text-primary-light hover:text-primary transition"}`} 
        {...props}>
        {label} </button>
    )
}