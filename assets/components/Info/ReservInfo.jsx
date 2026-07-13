// import { Car } from "lucide-react";

import { useParams } from "react-router-dom";

export default function ReservInfo() {
    const voiture = {
        idreserv : "R-50101AE",
        idvoit : "TP502",
        design: "Crafter",
        nom: "John",
        numtel: "505050",
        place: 2,
        datereserv: "05/02/2020",
        datevoyage: "05/03/2020",
        payement: "Avance",
        montant_avance: 2000
    }

    const {id} = useParams();

    return(
        <div>
            <h1 className="text-xl text-primary">Informations voiture</h1>
            <div className="flex gap-2">
                {/* <Car/> */}
                <p>{voiture.idreserv} </p>
            </div>
            <div className="flex gap-5">
                <p>{voiture.design} 
                    <b className="text-secondary"> {voiture.type}</b>
                </p>

                <h2>Place n° {voiture.place} </h2>
            </div>
                <p className="flex items-center justify-center gap-1">Frais : {voiture.montant_avance} 
                     <b className="flex items-center justify-center text-xs 
                        w-[22px] bg-secondary
                      text-text p-1 rounded-full"> Ar</b> 
                </p>
        </div>
    )
}