import { useState } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import api from "../../api/axios";
import Select from "../shared/Select";
import Write from "../shared/Write";
import Popup from "../shared/Popup";

export default function AddVoit({
    modifInfo = {},
    modif = false,
    onChanged = () => {},
    ...props
}) {
    
    const initialState = {
        idvoit: "",
        design: "",
        nbrplace: "",
        frais: "",
        type: ""
    }

    const [formData, setFormData] = useState(
        modif ? {
            idvoit: modifInfo.matricule ?? "",
            design: modifInfo.design ?? "",
            nbrplace: modifInfo["Nombre de place"] ?? "",
            frais: modifInfo.frais ?? "",
            type: modifInfo.type ?? ""
        } : initialState
    );
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMess, setErrorMess] = useState("");

    const text = !modif ? ["Nouvelle voiture", "Ajouter une voiture"] : ["Modifier les infos", "Changer quoi ?"]

    const changeVal = (e) => {
        const { name, value } = e.target;

        if (errorMess) setErrorMess("");

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log(formData);

            if (modif) {
                console.log(modifInfo);
                
                await api.put(`/voiture/${modifInfo.matricule}`, formData);
            } else {
                await api.post('/voiture', formData);
            }

            onChanged();
            setShowSuccess(true);

            if (!modif) {
                setFormData(initialState); // Réinitialise seulement en mode ajout
            }
        } catch (error) {
            console.error("Erreur :", error.message);
            setErrorMess(error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    const reset = (e) => {
        e.preventDefault();
        setFormData(modif ? {
            idvoit: modifInfo.matricule ?? "",
            design: modifInfo.design ?? "",
            nbrplace: modifInfo["Nombre de place"] ?? "",
            frais: modifInfo.frais ?? "",
            type: modifInfo.type ?? ""
        } : initialState);
        setErrorMess("");
    }

    return (
        <div className="flex items-center justify-center mt-15" {...props}>
            <Popup isOpen={showSuccess} onClose={() => setShowSuccess(false)} onConfirm={() => setShowSuccess(false)} title={`${modif ? "Voiture modifiée" : "Voiture ajoutée"}`}>
                {modif ?
                    "Voiture modifiée avec succès !" :
                    "La nouvelle voiture a été enregistrée avec succès !"
                }
            </Popup>

            <form onSubmit={submit} className="p-5 max-w-md bg-white rounded-2xl px-10">
                <div className="text-center">
                    <Write className="text-2xl text-primary" words={text}/>
                </div>

                <div className="space-y-4 my-6">
                    <Input
                        white={true} 
                        label="Matricule de la voiture" 
                        name="idvoit" 
                        value={formData.idvoit} 
                        onChange={changeVal} 
                        disabled={modif}
                    />

                    <div className="grid grid-cols-2 gap-5">
                        <Input
                            white={true} 
                            label="Design" 
                            name="design" 
                            value={formData.design} 
                            onChange={changeVal} 
                        />
                        <Select 
                            options={["Simple", "Premium", "VIP"]}
                            label="Type"
                            value={formData.type} 
                            onChange={changeVal} 
                            name="type"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <Input
                            white={true} 
                            label="Nombre de place" 
                            name="nbrplace" 
                            type="number"
                            value={formData.nbrplace} 
                            onChange={changeVal} 
                        />
                        <Input
                            white={true} 
                            label="Frais" 
                            name="frais" 
                            type="number"
                            value={formData.frais} 
                            onChange={changeVal} 
                        />
                    </div>
                </div>

                {errorMess && (
                    <p className="text-red-500 text-sm font-medium -mt-2 mb-4 animate-pulse">
                        {errorMess}
                    </p>
                )}

                <div className="flex gap-5 justify-end">
                    <Button 
                        label={"Annuler"} 
                        type="button" 
                        full={false}
                        disabled={loading}
                        onClick={reset}
                    />
                    <Button 
                        label={loading ? "Envoi..." : (modif ? "Modifier" : "Ajouter")} 
                        type="submit" 
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}