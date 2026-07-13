import { LifeBuoy } from "lucide-react"
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Place({ idVoit, onSelectPlace = ()=>{} }) {
    const [places, setPlaces] = useState([]);
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(true);

    // Appel de l'API au chargement ou quand idVoit change
    useEffect(() => {
        if (!idVoit) return;
        
        setLoading(true);
        // encodeURIComponent sécurise l'URL si l'identifiant contient des caractères spéciaux
        api.get(`/place/voiture/${encodeURIComponent(idVoit)}`)
            .then((res) => {
                // Avec Axios, les données se trouvent directement dans res.data
                const data = res.data;
                const placesArray = Array.isArray(data) ? data : (data ? [data] : []);
                setPlaces(placesArray);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des places:", err);
                setPlaces([]);
                setLoading(false);
            });
    }, [idVoit]);

    const style1 = "grid-cols-3";
    const style2 = "grid-cols-4";
    let style;
    
    console.log(places, idVoit);
    
    let len = places.length - 2;
    if (len % 3 === 0) {
        style = style1;
    } else {
        style = style2;
    }

    const selectP = (placeNum) => {
        setSelected(placeNum);
        if (onSelectPlace) {
            onSelectPlace(placeNum); // Envoi au parent
        }
    };

    if (loading) {
        return <div className="text-center p-4">Chargement des places...</div>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`
                grid w-fit
                [&_>_div]:m-2
                ${style}
            `}>
                <div className={`text-center p-2 w-10 rounded-lg bg-primary-light text-text cursor-not-allowed 
                    ${!(len % 3 === 0) ? "col-span-2" : ""}`}>
                    <LifeBuoy/>
                </div>
                
                {places.map((item, index) => (
                    <div 
                        key={index} 
                        className={`text-center p-2 w-10 rounded-lg
                            ${selected === item.place ? "bg-secondary text-text" : ""}
                            ${item.occupation ? "bg-primary-light text-text cursor-not-allowed" :
                            "bg-primary-light/10 hover:bg-secondary-light active:bg-primary hover:text-text cursor-pointer"
                            }
                        `}
                        onClick={() => {
                            if (!item.occupation) {
                                selectP(item.place);
                            }
                        }}
                    > 
                        {item.place} 
                    </div>
                ))}
            </div>
        </div>
    );
}