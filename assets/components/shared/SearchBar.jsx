import { useState } from "react";
import { Search } from "lucide-react";

export default function SearcBar({ onSearch, placeholder =  "Rechercher un client par nom ou numéro"}) {
    const [query, setQuery] = useState("");

    const submit = (e) => {
        e.preventDefault(); 
        if (onSearch) {
            onSearch(query);
            console.log(query);
            
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        // Décommente la ligne du dessous si tu veux une recherche instantanée sans cliquer sur la loupe
        if (onSearch) onSearch(val);
    };

    return (
        <form 
            onSubmit={submit} 
            className="flex items-center justify-center my-5 w-full mx-auto animate-slide-from-left"
        >
            <div className="flex items-center w-full rounded-lg bg-primary-light/10 border border-transparent focus-within:ring-1 focus-within:ring-primary focus-within:border-transparent transition-all">
                
                <input 
                    type="text" 
                    value={query}
                    onChange={handleChange}
                    placeholder={placeholder} 
                    className="p-2 px-3 bg-transparent outline-none w-full text-sm"
                />
                
                <button 
                    type="submit" 
                    className="group p-2 px-4 rounded-r-lg hover:bg-primary transition-colors flex items-center justify-center h-full"
                >
                    <Search className="text-primary group-hover:text-text transition-colors w-5 h-5" />
                </button>

            </div>
        </form>
    );
}