import { Pen, Trash, X } from "lucide-react";
import SearcBar from "./shared/SearchBar";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "./shared/Popup";
import AddCli from "./Add/AddCli";
import AddVoit from './Add/AddVoit'
import ModifReserver from "./ModifReserver";
import Select from "./shared/Select";

export default function List() {
    const [clients, setClients] = useState([]);
    const { type } = useParams();
    const navigate = useNavigate()

    //popup
    const [popupState, setPopupState] = useState("idle");
    const [popMess, setpopMess] = useState('');
    const [idToDelete, setIdToDelete] = useState(null);

    const [popType, setPopType]= useState("none")
    const [dataSend, setdataSend] = useState({})
    const [options, setOptions] = useState("")

    const fetchClients = async (currentType) => {
        try {
            let res;
            switch (currentType) {
                case "reservation":
                    res = await api.get('/reservation');
                    break;
                case "voiture":
                    res = await api.get('/voiture');
                    break;
                default:
                    res = await api.get('/client');
                    break;
            }
            return res.data;
        } catch (error) {
            console.error("Erreur lors de la récupération :", error.message);
        }
    };

    const getClients = async () => {
        const data = await fetchClients();
        if (data) {
            setClients(data);
        }
    };
    useEffect(() => {
        let cancelled = false;
    
        setClients([]);       // efface l'ancien affichage immédiatement, plus de résidu visible
        setPopType("none");
        setdataSend({});
    
        (async () => {
            const data = await fetchClients(type);
            if (!cancelled && data) {
                setClients(data);
            }
        })();
    
        return () => { cancelled = true; };
    }, [type]);
    
    const keys = clients && clients.length > 0 
        ? Object.keys(clients[0]).filter(key => key !== 'idcli' )
        : [];

    // Étape 1 : L'utilisateur clique sur la corbeille -> On ouvre la confirmation
    const confirm = (id) => {
        setIdToDelete(id);
        setpopMess("Êtes-vous sûr de vouloir supprimer cet élément ?");
        setPopupState("confirm");
    };

    // Étape 2 : L'utilisateur confirme -> On lance la requête API puis on montre le succès
    const deleteElem = async () => {
        console.log(idToDelete);
        
        if (!idToDelete) return;
        
        try {
            switch (type) {
                case "reservation":
                    await api.delete(`/reservation/${idToDelete}`);
                    break;
                case "voiture":
                    await api.delete(`/voiture/${idToDelete}`);
                    break;
                default:
                    await api.delete(`/client/${idToDelete}`);
                    break;
            }
            
            // Rafraîchir la liste localement après suppression
            setClients(prev => prev.filter(client => {
                const currentId = type === "reservation" ? client.idreserv : type === "voiture" ? client.matricule : client.idcli;
                return currentId !== idToDelete;
            }));

            // Passer à la popup de succès
            setpopMess("L'élément a été supprimé avec succès !");
            setPopupState("success");
        } catch (error) {
            console.log("Error " + error);
            setPopupState("idle");
        } finally {
            setIdToDelete(null);
        }
    };
    
    const modif = (clientInfo) => {
        setPopType(type || "client");
    
        const formattedData = { ...clientInfo };
    
        if (formattedData["numéro de télephone"]) {
            formattedData.numtel = formattedData["numéro de télephone"];
            delete formattedData["numéro de télephone"];
        }
    
        setdataSend(formattedData);
    };

    // Call search api
    const searchApi = async (id)=>{
        try {
            let res = await api.get(`/client/search?term=${id}`);
            return res.data
        } catch (error) {
            console.log("Erreur "+ error);
            return []; // Renvoie un tableau vide pour éviter les crashs en cas d'erreur
        }
    }

    const search = async (query) => {
        if (!query.trim()) {
            const data = await fetchClients(type);
            if (data) setClients(data);
            return;
        }
        const data = await searchApi(query);
        if (data) setClients(data);
    }
    
    const closePopUp = (mess) => {
        setPopType("none");
        setpopMess(mess);
        setPopupState("success");
        fetchClients(type).then(data => data && setClients(data));
    }

    const redirectIt = (client)=>{
        switch (type) {
            case "reservation":
                navigate(`/info-reservation/${client.idreserv}`)
                break;
            case "voiture":
                navigate(`/info-voiture/${client.matricule}`)
                break;
            default:
                break;
        }
    }

    const filtrApi = async (id)=>{
        try {
            let res = await api.get(`/reservation?type=${id}`);
            setClients(res.data)
            return res.data
        } catch (error) {
            console.log("Erreur "+ error);
            return []; 
        }
    }

    const filtrer = (val)=>{
        setOptions(val)
        const data = filtrApi(val) // Utilise directement 'val' au lieu de 'options'
    }


    return (
        <div className="p-5 px-10">
            {/* Affichage du bon composant de modification selon la route */}
            {
                popType === "client" &&
                <div className="flex items-center justify-center bg-black/30 w-full h-full absolute top-0 left-0 z-50">
                    <button onClick={()=>{setPopType("none")}}
                        className="absolute mb-[230px] ml-[240px]">
                         <X className="opacity-50 hover:text-primary-light hover:opacity-100 hover:scale-150 transition"/> 
                    </button>
                    <AddCli modifInfo={dataSend}
                     modif={true}
                     onChanged={()=>closePopUp("Client modifié")}/>
                </div>
            }
            {
                popType === "voiture" &&
                <div className="flex items-center justify-center bg-black/30 w-full h-full absolute top-0 left-0 z-50">
                    <button onClick={()=>{setPopType("none")}}
                        className="absolute mb-[290px] ml-[390px]">
                         <X className="opacity-50 hover:text-primary-light hover:opacity-100 hover:scale-150 transition"/> 
                    </button>
                    <AddVoit modifInfo={dataSend}
                     modif={true}
                     onChanged={()=>closePopUp("Voiture modifié")}
                     />
                </div>
            }
            {
                popType === "reservation" &&
                <div className="flex items-center justify-center bg-black/30 w-full h-full absolute top-0 left-0 z-50 overflow-scroll pt-5">
                    <button onClick={()=>{setPopType("none")}}
                        className="absolute mb-[230px] ml-[240px]">
                         <X className="opacity-50 hover:text-primary-light hover:opacity-100 hover:scale-150 transition"/> 
                    </button>
                    <ModifReserver
                    modifInfo={dataSend}
                    onChanged={() => closePopUp("Réservation modifiée")}
                    onClose={()=>setPopType("none")}
                    />
                </div>
            }

            {/* Popup de Confirmation */}
            <Popup 
                isOpen={popupState === "confirm"}
                onClose={() => setPopupState("idle")}
                onConfirm={deleteElem}
                title="Confirmer la suppression"
            >
                <p>{popMess}</p>
            </Popup>

            {/* Popup de Succès */}
            <Popup 
                isOpen={popupState === "success"}
                onClose={() => setPopupState("idle")}
                onConfirm={() => setPopupState("idle")} 
                title="Action réussie"
                confirmOnly={true}
            >
                <p>{popMess}</p>
            </Popup>

            <div className="grid grid-cols-[1fr_250px] items-center">
                <p className="text-primary text-2xl ">Liste des {type || "client"}s</p>
                {
                    type == "reservation" &&
                    <Select 
                        options={["Aucun filtre","Tout payé", "Sans avance", "Avec avance"]}
                        label="Genre de payement du client"
                        value={options} 
                        onChange={(e)=>filtrer(e.target.value)} 
                        name="payement"
                    />
                }
            </div>

            {(!type || type === "client") && (
                <div>
                    <SearcBar onSearch={search}/>
                    <p className="text-text-secondary">{clients.length} éléments trouvés</p>
                </div>
            )}

            <table className="w-full mt-5 **:font-normal" >
                {/* Table header */}
                <thead className="bg-primary text-text
                  [&_th]:p-2 [&_>_th]:px-5
                  [&_th]:first:rounded-tl-xl
                  [&_th]:last:rounded-tr-xl
                  [&_th]:first:pl-5"
                 >
                    <tr>
                        {keys.map((titre, index) => (
                            <th className="capitalize text-left" key={index}>{titre}</th>
                        ))}
                        <th className="bg-secondary w-20.5"></th>
                    </tr>
                </thead>

                {/* table body */}
                <tbody className="[&_td]:p-2 [&_>_td]:text-text-secondary
                [&_tr]:even:bg-primary-light/30
                [&_tr]:even:text-text-secondary/95
                [&_tr]:hover:bg-primary transition
                [&_tr]:hover:text-text
                [&_td]:first:pl-5">
                    {clients.map((client, index) => {
                        let idValue;
                        switch (type) {
                            case "reservation":
                                idValue = client.idreserv;
                                break;
                            case "voiture":
                                idValue = client.matricule;
                                break;
                            default:
                                idValue = client.idcli;
                                break;
                        }

                        const isEven = index % 2 === 0;
                        const animationClass = isEven ? "animate-slide-from-left" : "animate-slide-from-right";

                        return (
                            <tr 
                                key={idValue || index} 
                                onClick={() => redirectIt(client)} 
                                className={`cursor-pointer ${animationClass}`}
                                style={{
                                    animationDelay: `${index * 60}ms`,
                                    animationFillMode: 'backwards' 
                                }}
                            >
                                {keys.map((key) => (
                                    <td key={key}>{client[key]}</td>
                                ))}
                                <td className="flex justify-between px-2 bg-primary-light/5" onClick={(e) => e.stopPropagation()}>
                                    <button type="button" className="opacity-60 hover:opacity-100" onClick={() => modif(client)}>
                                        <Pen className="hover:text-secondary" /> 
                                    </button>
                                    <button type="button" className="opacity-60 hover:opacity-100" onClick={() => confirm(idValue)}>
                                        <Trash className="hover:text-red-500" /> 
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}