import { useState, useEffect } from "react";

// Centralisation des styles Tailwind
const styles = {
    wrapper: "inline-flex items-center font-mono tracking-tight",
    cursor: "ml-1 inline-block w-[3px] h-[1.1em] bg-primary animate-[blink_1s_infinite]",
    injectAnimation: () => {
        if (typeof window !== "undefined" && !document.getElementById("typewriter-blink-style")) {
            const style = document.createElement("style");
            style.id = "typewriter-blink-style";
            style.innerText = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
            document.head.appendChild(style);
        }
    }
};

// Injection globale de l'animation de clignotement du curseur
styles.injectAnimation();

export default function Write({ 
    words = ["RoyalTravel", "React + Vite", "Symfony Ecosystem", "Tailwind CSS"], 
    typingSpeed = 100, 
    deletingSpeed = 50, 
    pauseDuration = 2000 ,
    ...props
}) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer;
        const fullWord = words[currentWordIndex];

        if (!isDeleting) {
            // Mode écriture : Ajoute une lettre
            timer = setTimeout(() => {
                setCurrentText(fullWord.substring(0, currentText.length + 1));
            }, typingSpeed);

            // Si le mot est complet, on fait une pause avant d'effacer
            if (currentText === fullWord) {
                clearTimeout(timer);
                timer = setTimeout(() => setIsDeleting(true), pauseDuration);
            }
        } else {
            // Mode effacement : Retire une lettre
            timer = setTimeout(() => {
                setCurrentText(fullWord.substring(0, currentText.length - 1));
            }, deletingSpeed);

            // Si le mot est entièrement effacé, on passe au mot suivant
            if (currentText === "") {
                setIsDeleting(false);
                setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
            }
        }

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={styles.wrapper} {...props}>
            {currentText}
            <span className={styles.cursor} aria-hidden="true" />
        </span>
    );
}