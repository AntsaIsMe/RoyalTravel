import { Pen, Trash } from "lucide-react";
import SearcBar from "./shared/SearchBar";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Popup from "./shared/Popup";
import AddCli from "./Add/AddCli";
import AddVoit from './Add/AddVoit'
import AddReservation from "./Add/AddReservation"

export default function List() {
    const [clients, setClients] = useState([]);
    const { type } = useParams();

    //popup
    const [popupState, setPopupState] = useState("idle");
    const [popMess, setpopMess] = useState('');
    const [idToDelete, setIdToDelete] = useState(null);

    const [popType, setPopType]= useState("none")
    const [dataSend, setdataSend] = useState({})

    const fetchClients = async () => {
        try {
            let res;
            switch (type) {
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
            return (res.data);
        } catch (error) {
            console.error("Erreur lors de la récupération :", error.message);
        }
    };

    useEffect(() => {
        const getClients = async () => {
            const data = await fetchClients();
            if (data) {
                setClients(data);
            }
        };
        getClients();
    }, [type]); 
    
    const keys = clients && clients.length > 0 
        ? Object.keys(clients[0]).filter(key => key !== 'idcli' && key !== 'idreserv')
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
                const currentId = type === "reservation" ? client.idreservation : type === "voiture" ? client.matricule : client.idcli;
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
    
    // Modification dynamique basée sur le type de la route actuelle
    const modif = (clientInfo) => {
        setPopType(type || "client");
        
        // 1. On crée une copie propre de l'objet pour ne pas modifier l'original directement
        const formattedData = { ...clientInfo };
    
        //change to numtel
        if (formattedData["numéro de télephone"]) {
            formattedData.numtel = formattedData["numéro de télephone"];
            delete formattedData["numéro de télephone"]; // On supprime l'ancienne clé devenue inutile
        }
    
        console.log(formattedData);
        
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
        // Si la barre de recherche est vidée, on recharge tous les clients
        if (!query.trim()) {
            const data = await fetchClients();
            if (data) setClients(data);
            return;
        }

        const data = await searchApi(query);
        if (data) {
            setClients(data); // Met à jour le tableau avec les résultats de recherche
        }
    }

    const closePopUp = (mess)=>{
        // console.log("Closed");
        setPopType("none")
        setpopMess(mess)
        setPopupState("success")
    }

    return (
        <div className="p-5 px-10">
            {/* Affichage du bon composant de modification selon la route */}
            {
                popType === "client" &&
                <div>
                    <AddCli modifInfo={dataSend}
                     className="absolute"
                     modif={true}
                     onChanged={()=>closePopUp("Client modifié")}/>
                </div>
            }
            {
                popType === "voiture" &&
                <div>
                    <AddVoit modifInfo={dataSend}
                     className="absolute"
                     modif={true}
                     />
                </div>
            }
            {
                popType === "reservation" &&
                <AddReservation modifInfo={dataSend}
                className="absolute"
                modif={true}
                />
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

            <p className="text-primary text-2xl ">Liste des {type || "client"}s</p>
            <h1></h1>

            {/* La SearchBar s'affiche UNIQUEMENT si on est sur la route des clients */}
            {(!type || type === "client") && (
                <div>
                    <SearcBar onSearch={search}/>
                    <p className="text-text-secondary">{clients.length} éléments trouvés</p>
                </div>
            )}

            <table className="w-full mt-5 **:font-normal" >
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

                        return (
                            <tr key={idValue || index}>
                                {keys.map((key) => (
                                    <td key={key}>{client[key]}</td>
                                ))}
                                <td className="flex justify-between px-2 bg-primary-light/5">
                                    <button className="opacity-60 hover:opacity-100">
                                        <Pen className="hover:text-secondary" onClick={() => modif(client)} /> 
                                    </button>
                                    <button className="opacity-60 hover:opacity-100">
                                        <Trash className="hover:text-red-500" onClick={() => confirm(idValue)} /> 
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