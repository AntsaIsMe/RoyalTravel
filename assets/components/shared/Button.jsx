export default function Button({label, full=true, disabled, ...props}) {
    return(
        <button 
            disabled={disabled}
            className={`transition
                ${full 
                    ? disabled 
                        ? "bg-gray-300 bg-primary-light/20 text-text cursor-not-allowed p-2 px-4 rounded-lg" 
                        : "bg-primary p-2 px-4 rounded-lg text-text hover:bg-secondary" 
                    : disabled
                        ? "text-gray-400 dark:text-zinc-600 cursor-not-allowed"
                        : "text-primary-light hover:text-primary"
                }`} 
            {...props}
        >
            {label}
        </button>
    )
}