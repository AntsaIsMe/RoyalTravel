import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Car, Phone, Calendar, MapPin, ArrowDownCircle } from "lucide-react";
import api from "../../api/axios";

export default function ReservInfo() {
    const initial = {
        idreserv: "",
        idvoit: "",
        idcli: "",
        nom: "",
        numtel: "",
        place: 0,
        datereserv: "",
        datevoyage: "",
        payement: "",
        montant_avance: 0
    }

    const [reservation, setReservation] = useState(initial)
    const [loading, setLoading] = useState(true)

    const { id } = useParams();

    const getInfos = async () => {
        try {
            const res = await api.get(`/reservation/${id}`)
            console.log(res.data);
            return res.data
        } catch (error) {
            console.log("Erreur : " + error);
        }
    }

    useEffect(() => {
        const getRes = async () => {
            setLoading(true);
            const data = await getInfos();
            if (data) {
                setReservation(data);
            }
            setLoading(false);
        };

        getRes();
    }, [id])

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    }

    const payementStyle = {
        "complet": "bg-green-500/15 text-green-600",
        "total": "bg-green-500/15 text-green-600",
        "avance": "bg-yellow-500/15 text-yellow-600",
        "sans avance": "bg-red-500/15 text-red-500",
    }

    if (loading) {
        return (
            <div className="p-10 flex justify-center">
                <p className="text-text-secondary animate-pulse">Chargement...</p>
            </div>
        )
    }

    const printPdf = async () => {
        try {
            const res = await api.get(`/reservation/${id}/pdf`, {
                responseType: 'blob'
            });
    
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
    
            const link = document.createElement('a');
            link.href = url;
            link.download = `Recu_${reservation.idreserv}.pdf`;
            link.click();
    
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log("Erreur lors de la génération du PDF : " + error);
        }
    }

    return (
        <div className="p-5 px-10 max-w-2xl">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-text-secondary text-sm">Réservation</p>
                    <h1 className="text-2xl font-semibold text-primary">{reservation.idreserv}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${payementStyle[reservation.payement] || "bg-primary-light/20 text-text-secondary"}`}>
                        {reservation.payement || "N/A"}
                    </span>
                </div>
                <div className="flex items-center justify-center cursor-pointer gap-2 text-primary hover:text-secondary"
                onClick={printPdf}>
                    <ArrowDownCircle/>
                    <p className="font-semiboldbold text-lg">Generer pdf</p>
                </div>
            </div>

            {/* Carte principale */}
            <div className="rounded-2xl border border-primary-light/20 bg-primary-light/5 p-6 space-y-5">

                {/* Voiture & place */}
                <div className="flex items-center justify-between pb-4 border-b border-primary-light/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-secondary/15">
                            <Car className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <p className="text-text-secondary text-xs">Voiture</p>
                            <p className="font-medium">{reservation.idvoit}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-text-secondary text-xs">Place</p>
                        <p className="font-medium text-lg">N° {reservation.place}</p>
                    </div>
                </div>

                {/* Client */}
                <div className="flex items-center justify-between pb-4 border-b border-primary-light/20">
                    <div>
                        <p className="text-text-secondary text-xs">Client</p>
                        <p className="font-medium">{reservation.nom}</p>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{reservation.numtel || "N/A"}</span>
                    </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between pb-4 border-b border-primary-light/20">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-text-secondary" />
                        <div>
                            <p className="text-text-secondary text-xs">Réservé le</p>
                            <p className="text-sm">{formatDate(reservation.datereserv)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-text-secondary" />
                        <div className="text-right">
                            <p className="text-text-secondary text-xs">Voyage le</p>
                            <p className="text-sm">{formatDate(reservation.datevoyage)}</p>
                        </div>
                    </div>
                </div>

                {/* Montant */}
                <div className="flex items-center justify-between pt-1">
                    <p className="text-text-secondary text-sm">Avance versée</p>
                    <p className="flex items-center gap-1 text-xl font-semibold text-primary">
                        {reservation.montant_avance}
                        <span className="flex items-center justify-center text-xs
                            w-[22px] h-[22px] bg-secondary
                            text-text rounded-full"> Ar</span>
                    </p>
                </div>
            </div>
        </div>
    )
}