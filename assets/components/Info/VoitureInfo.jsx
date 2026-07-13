import { Car } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function VoitureInfo() {
    const initial = {
        idvoit : "1862 TBE",
        design: "Crafter",
        type: "VIP",
        nbrplace: 5,
        frais: 5000
    }
    const {id} = useParams();

    const [voiture, setVoiture] = useState(initial)
    
    const getInfos = async ()=>{
        try {
            const res = await api.get(`/voiture/${id}`)
            return res.data
        } catch (error) {
            console.log("Erreur : " + error );
            
        }
    }
    useEffect(()=>{
        const getVoit = async () => {
            const data = await getInfos();
            if (data) {
                setVoiture(data);
            }
        };
        
        getVoit();
    },[])

    return(
        <div>
            <h1 className="text-xl text-primary">Informations voiture</h1>
            <div className="flex gap-2">
                <Car/>
                <p>{voiture.idvoit} </p>
            </div>
            <div className="flex gap-5">
                <p>{voiture.design} 
                    <b className="text-secondary"> {voiture.type}</b>
                </p>

                <p className="flex items-center justify-center gap-1">Frais : {voiture.frais} 
                     <b className="flex items-center justify-center text-xs 
                        w-[22px] bg-secondary
                      text-text p-1 rounded-full"> Ar</b> 
                </p>
            </div>
            <h2>Nombre de place : {voiture.nbrplace} </h2>
        </div>
    )
}