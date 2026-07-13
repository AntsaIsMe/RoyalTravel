import { useState } from "react";

export default function Input({ label, name, value, onChange, disabled, type = "text", white = false , ...props}) {
    const [isFocused, setIsFocused] = useState(false);

    const isFloating = isFocused || value;

    return (
        <div className="relative my-4" {...props}> 
            <label 
                className={`absolute left-3 transition-all duration-200 pointer-events-none
                    ${isFloating 
                        ? "top-[-10px] px-1 bg-bg text-text-secondary" 
                        : "top-[12px] text-base text-text-secondary/40"
                    }
                    ${isFloating && white ? "bg-white" : ""}`}
            >
                {label}
            </label>
            
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                className={`w-full pt-4 pb-1 pl-3 outline-primary border-b border-b-primary transition-all duration-200 
                    ${value 
                        ? "outline-1 outline-primary rounded-sm" 
                        : " focus:rounded-sm"
                    } `}
            />
        </div>
    );
}