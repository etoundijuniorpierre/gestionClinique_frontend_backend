import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageSecretaire from "./pagesecretaire";
import Rendezvous from "../composants/secretaire/rendezvoussecretaire";
import PatientSecretaire from "../composants/secretaire/patientsecretaire";
import CalendarSecretaire from "../composants/secretaire/calendriersecretaire";
import RendezvousScretaireToday from "../composants/secretaire/rdvsecretaireday";
import FormulaireRendezVous from "../composants/secretaire/formulairerendezvous";
import Facture from "../composants/secretaire/facture";
import FormulairePatientSecretaire from "../composants/secretaire/formulairepatientsecretaire";
import AfficherDetailRendezVous from "../composants/secretaire/afficherdetailrendezvous";
import ModifierRendezVous from "../composants/secretaire/modifierrendezvous";
import ChatPage from "./chatpage";

const Secretaireroute = () => {
    return (
        <Routes>
            <Route path="/" element={<PageSecretaire />}>
                {/* Route par défaut pour /secretaire */}
                <Route index element={<Rendezvous />} />

                {/* Routes rendez-vous */}
                <Route path="rendezvous" element={<Rendezvous />} />
                <Route path="rendezvous/viewrendezvous/:id" element={<AfficherDetailRendezVous />} />
                <Route path="rendezvous/edit/:id" element={<ModifierRendezVous />} />

                {/* Routes patients */}
                <Route path="patient" element={<PatientSecretaire />} />
                <Route path="patient/add" element={<FormulairePatientSecretaire />} />
                <Route path="patient/rendezvous/:nompatient" element={<FormulaireRendezVous />} />
                
                {/* Routes calendrier */}
                <Route path="calendrier" element={<CalendarSecretaire />} />
                <Route path="calendrier/:today" element={<RendezvousScretaireToday />} />
                
                {/* Routes factures */}
                <Route path="facture" element={<Facture />} />

                {/* Route chat */}
                <Route path="chat" element={<ChatPage />} />

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="rendezvous" replace />} />
            </Route>
        </Routes>
    );
};

export default Secretaireroute;
