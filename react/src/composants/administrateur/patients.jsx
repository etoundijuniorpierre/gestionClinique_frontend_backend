import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import '../../styles/add-buttons.css'
import '../../styles/action-buttons.css'
import '../../styles/rendezvous-status.css'
import Styled from 'styled-components'
import axiosInstance from '../../composants/config/axiosConfig';
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgmedecin from '../../assets/imagemedecin.jpg'
import iconrecherche from '../../assets/iconrecherche.png'
import iconsupprime from '../../assets/Iconsupprime.svg'
import iconburger from '../../assets/iconburger.png'
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';
import Pagination from '../shared/Pagination';


const SousDiv1Style = Styled.div`
 width: 100%;
 padding-right: 32px;
`
const SousDiv2Style = Styled.div`
  width: 100%;
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`
const ZonedaffichageStyle = Styled.div`
    height: 65vh;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: rgba(239, 239, 255, 1);
    border-radius: 10px;
`;
const AfficheTableauStyle = Styled.div`
   display: flex;
   justify-content: center;
`;;
const Affichebarh2 = Styled.div`
    display: flex;
    width: 100%;
    height: 89px;
    justify-content: space-between;
`;;

// affichage bar de recherche et boutton


    const RechercheStyle = Styled.div`
   width: 75%;
   height: 56px;
   border-radius: 28px;
   background-color: rgba(239, 239, 255, 1);
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding-left: 20px;
   padding-right: 20px;
`;;
const IconburgerStyle = Styled.img`
    width: 24px;
    height: 20px;
`;;
const IconrechercheStyle = Styled.img`
    width: 20px;
    height: 20px;
`;;
const InputStyle = Styled.input`
    width: 90%;
    height: 56px;
    border: none;
    background-color:  rgba(239, 239, 255, 1);
    font-family: Body/Font Family;
    font-weight: 400;
    font-size: 1em;
    &:focus{
        outline: none;
        border: none;
    }
`;;

const BouttonStyle = Styled.button`
height: 56px;
border-radius: 28px;
padding-top: 12px;
padding-right: 16px;
padding-bottom: 12px;
padding-left: 16px;
background-color: rgba(65, 65, 255, 1);
font-family: Body/Font Family;
font-weight: 700;
font-size: 1.3em;
color: #fff;
border: none;
&:hover{
    cursor: pointer;
}
`;;

//

const Span1= Styled.span`
    cursor: pointer;
`;;

// tableau patient
const NumeroStyle = Styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
`;;
const DivbuttonStyle = Styled.div`
    display: flex;
    gap: 15px;
`;;

const ButtonPSStyle = Styled.button`
    padding: 5px 5px;
    font-family: Roboto;
    font-weight: 300;
    font-size: 1em;
     &:hover{
        cursor: pointer;
    }
`;;

const NomtableStyle = Styled.p`
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 1.5em;
`;
const BarreStyle = Styled.div`
    width: 100%;
    height: 5px;
    border-radius: 2.5px;
    background-color: rgba(159, 159, 255, 1);
    padding-left:  20px;
