import { useState } from "react";
import SearchBar from "./shared/SearchBar";
import SearchResPop from "./shared/SearchResPop";
import Input from "./shared/Input";
import Select from "./shared/Select";
import Button from "./shared/Button";
import Popup from "./shared/Popup";
import Place from "./Place";
import { ArrowLeftRight, User, Car, X } from "lucide-react";
import api from "../api/axios";

export default function ModifReserver({
    modifInfo = {},
    onChanged = () => {},
    onClose = () => {},
    ...props
}) {
    const mapModifInfo = (info) => ({
        idreserv: info.idreserv ?? "",
        idvoit: info.matricule ?? "",
        idcli: info.idcli ?? "",
        nom: info.nom ?? "",
        place: info.place ?? "",
        datevoyage: (info["date de voyage"] ?? "").slice(0, 10),
        payement: info.payement ?? "",
        montant_avance: info["montant de l'avance"] ?? ""
    });

    const initial = mapModifInfo(modifInfo);

    const [formData, setFormData] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorCar, setErrorCar] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [changingCar, setChangingCar] = useState(false);
    const [searchResultsCar, setSearchResultsCar] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);

    // Carrousel
    const [slide, setSlide] = useState(0);
    const goTo = (i) => setSlide(Math.max(0, Math.min(1, i)));

    // Intégrité des données
    const isSlide0Valid = Boolean(formData.idvoit) && Boolean(formData.datevoyage);
    const isSlide1Valid = Boolean(formData.place);
    const isAllValid = isSlide0Valid && isSlide1Valid;

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
            place: ""
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

    const handleNext = () => {
        if (slide === 0) {
            if (!isSlide0Valid) {
                setError("Veuillez sélectionner une voiture et une date de voyage.");
                return;
            }
            setError("");
            goTo(1);
            return;
        }

        // slide === 1 => bouton "Modifier"
        submitF();
    };

    const handlePrev = () => {
        setError("");
        goTo(slide - 1);
    };

    const submitF = async () => {
        if (!isAllValid) {
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
    const payNow = async () => {
        setLoading(true);
        setError("");

        const payload = {
            idvoit: formData.idvoit,
            place: formData.place,
            datevoyage: formData.datevoyage,
            payement: "Tout payé",
            montant_avance: formData.montant_avance || 0
        };

        try {
            await api.put(`/reservation/${formData.idreserv}`, payload);
            setFormData({ ...formData, payement: "Tout payé" });
            onChanged();
        } catch (err) {
            console.error("Erreur lors du paiement:", err);
            setError(err.response?.data?.message || "Impossible de mettre à jour le paiement.");
        } finally {
            setLoading(false);
        }
    };

    const nextDisabled = slide === 0 ? !isSlide0Valid : (!isAllValid || loading);

    return (
        <div className="flex items-center justify-center flex-col p-5" {...props}>
            
            <div className="bg-white px-10 py-5 rounded-xl w-xl relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary/70 hover:text-secondary"
                >
                    <X className="w-5 h-5" />
                </button>

                <h1 className="text-primary text-2xl">Modifier la réservation {formData.idreserv}</h1>

                <div className="overflow-hidden mt-5">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${slide * 100}%)` }}
                    >
                        {/* Slide 1 : infos client / voiture / date */}
                        <div className="w-full flex-shrink-0 flex flex-col gap-4 pr-1">
                        {formData.payement !== "Tout payé" ? (
                            <Button
                                type="button"
                                disabled={loading}
                                onClick={payNow}
                                label={loading ? "Envoi..." : "Payer"} />
                        ) : (
                            <div className="bg-secondary-light p-3 rounded-lg text-text">
                                <p>Payé</p>
                            </div>
                        )}

                            <div className="flex w-full gap-5 items-center justify-between">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <div className="bg-secondary/15 p-1.5 w-8 h-8 flex items-center justify-center rounded-full text-secondary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <p>{formData.nom}</p>
                                </div>

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
                        </div>

                        {/* Slide 2 : Place */}
                        <div className="w-full flex-shrink-0 pl-1">
                        {formData.idvoit && (
                            <Place
                                idVoit={formData.idvoit}
                                selectedPlace={formData.place}
                                onSelectPlace={(placeNum) => setFormData({ ...formData, place: placeNum })}
                            />
                        )}
                        </div>
                    </div>
                </div>

                {/* Navigation carrousel (dots) */}
                <div className="flex items-center justify-center gap-2 mt-3">
                    {[0, 1].map((i) => (
                        <span
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                slide === i ? "bg-secondary" : "bg-secondary/30"
                            }`}
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-red-500 text-sm font-medium mt-3 animate-pulse text-center">
                        {error}
                    </p>
                )}

                <div className="flex items-center justify-end gap-5 mt-5">
                    <Button
                        label={"Prev"}
                        type="button"
                        full={false}
                        disabled={slide === 0}
                        onClick={handlePrev}
                    />
                    <Button
                        label={slide === 1 ? (loading ? "Envoi..." : "Modifier") : "Suivant"}
                        type="button"
                        disabled={nextDisabled}
                        onClick={handleNext}
                    />
                </div>
            </div>
        </div>
    );
}