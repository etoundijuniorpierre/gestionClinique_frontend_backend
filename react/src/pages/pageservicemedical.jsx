import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../composants/protectedroute';
import RoleBasedRoute from '../composants/rolebasedroute';
import ServicesMedicaux from '../composants/administrateur/servicesmedicaux';
import FormulaireServiceMedical from '../composants/administrateur/formulaireservicemedical';

const PageServiceMedical = () => {
    return (
        <Routes>
            <Route 
                path="/admin/services-medicaux" 
                element={
                    <ProtectedRoute>
                        <RoleBasedRoute requiredRole="ADMIN">
                            <ServicesMedicaux />
                        </RoleBasedRoute>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/admin/services-medicaux/creer" 
                element={
                    <ProtectedRoute>
                        <RoleBasedRoute requiredRole="ADMIN">
                            <FormulaireServiceMedical />
                        </RoleBasedRoute>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/admin/services-medicaux/modifier/:id" 
                element={
                    <ProtectedRoute>
                        <RoleBasedRoute requiredRole="ADMIN">
                            <FormulaireServiceMedical />
                        </RoleBasedRoute>
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
};

export default PageServiceMedical;
