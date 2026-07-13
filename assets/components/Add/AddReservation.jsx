import { useState } from "react";
import SearchBar from "../shared/SearchBar";
import api from "../../api/axios";
import SearchResPop from "../shared/SearchResPop";
import Input from "../shared/Input";
import Select from "../shared/Select";
import Button from "../shared/Button";
import Place from "../Place";
import { ArrowLeftRight, Pen, User, Car } from "lucide-react"; // Ajout de Car pour l'esthétique

export default function AddReservation(params) {

    const initial = {
        idcli : 0,
        place: "",
        payement: "",
        montant_avance: "",
        destination: "", 
        idvoit: 0,
    };
    const [formData, setFormData] = useState(initial);
    const [error, setError] = useState("");
    const [errorCar, setErrorCar] = useState(""); // Erreur séparée pour éviter les conflits de messages
    const [loading, setLoading] = useState(false);
    
    const [searchResults, setSearchResults] = useState([]); 
    const [selectedClient, setSelectedClient] = useState(null);

    const [searchResultsCar, setSearchResultsCar] = useState([]); 
    const [selectedCar, setSelectedCar] = useState(null);

    const searchCli = async (searchValue) => {
        if (!searchValue.trim()) return;
        setError("");
        setSearchResults([]); 

        try {
            const res = await api.get(`/client/search?term=${searchValue}`);
            const data = res.data;

            const clientsFound = Array.isArray(data) ? data : (data ? [data] : []);

            if (clientsFound.length > 0) {
                setSearchResults(clientsFound);
            } else {
                setError("Aucun client trouvé.");
            }
        } catch (err) {
            console.error("Erreur recherche client:", err);
            setError("Impossible de trouver le client.");
        }
    };

    // Modification pour cibler la route voiture
    const searchCar = async (searchValue) => {
        if (!searchValue.trim()) return;
        setErrorCar("");
        setSearchResultsCar([]); 

        try {
            const res = await api.get(`/voiture/search?term=${searchValue}`); 
            const data = res.data;

            const carsFound = Array.isArray(data) ? data : (data ? [data] : []);

            if (carsFound.length > 0) {
                setSearchResultsCar(carsFound);
                console.log(carsFound);
            } else {
                setErrorCar("Aucune voiture trouvée.");
            }
        } catch (err) {
            console.error("Erreur recherche voiture:", err);
            setErrorCar("Impossible de trouver la voiture.");
        }
    };

    const onSelectClient = (client) => {
        setFormData({
            ...formData,
            idcli: client.idcli
        });
        setSelectedClient(client);
        setSearchResults([]);
    };

    // Fonction de sélection de la voiture ajoutée
    const onSelectCar = (car) => {
        setFormData({
            ...formData,
            idvoit: car.idvoit || car.matricule // Ajuste selon la clé d'ID unique de ton objet voiture
        });
        setSelectedCar(car);
        setSearchResultsCar([]);
    };
    
    const changeVal = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const reset = (e) => {
        e.preventDefault();
        setFormData(initial);
        setSelectedClient(null);
        setSelectedCar(null);
        setSearchResults([]);
        setSearchResultsCar([]);
        setError("");
        setErrorCar("");
    };


    const submitF = async (e) => {
        e.preventDefault();
        
        console.log(formData);
        
        // Petite validation de sécurité avant d'envoyer
        if (!formData.idcli || !formData.idvoit || !formData.place) {
            setError("Veuillez sélectionner un client, une voiture et une place.");
            return;
        }
    
        setLoading(true);
        setError("");
    
        try {
            // Remplacez '/reservation' par le endpoint exact de votre API Symfony
            const res = await api.post("/reservation", formData); 
            
            console.log("Réservation réussie :", res.data);
            alert("Réservation ajoutée avec succès !");
            
            // Réinitialise le formulaire après succès
            reset(e); 
        } catch (err) {
            console.error("Erreur lors de l'ajout de la réservation:", err);
            setError("Impossible d'enregistrer la réservation. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex items-center justify-center flex-col p-5 ">
            <div className="bg-white px-10 py-5 rounded-xl w-xl">
                <h1 className="text-primary text-2xl">Effectuer une reservation</h1>
                <div className="caroussel">
                    <div className="c1">
                        {/* Client et voiture */}
    
                        <div className="flex flex-col justify-center items-center gap-4">
                    
                            {/* Client */}
                            <div className="w-full">
                                {formData.idcli ? 
                                    <div className="flex items-center gap-3">
                                        <div className="my-2 flex items-center justify-center gap-2">
                                            <div className="bg-secondary p-1.5 w-8 h-8 flex items-center justify-center rounded-full text-text">
                                                <User/>
                                            </div>
                                            <p>{selectedClient ? `${selectedClient.nom} (${selectedClient.numtel})` : formData.idcli}</p>
                                        </div>
                                        <button 
                                            type="button"
                                            className="text-x underline"
                                            onClick={() => { setFormData({...formData, idcli: 0}); setSelectedClient(null); }}
                                        >
                                            <ArrowLeftRight className="hover:text-secondary w-4 text-text-secondary/90"/>
                                        </button>
                                    </div>
                                    : 
                                    <div className="relative w-full">
                                        <label className="text-sm font-medium text-text-secondary">Rechercher un client</label>
                                        <SearchBar onSearch={searchCli}/>
                                        {error && <p className="text-xs text-red-500">{error}</p>}
    
                                        {/* Resultat recherche */}
                                        {searchResults.length > 0 && (
                                            <SearchResPop 
                                                results={searchResults} 
                                                onSelect={onSelectClient} 
                                            />
                                        )}
                                    </div>
                                }
                            </div>
    
                            {/* Voiture */}
                            <div className="w-full">
                                {formData.idvoit ? 
                                    <div className="flex items-center gap-3">
                                        <div className="my-2 flex items-center justify-center gap-2">
                                            <div className="bg-secondary p-1.5 w-8 h-8 flex items-center justify-center rounded-full text-text">
                                                <Car/>
                                            </div>
                                            <p>{selectedCar ? `${selectedCar.idvoit} - ${selectedCar.design}` : formData.idvoit}</p>
                                        </div>
                                        <button 
                                            type="button"
                                            className="text-x underline"
                                            onClick={() => { setFormData({...formData, idvoit: 0}); setSelectedCar(null); }}
                                        >
                                            <ArrowLeftRight className="hover:text-secondary w-4 text-text-secondary/90"/>
                                        </button>
                                    </div>
                                    : 
                                    <div className="relative w-full">
                                        <label className="text-sm font-medium text-text-secondary">Rechercher une voiture</label>
                                        <SearchBar onSearch={searchCar}/>
                                        {errorCar && <p className="text-xs text-red-500 mt-1">{errorCar}</p>}
    
                                        {/* Resultat recherche */}
                                        {searchResultsCar.length > 0 && (
                                            <SearchResPop 
                                                results={searchResultsCar} 
                                                onSelect={onSelectCar} 
                                            />
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
    
                        {
                            formData.idvoit != 0 &&
                            <Place 
                                idVoit={formData.idvoit} 
                                onSelectPlace={(placeNum) => { setFormData({...formData, place: placeNum}) }}
                            />
                        }
                        <Input 
                            white={true}
                            label="Destination" 
                            name="destination"
                            type="text" 
                            value={formData.destination} 
                            onChange={changeVal} 
                        />
                        <Select 
                                options={["Tout payé", "Sans avance", "Avec avance"]}
                                label="Type de payement"
                                value={formData.payement} 
                                onChange={changeVal} 
                                name="payement"
                        />
                        {formData.payement == "Avec avance" &&
                            <Input 
                                label="Montant de l'avance" 
                                name="montant_avance"
                                type="number" 
                                value={formData.montant_avance} 
                                onChange={changeVal} 
                            />
                        }
                    </div>
                </div>
                <div className="flex items-center justify-end gap-5 mt-5">
                    <Button 
                        label={"Annuler"} 
                        type="button" 
                        full={false}
                        disabled={loading}
                        onClick={reset}
                    />
                    <Button 
                        label={loading ? "Envoi..." : "Ajouter"} 
                        type="button" 
                        disabled={loading}
                        onClick={submitF} // Déclenchement manuel direct au clic
                    />
                </div>
            </div>
        </div>
    );
}