import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageAdmin from "./pageadmin";
import Utilisateur from "../composants/administrateur/utilisateurs";
import ModifierUtilisateur from "../composants/administrateur/modifierutilisateur";
import FormulaireUtilisateur from "../composants/administrateur/formulaireutilisateur";
import DetailsUtilisateur from "../composants/administrateur/affichedetailutilisateur";
import Patient from "../composants/administrateur/patients";
import FormulairePatient from "../composants/administrateur/formulairepatient"; 
import DetailsPatient from "../composants/administrateur/afficherdetailpatient";
import ModifierPatient from "../composants/administrateur/modifierpatient";
import Dashboard from "../composants/administrateur/dashboard";
import ChatPage from "./chatpage";

const Adminroute = () => {
    return (
        <Routes>
            <Route path="/" element={<PageAdmin />}>
                {/* Route par défaut pour /admin */}
                <Route index element={<Dashboard />} />

                {/* Routes dashboard */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* Routes utilisateurs */}
                <Route path="utilisateur" element={<Utilisateur />} />
                <Route path="utilisateur/add" element={<FormulaireUtilisateur />} />
                <Route path="utilisateur/viewuser/:id" element={<DetailsUtilisateur />} />
                <Route path="utilisateur/edit/:id" element={<ModifierUtilisateur />} />

                {/* Routes patients */}
                <Route path="patient" element={<Patient />} />
                <Route path="patient/add" element={<FormulairePatient />} />
                <Route path="patient/viewpatient/:id" element={<DetailsPatient />} />
                <Route path="patient/edit/:id" element={<ModifierPatient />} />

                {/* Route chat */}
                <Route path="chat" element={<ChatPage />} />

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
        </Routes>
    );
};

export default Adminroute;
