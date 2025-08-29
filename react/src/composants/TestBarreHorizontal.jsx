import React, { useState } from 'react';
import Barrehorizontal1 from './barrehorizontal1';
import imgprofil from '../assets/photoDoc.png';

const TestBarreHorizontal = () => {
    const [currentRole, setCurrentRole] = useState('MEDECIN');
    const [nomProfil, setNomProfil] = useState('Jean Dupont');

    const roles = [
        { value: 'MEDECIN', label: 'Médecin' },
        { value: 'ADMIN', label: 'Administrateur' },
        { value: 'SECRETAIRE', label: 'Secrétaire' },
        { value: 'USER', label: 'Utilisateur' }
    ];

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>🧪 Test de la Barre Horizontale</h2>
            
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Paramètres de test :</h3>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <label>Rôle : </label>
                        <select 
                            value={currentRole} 
                            onChange={(e) => setCurrentRole(e.target.value)}
                            style={{ padding: '5px', marginLeft: '10px' }}
                        >
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label>Nom : </label>
                        <input 
                            type="text" 
                            value={nomProfil} 
                            onChange={(e) => setNomProfil(e.target.value)}
                            style={{ padding: '5px', marginLeft: '10px' }}
                        />
                    </div>
                </div>
                
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    <strong>Rôle actuel :</strong> {currentRole} | 
                    <strong> Nom :</strong> {nomProfil} | 
                    <strong> Titre affiché :</strong> {
                        currentRole === 'MEDECIN' ? 'Dr.' :
                        currentRole === 'ADMIN' ? 'Admin.' :
                        currentRole === 'SECRETAIRE' ? 'Sec.' : ''
                    } {nomProfil}
                </div>
            </div>

            {/* Simulation de la barre horizontale */}
            <div style={{ border: '2px dashed #ccc', borderRadius: '12px', padding: '20px', backgroundColor: '#fafafa' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#666' }}>Prévisualisation :</h4>
                <Barrehorizontal1 
                    titrepage="Page de Test" 
                    imgprofil1={imgprofil} 
                    nomprofil={nomProfil}
                    userRole={currentRole}
                >
                    <span>Chemin de navigation de test</span>
                </Barrehorizontal1>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                <h4>✅ Fonctionnalités testées :</h4>
                <ul>
                    <li><strong>Médecin :</strong> Affiche "Dr. [Nom]" avec style amélioré</li>
                    <li><strong>Administrateur :</strong> Affiche "Admin. [Nom]"</li>
                    <li><strong>Secrétaire :</strong> Affiche "Sec. [Nom]"</li>
                    <li><strong>Autres rôles :</strong> Affiche seulement le nom</li>
                    <li><strong>Style :</strong> Border-bottom élégant, animations, responsive</li>
                </ul>
            </div>
        </div>
    );
};

export default TestBarreHorizontal;
