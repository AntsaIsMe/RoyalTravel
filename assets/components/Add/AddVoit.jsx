import { useState } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import api from "../../api/axios";
import Select from "../shared/Select";
import Write from "../shared/Write";

export default function AddVoit() {
    const initialState = {
        idvoit: "",
        design: "",
        nbrplace: "",
        frais: "",
        type : ""
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const changeVal = (e) => {
        const { name, value } = e.target;
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
            const res = await api.post('/voiture', formData);
            
            console.log("Voiture ajoutée avec succès :", res.data);
            setFormData(initialState); // Réinitialise le formulaire
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error.message);
        } finally {
            setLoading(false);
        }
    };

    const reset = (e)=>{
        e.preventDefault();
        setFormData(initialState)
    }

    

    return (
        <div className="flex items-center justify-center  mt-15">
            <form onSubmit={submit} className="p-5 max-w-md bg-white/80 rounded-2xl px-10">
                <div className="text-center">
                    <Write className="text-2xl text-primary" words={["Nouvelle voiture", "Ajouter une voiture"]}/>
                </div>

                <div className="space-y-4 my-6">
                    <Input
                        white={true} 
                        label="Matricule de la voiture" 
                        name="idvoit" 
                        value={formData.idvoit} 
                        onChange={changeVal} 
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

                <div className="flex gap-5 justify-end">

                    <Button 
                        label={"Annuler"} 
                        type="reset" 
                        full={false}
                        disabled={loading}
                        onClick={reset}
                    />
                    <Button 
                        label={loading ? "Envoi..." : "Ajouter"} 
                        type="submit" 
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}