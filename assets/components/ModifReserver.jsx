import { useState } from "react";
import SearchBar from "./shared/SearchBar";
import SearchResPop from "./shared/SearchResPop";
import Input from "./shared/Input";
import Select from "./shared/Select";
import Button from "./shared/Button";
import Popup from "./shared/Popup";
import Place from "./Place";
import { ArrowLeftRight, User, Car } from "lucide-react";
import api from "../api/axios";

export default function ModifReserver({
    modifInfo = {},
    onChanged = () => {},
    ...props
}) {
    const mapModifInfo = (info) => ({
        idreserv: info.idreserv ?? "",
        idvoit: info.matricule ?? "",
        idcli: info.idcli ?? "",
        nom: info.nom ?? "",
        place: info.place ?? "",
        datevoyage: (info["date de voyage"] ?? "").slice(0, 10), // format YYYY-MM-DD pour <input type="date">
        payement: info.payement ?? "",
        montant_avance: info["montant de l'avance"] ?? ""
    });

    console.log(modifInfo, mapModifInfo);
    

    const initial = mapModifInfo(modifInfo);

    const [formData, setFormData] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorCar, setErrorCar] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    // La voiture ne change que si l'utilisateur choisit d'en chercher une autre
    const [changingCar, setChangingCar] = useState(false);
    const [searchResultsCar, setSearchResultsCar] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);

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
            } else {
                setErrorCar("Aucune voiture trouvée.");
            }
        } catch (err) {
            console.error("Erreur recherche voiture:", err);
            setErrorCar("Impossible de trouver la voiture.");
        }
    };

    const onSelectCar = (car) => {
        setFormData({
            ...formData,
            idvoit: car.idvoit || car.matricule,
            place: "" // On force à re-choisir une place sur la nouvelle voiture
        });
        setSelectedCar(car);
        setSearchResultsCar([]);
        setChangingCar(false);
    };

    const changeVal = (e) => {
        const { name, value } = e.target;
        if (error) setError("");
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const reset = (e) => {
        e.preventDefault();
        setFormData(initial);
        setSelectedCar(null);
        setChangingCar(false);
        setSearchResultsCar([]);
        setError("");
        setErrorCar("");
    };

    const submitF = async (e) => {
        e.preventDefault();

        if (!formData.idvoit || !formData.place) {
            setError("Veuillez sélectionner une voiture et une place.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const payload = {
                idvoit: formData.idvoit,
                place: formData.place,
                datevoyage: formData.datevoyage,
                payement: formData.payement,
                montant_avance: formData.montant_avance || 0
            };

            await api.put(`/reservation/${formData.idreserv}`, payload);

            onChanged();
            setShowSuccess(true);
        } catch (err) {
            console.error("Erreur lors de la modification de la réservation:", err);
            setError(err.response?.data?.message || "Impossible de modifier la réservation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center flex-col p-5" {...props}>
            <div className="bg-white px-10 py-5 rounded-xl w-xl">
                <h1 className="text-primary text-2xl">Modifier la réservation {formData.idreserv}</h1>

                <div className="flex flex-col gap-4 mt-5">
                    {formData.payement == "Tout payé" ? (
                        <Button 
                        onClick={()=>{setFormData({...formData, payement: "Tout payé"})}}
                        label={"Payer"}/>
                        ) : (
                            <div className="bg-secondary-light p-3 rounded-lg text-text">
                                <p>Payé</p>
                            </div>
                        )}

                    <div className="flex w-full gap-5 items-center justify-between">
                        {/* Client : lecture seule, pas modifiable côté API */}
                        <div className="flex items-center gap-2 text-text-secondary">
                            <div className="bg-secondary/15 p-1.5 w-8 h-8 flex items-center justify-center rounded-full text-secondary">
                                <User className="w-4 h-4" />
                            </div>
                            <p>{formData.nom}</p>
                        </div>

                        {/* Voiture */}
                        <div>
                            {!changingCar ? (
                                <div className="flex items-center gap-3">
                                    <div className="my-2 flex items-center justify-center gap-2">
                                        <div className="bg-secondary p-1.5 w-8 h-8 flex items-center justify-center rounded-full text-text">
                                            <Car className="w-4 h-4" />
                                        </div>
                                        <p>{selectedCar ? `${selectedCar.idvoit} - ${selectedCar.design}` : formData.idvoit}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setChangingCar(true)}
                                    >
                                        <ArrowLeftRight className="hover:text-secondary w-4 text-text-secondary/90" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative w-full">
                                    <label className="text-sm font-medium text-text-secondary">Rechercher une voiture</label>
                                    <SearchBar onSearch={searchCar} />
                                    {errorCar && <p className="text-xs text-red-500 mt-1">{errorCar}</p>}

                                    {searchResultsCar.length > 0 && (
                                        <SearchResPop
                                            results={searchResultsCar}
                                            onSelect={onSelectCar}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Input
                        white={true}
                        label="Date de voyage"
                        name="datevoyage"
                        type="date"
                        value={formData.datevoyage}
                        onChange={changeVal}
                    />

                    {/* Place : rechargée si la voiture change */}
                    {formData.idvoit && (
                        <Place
                            idVoit={formData.idvoit}
                            onSelectPlace={(placeNum) => setFormData({ ...formData, place: placeNum })}
                        />
                    )}
                    
                </div>

                {error && (
                    <p className="text-red-500 text-sm font-medium mt-3 animate-pulse">
                        {error}
                    </p>
                )}

                <div className="flex items-center justify-end gap-5 mt-5">
                    <Button
                        label={"Annuler"}
                        type="button"
                        full={false}
                        disabled={loading}
                        onClick={reset}
                    />
                    <Button
                        label={loading ? "Envoi..." : "Modifier"}
                        type="button"
                        disabled={loading}
                        onClick={submitF}
                    />
                </div>
            </div>
        </div>
    );
}