import { useEffect, useState } from "react";
import Write from "./Write";

// Regroupement des animations CSS injectées dynamiquement
const styles = {
    // Injection des keyframes directement dans le document si elles n'existent pas
    injectKeyframes: () => {
        if (typeof window !== "undefined" && !document.getElementById("popup-animation-styles")) {
            const styleSheet = document.createElement("style");
            styleSheet.id = "popup-animation-styles";
            styleSheet.innerText = `
                @keyframes backdropFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes backdropFadeOut { from { opacity: 1; } to { opacity: 0; } }
                @keyframes popupScaleIn { from { transform: scaleX(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes popupScaleOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0); opacity: 0; } }
            `;
            document.head.appendChild(styleSheet);
        }
    },
    // Classes de base pour le conteneur noir transparent (Backdrop)
    backdrop: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm",
    // Classes de base pour la boîte de dialogue (Modal)
    modal: "bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-100 dark:border-zinc-800"
};

// Injection automatique au chargement du script
styles.injectKeyframes();

export default function Popup({ isOpen, onClose, onConfirm, title, children , confirmOnly = false}) {
    const [render, setRender] = useState(isOpen);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    // Gère l'effet d'entrée et de sortie synchrone avec l'état 'isOpen'
    useEffect(() => {
        if (isOpen) {
            setRender(true);
            setIsAnimatingOut(false);
        } else if (render) {
            setIsAnimatingOut(true);
        }
    }, [isOpen]);

    // Déclenche la destruction réelle du DOM une fois l'animation de sortie finie (200ms)
    const handleAnimationEnd = () => {
        if (isAnimatingOut) {
            setRender(false);
            setIsAnimatingOut(false);
        }
    };

    if (!render) return null;

    // Détermination dynamique des styles d'animation à appliquer
    const backdropAnimation = isAnimatingOut 
        ? { animation: "backdropFadeOut 0.2s ease-out forwards" } 
        : { animation: "backdropFadeIn 0.2s ease-out forwards" };

    const modalAnimation = isAnimatingOut 
        ? { animation: "popupScaleOut 0.18s ease-in forwards" } 
        : { animation: "popupScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" };

    return (
        <div 
            className={styles.backdrop} 
            style={backdropAnimation}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className={styles.modal} style={modalAnimation}>
                <h3 className="text-lg font-bold mb-3 text-primary dark:text-white">
                <Write 
                    words={[title]} 
                    typingSpeed={30}
                    deletingSpeed={40}
                    pauseDuration={1200}
                />
                </h3>
                <div className="mb-6 text-sm text-text-secondary/80 dark:text-gray-300">{children}</div>
                
                <div className="flex justify-end gap-3">
                    {!confirmOnly && 
                    
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                            Annuler
                        </button>
                    }
                    <button 
                        onClick={onConfirm} 
                        className={`px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg  transition shadow-sm 
                            ${confirmOnly ? "hover:bg-secondary" : "hover:bg-red-700"}`}
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}