import { useState, useEffect, useRef } from "react";

const styles = {
    container: "relative inline-block text-left w-full",
    trigger: "w-full cursor-pointer focus:outline-none",
    content: "absolute z-50 mt-2 min-w-[200px] w-full rounded-xl bg-bg text-text border border-gray-100 dark:border-zinc-800 shadow-xl p-2 px-0",
    injectAnimation: () => {
        if (typeof window !== "undefined" && !document.getElementById("dropdown-animation-style")) {
            const style = document.createElement("style");
            style.id = "dropdown-animation-style";
            style.innerText = `
                @keyframes dropdownIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-dropdown { animation: dropdownIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `;
            document.head.appendChild(style);
        }
    }
};

styles.injectAnimation();

export default function Dropdown({ trigger, children, position = "left" }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const positionClass = position === "right" ? "right-0" : "left-0";

    return (
        <div className={styles.container} ref={dropdownRef}>
            {/* Clic pour intervertir l'état */}
            <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {/* Rendu direct et classique des enfants */}
            {isOpen && (
                <div className={`${styles.content} ${positionClass} animate-dropdown`}>
                    {children}
                </div>
            )}
        </div>
    );
}