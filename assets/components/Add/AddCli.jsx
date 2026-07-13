import { useState } from "react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Write from "../shared/Write";
import api from "../../api/axios";
import Popup from "../shared/Popup";
import { numFormat } from "../shared/NumFormat"; 

export default function AddCli({
    modifInfo = {},
    modif = false,
    onChanged = ()=>{},
    ...props
}) {
    const initial = {
        nom: "",
        numtel: ""
    };
    

    
    const [formData, setFormData] = useState(modifInfo);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const [errorMess, setErrorMess] = useState("");

    const text = !modif ? ["Nouveau client", "Ajouter un client"] : ["Modifier les infos", "Changer quoi ?"]

    const changeVal = (e) => {
        const { name, value } = e.target;
        
        // Réinitialise l'erreur dès que l'utilisateur modifie les champs
        if (errorMess) setErrorMess("");

        setFormData({
            ...formData,
            [name]: name === "numtel" ? numFormat(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nom || !formData.numtel) return;

        // 1. Extraction et nettoyage du numéro (on enlève tous les espaces)
        const cleanDigits = formData.numtel.replace(/\s/g, "");

        // 2. Vérifications de sécurité et de format
        if (cleanDigits.startsWith("-") || Number(cleanDigits) < 0) {
            setErrorMess("Le numéro de téléphone ne peut pas être négatif.");
            return;
        }

        if (cleanDigits.startsWith("03")) {
            if (cleanDigits.length > 11) {
                setErrorMess("Un numéro commençant par 03 ne doit pas dépasser 11 caractères.");
                return;
            }
        } else {
            // Optionnel : Règle si le numéro ne commence pas par 03
            if (cleanDigits.length > 10) {
                setErrorMess("Le numéro de téléphone est trop long.");
                return;
            }
        }

        // 3. Préparation des données propres (numtel converti en Nombre pur)
        const dataToSend = {
            nom: formData.nom,
            numtel: Number(cleanDigits) // Envoi sous forme de type Number numérique
        };

        setLoading(true);
        try {
            if(modif){
                await api.put(`/client/${modifInfo.idcli}`, dataToSend); 
            }
            else{
                await api.post("/client", dataToSend); 
            }
            
            onChanged()
            setShowSuccess(true);
            setFormData(initial);
        } catch (error) {
            console.error("Erreur :", error.message);
            setErrorMess(error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    const reset = (e) => {
        e.preventDefault();
        setFormData(initial);
        setErrorMess("");
    };



    return (
        <div className="flex h-full items-center justify-center mt-15" {...props}>
            <Popup isOpen={showSuccess} onClose={() => setShowSuccess(false)} onConfirm={() => setShowSuccess(false)} title={`${modif ? "Client modifié" :"Client ajouté" } `}>
                {modif ? 
                "Client modifié avec succès !" :
                "Le nouveau client a été enregistré avec succès !"
                }
                
            </Popup>

            <form onSubmit={handleSubmit} className="text-center w-full max-w-[500px] p-5 px-10 rounded-2xl bg-white shadow-sm border border-gray-100">
                <Write className="text-2xl text-primary" words={text}/>
                
                <div className="my-5 *:my-10">
                    <Input 
                        label="Nom" 
                        name="nom" 
                        type="text"
                        value={formData.nom} 
                        onChange={changeVal} 
                        white={true}
                        required
                    />
                    <Input 
                        label="Numéro téléphone" 
                        name="numtel" 
                        type="text" 
                        value={formData.numtel} 
                        onChange={changeVal} 
                        white={true}
                        required
                    />
                </div>

                {/* Zone d'affichage de l'erreur de validation */}
                {errorMess && (
                    <p className="text-red-500 text-sm font-medium -mt-4 mb-4 animate-pulse">
                        {errorMess}
                    </p>
                )}

                <div className="flex gap-5 justify-end w-full mt-10">
                    <Button label={"Annuler"} type="button" full={false} disabled={loading} onClick={reset} className="text-primary" />
                    <Button label={loading ? "Envoi..." : "Ajouter"} type="submit" disabled={loading} />
                </div>
            </form>
        </div>
    );
}