import { useState } from "react";

export default function Select({ label, name, value, onChange, options = [] }) {
    const [isFocused, setIsFocused] = useState(false);

    const isFloating = isFocused || (value !== undefined && value !== "");

    return (
        <div className="relative my-4 w-full">
            {/* Label flottant */}
            <label 
                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10
                    ${isFloating 
                        ? "top-[-10px] text px-1 bg-bg text-text-secondary" 
                        : "top-[12px] text-base text-text-secondary/40"
                    }`}
            >
                {label}
            </label>

            <select 
                name={name}
                value={value ?? ""} 
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                
                className={`w-full pt-4 pb-2 pl-3 rounded-lg border border-primary border-b-2 bg-transparent outline-none transition-all duration-200
                    ${isFloating ? "outline outline-primary" : "focus:outline focus:outline-primary"}`}
            >
                <option value="" disabled hidden></option>
                
                {options.map((option, index) => {
                    const optValue = typeof option === "object" ? option.value : option;
                    const optLabel = typeof option === "object" ? option.label : option;

                    return (
                        <option key={index} value={optValue}>
                            {optLabel}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}