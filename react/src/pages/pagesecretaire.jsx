import '../styles/pageadmin.css'
import Styled from 'styled-components'
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Barrelatteral from '../composants/barrelatteral';
//import Utilisateur from '../composants/utilisateurs';
//import Patient from '../composants/patients';
import Eltmenu from '../composants/eltmenu'
//import mail from '../assets/mail.png'
import imgrendezvous from '../assets/IconRendezvous.png'
import imgpatient from '../assets/IconPatient.png'
import imgcalendrier from '../assets/IconCalendrier.png'
import iconEnvelope from '../assets/icon-envelope.svg'
import iconChat from '../assets/icon-chat.svg'
import { Link, Outlet, useLocation } from 'react-router-dom';

const PageStyle = Styled.div`
    display: flex;
`
const DivStyle = Styled.div`
 width: 100%;
 height: 100vh;
 display: flex;
 flex-direction: column;
 gap: 15px;
 padding-left: 1%;
 padding-top: 2%;
`

function PageSecretaire(){
    const [contenuActif, setContenuActif] = useState('rendez-vous');
    const location = useLocation();
    
    // Déterminer le contenu actif basé sur l'URL
    useEffect(() => {
        const path = location.pathname;
        
        // Extraction du segment de route après /secretaire/
        const segments = path.split('/').filter(segment => segment);
        const routeSegment = segments[1] || 'rendezvous'; // Si pas de segment, default to rendezvous
        
        if (routeSegment === 'rendezvous') {
            setContenuActif('rendez-vous');
        } else if (routeSegment === 'patient') {
            setContenuActif('patient');
        } else if (routeSegment === 'calendrier') {
            setContenuActif('calendrier');
        } else if (routeSegment === 'facture') {
            setContenuActif('facture');
        } else if (routeSegment === 'chat') {
            setContenuActif('chat');
        } else {
            setContenuActif('rendez-vous');
        }
    }, [location.pathname]);
   
    const changerContenu = (contenu) => {
        console.log(contenu);
        setContenuActif(contenu);
    };
    
    return(<>
    <PageStyle>
        <Barrelatteral> 
            <Link to="/secretaire/rendezvous" className={contenuActif === 'rendez-vous' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('rendez-vous')}}><Eltmenu nommenu='rendez-vous' img={imgrendezvous} active={contenuActif === 'rendez-vous'} /></Link>
            <Link to="/secretaire/patient" className={contenuActif === 'patient' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('patient')}}><Eltmenu nommenu='Patients' img={imgpatient} active={contenuActif === 'patient'} /></Link>
            <Link to="/secretaire/calendrier" className={contenuActif === 'calendrier' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('calendrier')}}><Eltmenu nommenu='Calendrier' img={imgcalendrier} active={contenuActif === 'calendrier'} /></Link>
            <Link to="/secretaire/facture" className={contenuActif === 'facture' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('facture')}}><Eltmenu nommenu='Facture' img={imgcalendrier} active={contenuActif === 'facture'} /></Link>
            <Link to="/secretaire/chat" className={contenuActif === 'chat' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('chat')}}><Eltmenu nommenu='Chat' img={iconChat} active={contenuActif === 'chat'} /></Link>
        </Barrelatteral>
         <div className='divstyle'>
            <Outlet/>   
        </div>
        
    </PageStyle>
        
    </>)
}
export default PageSecretaire;
