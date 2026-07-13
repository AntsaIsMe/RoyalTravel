export const numFormat = (value) => {
    if (!value) return "";
    
    // Détecte si l'utilisateur a tapé un "+" au tout début
    const hasPlus = value.toString().trim().startsWith("+");
    
    // Extrait uniquement les chiffres
    let cleanValue = value.toString().replace(/\D/g, "");
    
    if (hasPlus) {
        // Format International : +2xx xx xx xxx xx (12 chiffres max avec l'indicatif)
        cleanValue = cleanValue.slice(0, 12);
        
        return "+" + cleanValue.replace(
            /^(\d{1,3})(\d{0,2})(\d{0,2})(\d{0,3})(\d{0,2})$/,
            (match, p1, p2, p3, p4, p5) => {
                let res = p1; // L'indicatif (ex: 261)
                if (p2) res += " " + p2;
                if (p3) res += " " + p3;
                if (p4) res += " " + p4;
                if (p5) res += " " + p5;
                return res;
            }
        );
    } else {
        // Format Local : xxx xx xxx xx (11 chiffres max pour le cas du "03...")
        cleanValue = cleanValue.slice(0, 11);
        
        return cleanValue.replace(
            /^(\d{1,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,1})$/,
            (match, p1, p2, p3, p4, p5) => {
                let res = p1;
                if (p2) res += " " + p2;
                if (p3) res += " " + p3;
                if (p4) res += " " + p4;
                if (p5) res += " " + p5;
                return res;
            }
        );
    }
};