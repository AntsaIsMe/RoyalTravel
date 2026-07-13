import { useEffect, useState } from "react"
import api from "../api/axios";
import { DollarSign, DollarSignIcon } from "lucide-react";

export default function Recette() {
    const [recette, setRecette] = useState(0)

    const showMoney = async ()=>{
        try {
            const res = await api.get('/recette/totale')
            return res.data
        } catch (error) {
            console.log(`Erreur ${error}`);
        }
    }

    useEffect(()=>{
        const getRecette = async ()=>{
            const data = await showMoney()
            console.log(data);
            if (data) {
                
                setRecette(data.recette_totale)
            }
        }

        getRecette()
    }, [])
    return(
        <div className="p-2 mt-5">
            <h1 className="text-2xl text-primary ml-5">Tableau de bord</h1>
            <div className="flex items-center justify-between m-3 bg-primary text-text p-3 px-5 py-5 rounded-xl ">
                    <h1 className="text-xl">Recette totale : {recette} </h1>
                    <div className="rounded-full bg-secondary p-2 px-3">
                        Ar
                    </div>
            </div>
        </div>
    )
}