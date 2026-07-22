import { Car } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Place from "../Place";

export default function VoitureInfo() {
    const initial = {
        idvoit : "",
        design: "",
        type: "",
        nbrplace: 0,
        frais: 0
    }
    const {id} = useParams();

    const [voiture, setVoiture] = useState(initial)
    
    const getInfos = async ()=>{
        try {
            const res = await api.get(`/voiture/${id}`)
            console.log(res.data);
            
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
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
  {/* Header */}
  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
    <h1 className="text-xl font-bold text-primary tracking-tight">
      Informations voiture
    </h1>
    <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
      Détails
    </span>
  </div>

  {/* ID Section */}
  <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-3 mb-4">
    <div className="text-text bg-secondary-light p-2 rounded-full">
      <Car className="w-5 h-5" />
    </div>
    <p className="font-mono px-3 py-1 text-primary">
      {voiture.idvoit}
    </p>
  </div>

  {/* Main Info */}
  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
    <p className="text-base font-medium text-gray-800">
      {voiture.design}
      <b className="ml-2 text-secondary font-semibold bg-secondary/10 px-3 py-1 rounded-full text-sm">
        {voiture.type}
      </b>
    </p>

    <p className="flex items-center gap-2 bg-primary-light px-4 py-2 rounded-lg">
      <span className="text-sm font-medium text-text">Frais :</span>
      <span className="text-base font-bold text-text">
        {voiture.frais}
      </span>
      <b className="flex items-center justify-center text-xs font-bold 
        w-[28px] h-[28px] bg-secondary text-white 
        rounded-full shadow-sm">
        Ar
      </b>
    </p>
  </div>

  {/* Places */}
  <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Places :</span>
      <span className="font-bold text-lg text-primary">
        {voiture.nbrplace}
      </span>
    </div>
    <div className="flex-1">
      <Place 
        idVoit={voiture.idvoit} 
        onSelectPlace={() => {}} 
        className="mt-1"
      />
    </div>
  </div>
        </div>
    )
}