import '../styles/pageadmin.css'
import Styled from 'styled-components'
import React, { useState, useEffect } from 'react';
import Barrelatteral from '../composants/barrelatteral';
import Eltmenu from '../composants/eltmenu'
import imgutilisateur from '../assets/IconUtilisateursblack.png'
import imgpatient from '../assets/IconPatient.png'
import imgdashboard from '../assets/iconutilisateurdashboardblanc.svg'
import iconEnvelope from '../assets/icon-envelope.svg'
import iconChat from '../assets/icon-chat.svg'
import { Link, Outlet, useLocation } from 'react-router-dom';

const PageStyle = Styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;
    
    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
        min-height: 100vh;
    }
`

const DivStyle = Styled.div`
    width: 80vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-left: 32px;
    padding-top: 32px;
    overflow-y: auto;
    
    @media (max-width: 1200px) {
        width: 75vw;
        padding-left: 24px;
        padding-top: 24px;
    }
    
    @media (max-width: 768px) {
        width: 100vw;
        height: auto;
        min-height: calc(100vh - 200px);
        padding-left: 16px;
        padding-top: 16px;
    }
    
    @media (max-width: 480px) {
        padding-left: 12px;
        padding-top: 12px;
        gap: 10px;
    }
`

function PageAdmin(){
    const location = useLocation();
    const [contenuActif, setContenuActif] = useState('dashboard');
    
    // Déterminer le contenu actif basé sur l'URL
    useEffect(() => {
        const path = location.pathname;
        
        // Extraction du segment de route après /admin/
        const segments = path.split('/').filter(segment => segment);
        const routeSegment = segments[1] || 'dashboard'; // Si pas de segment, default to dashboard
        
        if (routeSegment === 'dashboard' || routeSegment === 'admin' || segments.length === 1) {
            setContenuActif('dashboard');
        } else if (routeSegment === 'utilisateur') {
            setContenuActif('utilisateur');
        } else if (routeSegment === 'patient') {
            setContenuActif('patient');
        } else if (routeSegment === 'chat') {
            setContenuActif('chat');
        } else {
            setContenuActif('dashboard');
        }
    }, [location.pathname]);
    
    const changerContenu = (contenu) => {
        setContenuActif(contenu);
    };
    
    return(
        <PageStyle>
            <Barrelatteral> 
                <Link 
                    to="/admin/dashboard" 
                    className={contenuActif === 'dashboard' ? 'eltmenu' : 'lienadmin'} 
                    onClick={() => changerContenu('dashboard')}
                >
                    <Eltmenu nommenu='Dashboard' active={contenuActif === 'dashboard'} />
                </Link>
                <Link 
                    to="/admin/utilisateur" 
                    className={contenuActif === 'utilisateur' ? 'eltmenu' : 'lienadmin'} 
                    onClick={() => changerContenu('utilisateur')}
                >
                    <Eltmenu nommenu='Utilisateurs' img={imgutilisateur} active={contenuActif === 'utilisateur'} />
                </Link>
                <Link 
                    to="/admin/patient" 
                    className={contenuActif === 'patient' ? 'eltmenu' : 'lienadmin'} 
                    onClick={() => changerContenu('patient')}
                >
                    <Eltmenu nommenu='Patients' img={imgpatient} active={contenuActif === 'patient'} />
                </Link>
                <Link 
                    to="/admin/chat" 
                    className={contenuActif === 'chat' ? 'eltmenu' : 'lienadmin'} 
                    onClick={() => changerContenu('chat')}
                >
                    <Eltmenu nommenu='Chat' img={iconChat} active={contenuActif === 'chat'} />
                </Link>
            </Barrelatteral>
            <DivStyle>
                <Outlet/>   
            </DivStyle>
        </PageStyle>
    );
}

export default PageAdmin;
