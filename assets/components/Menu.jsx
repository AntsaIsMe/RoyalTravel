import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Dropdown from "./shared/Dropdown"
import { useState } from "react"

export default function Menu() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState('')

    // Ajout d'un paramètre optionnel "close" pour fermer le dropdown concerné
    const clicked = (link, el, closeFn) => {
        navigate(link);
        if (el) setSelected(el);
        if (closeFn) closeFn();
    }

    return (
        <div className="text-text flex items-center gap-5 [&_>_div]:cursor-pointer">
            
            <Dropdown 
                position="left"
                trigger={
                    <button className={`px-4 py-2 bg-primary text-white rounded-lg 
                        ${selected === "list" ? "bg-secondary" : ""}`}>Lister</button>
                }
            >
                {({ close }) => (
                    <div className="flex flex-col gap-1 *:text-primary *:py-1 *:hover:bg-secondary transition-colors *:hover:text-text">
                        <button onClick={() => clicked('/', "list", close)}>
                            Client
                        </button>
                        <button onClick={() => clicked('/voiture', "list", close)}>
                            Voiture
                        </button>
                        <button onClick={() => clicked('/reservation', "list", close)}>
                            Reservation
                        </button>
                    </div>
                )}
            </Dropdown>
            
            <Dropdown 
                position="left"
                trigger={
                    <button className={`px-4 py-2 bg-primary text-white rounded-lg 
                        ${selected === "add" ? "bg-secondary" : ""}`}>Ajouter</button>
                }
            >
                {({ close }) => (
                    <div className="flex flex-col gap-1 *:text-primary *:py-1 *:hover:bg-secondary transition-colors *:hover:text-text">
                        <button onClick={() => clicked('/add-client', "add", close)}>
                            Client
                        </button>
                        <button onClick={() => clicked('/add-voiture', "add", close)}>
                            Voiture
                        </button>
                        <button onClick={() => clicked('/add-reservation', "add", close)}>
                            Reservation
                        </button>
                    </div>
                )}
            </Dropdown>

            <div onClick={() => clicked('/recette')}>
                Recette
            </div>
            
            <div className="flex bg-secondary rounded-lg text-text-secondary p-2"
                 onClick={() => clicked('/add-reservation')}>
                <Plus className="mr-1" /> Reservation
            </div>
        </div>
    )
}