`;

function Patient(){
    const navigate = useNavigate();
    const { startLoading, stopLoading, isLoading } = useLoading();
    const { showConfirmation } = useConfirmation();
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')

    useEffect(() => {
           const nomutilisateur =  async ()=> {
                try {
                const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
                console.log('Token utilisé:', localStorage.getItem('token'));
              if (response) {
                 setnomprofil(response.data.nom)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                
            } finally {
              console.log('fin')
            }
            }
            nomutilisateur()
    }, [idUser]);

        const [valeurrecherche, setvaleurrecherche] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const [patients, setPatients] = useState([]);
        const [patientsFiltres, setpatientsFiltres] = useState([]);
        const [erreur, setErreur] = useState(null);

    

      const patientsPerPage = 8;
    
      
    useEffect(()=>{
        startLoading('fetchPatients');
        const fetchPatients = async () => {
            try {
                const response = await axiosInstance.get(`/patients`);
                //console.log(response.data);
              if (response && response.data) {
                // Trier les patients par ordre décroissant (plus récent en premier)
                const patientsTries = response.data.sort((a, b) => {
                    // Trier par ID (plus récent en premier)
                    return b.id - a.id;
                });
                
                setPatients(patientsTries);
                setpatientsFiltres(patientsTries);
               } 
            } catch (error) {
                console.error('Erreur lors de la récupération des patients:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                stopLoading('fetchPatients');
            }
    
        };
            fetchPatients();
        },[]);

        useEffect(() => {
                    if (!valeurrecherche.trim()) {
                        setpatientsFiltres(patients); // Si rien à chercher, on affiche tout
                        return;
                    }
        
                    const recherche = valeurrecherche.toLowerCase();
        
                    const resultats = patients.filter((u) =>
                        u.nom.toLowerCase().includes(recherche) ||
                        u.prenom.toLowerCase().includes(recherche) ||
                        u.email.toLowerCase().includes(recherche) 
                        
                    );
        
                    setpatientsFiltres(resultats);
            }, [valeurrecherche, patients]);
    
    const totalPages = Math.ceil(patientsFiltres.length / patientsPerPage);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    const handleModification = (page) => {
        // Logique de modification si nécessaire
        console.log('Page modifiée:', page);
    };
    
  
    
    const supprimerPatient = async (patientId) => {
        if (!patientId) return;

        startLoading('deletePatient');
        try {
            await axiosInstance.delete(`/patients/${patientId}`);

            // Supprime l'patient localement du tableau
            setPatients((prevData) =>
                prevData.filter((item) => item.id !== patientId)
            );
            window.showNotification('Patient supprimé avec succès', 'success');
            console.log(`patient ${patientId} supprimé`);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
            window.showNotification('Erreur lors de la suppression', 'error');
        } finally {
            stopLoading('deletePatient');
        }
        };
    
    
   
    
    
    
        //toggle boutton
    
        
    

 const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  //const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const currentPatients = patientsFiltres.slice(indexOfFirstPatient, indexOfLastPatient);


  const handleRowClick = (patient) => {
    navigate(`/admin/patient/viewpatient/${patient.id}`);
  };

  // gestion popup
 
 
   if (isLoading('fetchPatients')) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgmedecin} nomprofil={nomprofil}>
                    <Span1>Liste des patients</Span1>
                </Barrehorizontal1> 

            </SousDiv1Style>
            
            <SousDiv2Style >
               
               <div className='affichebarh2'>
                    <div className='recherche'>
                        <img className='iconburger' src={iconburger}></img>
                        <input className='inputrecherche' type="text" id="text1" placeholder='Tapez votre recherche ici'  value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></input>
                        <img className='iconrecherche' src={iconrecherche}></img>
                    </div>
                    <Link to="/admin/patient/add"><button className='add-button add-button-with-icon'> <span>+</span> Ajouter un patient</button></Link>
                </div>
                
                <div className='zonedaffichage'>
                     <div className='numero'>
                            <div>
                                <h2 className='nomtable'> Patients </h2>
                            </div>
                            <div className='divbutton'>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    onModification={handleModification}
                                    itemsPerPage={patientsPerPage}
                                    totalItems={patientsFiltres.length}
                                />
                            </div>
                            
                    </div>
                        <div className='conteneurbarre'>
                            <div className='barre'></div>
                        </div>
                    <div className='affichetableau'>
                    
                        <table className='tableau-2'>
                            <thead>
                            <tr>
                                
                                
                                <th className='th'>Nom</th>
                                <th className='th'>Prénom</th>
                                <th className='th'>Email</th>
                                <th className='th'>Téléphone</th>
                                <th className='th'>Date_naissance</th>
                                <th className='th'>Adresse</th>
                                <th className='th'>Sexe</th>
                                <th className='action th'>Action</th>
                        
                            </tr>
                            </thead>
                            <tbody>
                            {currentPatients.map((patient) => (
                            <tr key={patient.id} className='tr'>
        
                                
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.nom ? patient.nom.charAt(0).toUpperCase() + patient.nom.slice(1).toLowerCase() : ''}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.prenom ? patient.prenom.charAt(0).toUpperCase() + patient.prenom.slice(1).toLowerCase() : ''}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.email}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.telephone}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.dateNaissance}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.adresse}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.genre}</td>
                                <td className='td bouttons'>
                             
                             
                                <button 
                                    onClick={()=> {
                                        showConfirmation({
                                            title: "Suppression de patient",
                                            message: `Voulez-vous vraiment supprimer le patient ${patient.nom ? patient.nom.charAt(0).toUpperCase() + patient.nom.slice(1).toLowerCase() : ''} ${patient.prenom ? patient.prenom.charAt(0).toUpperCase() + patient.prenom.slice(1).toLowerCase() : ''} ?`,
                                            onConfirm: () => supprimerPatient(patient.id),
                                            confirmText: "Supprimer",
                                            cancelText: "Annuler",
                                            variant: "danger"
                                        });
                                    }}
                                    disabled={isLoading('deletePatient')}
                                    className="delete-button"
                                >
                                    <img src={iconsupprime} className='iconsupprime'></img>
                                </button>
                            </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    
                    </div>
                </div>
                
              
            </SousDiv2Style>
    </>)   
}
export default Patient
