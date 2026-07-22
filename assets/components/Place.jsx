import { LifeBuoy } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Place({ idVoit, selectedPlace = null, onSelectPlace = () => {} }) {
    const [places, setPlaces] = useState([]);
    const [selected, setSelected] = useState(selectedPlace ?? 0);
    const [loading, setLoading] = useState(true);

    // Synchronise la sélection si la place déjà réservée arrive/change
    useEffect(() => {
        setSelected(selectedPlace ?? 0);
    }, [selectedPlace]);

    useEffect(() => {
        if (!idVoit) return;
        
        setLoading(true);
        api.get(`/place/voiture/${encodeURIComponent(idVoit)}`)
            .then((res) => {
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
    
    let len = places.length - 2;
    if (len % 3 === 0) {
        style = style1;
    } else {
        style = style2;
    }

    const selectP = (placeNum) => {
        setSelected(placeNum);
        if (onSelectPlace) {
            onSelectPlace(placeNum);
        }
    };

    if (loading) {
        return <div className="text-center p-4">Chargement des places...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className={`
                grid w-fit
                [&_>_div]:m-2
                ${style}
            `}>
                {/* Volant / Conducteur */}
                <div 
                    className={`text-center p-2 w-10 rounded-lg bg-primary-light text-text cursor-not-allowed animate-pop-in
                        ${!(len % 3 === 0) ? "col-span-2" : ""}`}
                    style={{ animationDelay: '0ms', animationFillMode: 'backwards' }}
                >
                    <LifeBuoy/>
                </div>
                
                {places.map((item, index) => {
                    const isSelected = selected === item.place;
                    // Occupée par une AUTRE réservation seulement
                    const isOccupiedByOthers = item.occupation === "oui" && !isSelected;

                    // Choix de l'animation : pop avec zoom arrière pour les occupées, simple apparition pour les autres
                    const animationClass = isOccupiedByOthers 
                        ? "animate-occupied-pop" 
                        : "animate-pop-in";

                    return (
                        <div 
                            key={item.place || index} 
                            className={`text-center p-2 w-10 rounded-lg ${animationClass}
                                ${isSelected ? "bg-secondary text-text" :
                                isOccupiedByOthers ? "bg-primary-light text-text cursor-not-allowed" :
                                "bg-primary-light/10 hover:bg-secondary-light active:bg-primary hover:text-text cursor-pointer"
                                }
                            `}
                            style={{ 
                                animationDelay: `${(index + 1) * 50}ms`,
                                animationFillMode: 'backwards'
                            }}
                            onClick={() => {
                                if (!isOccupiedByOthers) {
                                    selectP(item.place);
                                }
                            }}
                        > 
                            {item.place} 
                        </div>
                    );
                })}
            </div>

            <div>
                {/* Légende */}
                <div className="grid grid-cols-2 gap-5 p-5 ml-6 text-text-secondary/80 opacity-80">
                    <div className="flex items-center gap-2"> 
                        <div className="w-8 h-8 rounded-xl bg-primary-light"></div>
                        <p>: Occupé</p>
                    </div>
                    <div className="flex items-center gap-2"> 
                        <div className="w-8 h-8 rounded-xl bg-primary-light/10"></div>
                        <p>: Libre</p>
                    </div>
                </div>
            </div>
        </div>
    );
}