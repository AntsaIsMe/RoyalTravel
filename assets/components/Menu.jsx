import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Dropdown from "./shared/Dropdown"
import { useState } from "react"
export default function Menu() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState('')

    const clicked = (link, el) => {
        navigate(link);
        setSelected(el)
    }
    return (
        <div className={`text-text flex items-center gap-5 
        [&_>_div]:cursor-pointer`}>
            {/* <div onClick={()=>clicked('/info-reservation')}>
                infoReserver
            </div> */}

            <Dropdown 
            position="left"
            trigger={
                <button className={`px-4 py-2 bg-primary text-white rounded-lg 
                    ${selected == "list" ? "bg-secondary" : ""}`}>Lister</button>
            }
            >
                <div className="flex flex-col gap-1 *:text-primary *:py-1 *:hover:bg-secondary transition-colors *:hover:text-text">
                    <button onClick={()=>clicked('/', "list")}>
                        Client
                    </button>
                    <button onClick={()=>clicked('/voiture', "list")}>
                        Voiture
                    </button>
                    <button onClick={()=>clicked('/reservation', "list")}>
                        Reservation
                    </button>
                </div>
            </Dropdown>
            
            <Dropdown 
            position="left"
            trigger={
                <button className={`px-4 py-2 bg-primary text-white rounded-lg 
                    ${selected == "add" ? "bg-secondary" : ""}`}>Ajouter</button>
            }
            >
                <div className="flex flex-col gap-1 *:text-primary *:py-1 *:hover:bg-secondary transition-colors *:hover:text-text">
                    <button onClick={()=>clicked('/add-client', "add")}>
                        Client
                    </button>
                    <button onClick={()=>clicked('/add-voiture', "add")}>
                        Voiture
                    </button>
                    <button onClick={()=>clicked('/add-reservation', "add")}>
                        Reservation
                    </button>
                </div>
            </Dropdown>
            <div onClick={()=>clicked('/recette')}>
                Recette
            </div>
            <div className="flex bg-secondary rounded-lg text-text-secondary p-2"
            onClick={()=>clicked('/add-reservation')}>
                <Plus/> Reservation
            </div>
        </div>
    )
}