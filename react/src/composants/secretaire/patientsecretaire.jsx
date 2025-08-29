import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import '../../styles/add-buttons.css'
import '../../styles/action-buttons.css'
import Styled from 'styled-components'
import { useState, useEffect} from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axiosInstance from '../config/axiosConfig';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import Barrehorizontal2 from "../../composants/barrehorizontal2";
import Boutton from '../../composants/boutton'
import imgmedecin from '../../assets/imagemedecin.jpg'
import iconrecherche from '../../assets/iconrecherche.png'
import iconsupprime from '../../assets/Iconsupprime.svg'
import iconburger from '../../assets/iconburger.png'
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../shared/UnifiedModal';
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
    padding-bottom: 20px;
`
const AfficheTableauStyle = Styled.div`
   display: flex;
   justify-content: center;
`
const Affichebarh2 = Styled.div`
    display: flex;
    width: 100%;
    height: 89px;
    justify-content: space-between;
`

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
`
const IconburgerStyle = Styled.img`
    width: 24px;
    height: 20px;

`
const IconrechercheStyle = Styled.img`
    width: 20px;
    height: 20px;
`
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
`

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
`

//

const Span1= Styled.span`
    cursor: pointer;
`

// tableau patient
const NumeroStyle = Styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
`
const DivbuttonStyle = Styled.div`
    display: flex;
    gap: 15px;
`
const ButtonStyle = Styled.button`
    padding: 5px 5px;
    font-family: Roboto;
    font-weight: 300;
    font-size: 1em;
    background-color: ${props => props.$buttonbackgroundColor};
    color: ${props => props.$buttonColor};
    border-radius: 5px;
    gap: 0px;
     &:hover{
        cursor: pointer;
        background-color: rgba(65, 65, 255, 1);
        border-radius: 5px;
    }
    &:focus{
        cursor: pointer;
        background-color: rgba(65, 65, 255, 1);
        color: white;
        border-radius: 5px;
    }
    
`
const ButtonPSStyle = Styled.button`
    padding: 5px 5px;
    font-family: Roboto;
    font-weight: 300;
    font-size: 1em;
     &:hover{
        cursor: pointer;
    }
`

const NomtableStyle = Styled.p`
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 1.5em;
`
const BarreStyle = Styled.div`
    width: 100%;
    height: 5px;
    border-radius: 2.5px;
    background-color: rgba(159, 159, 255, 1);
    padding-left:  20px;

`
//

// gerer les popups

// Supprimer tous les anciens composants de popup
// const Popupsuppr= Styled.div`...`
// const Popupstat= Styled.div`...`
// const Containbouttonpopup = Styled.div`...`
// const Bouttonpopup =Styled.button`...`
// const Overlay = Styled.div`...`
// const ModalOverlay = Styled.div`...`
// const ModalContainer = Styled.div`...`
// const ModalHeader = Styled.div`...`
// const ModalTitle = Styled.h3`...`
// const ModalClose = Styled.button`...`
// const ModalBody = Styled.div`...`
// const ModalMessage = Styled.p`...`
// const ModalFooter = Styled.div`...`
// const ModalButton = Styled.button`...`

function PatientSecretaire(){

      const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')

    useEffect(() => {
        const token = localStorage.getItem('token');
           const nomutilisateur =  async ()=> {
                try {
                const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
                console.log(token);
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
        
        const [Popupsupprime, setPopupsupprime] = useState(false)
        const [patientASupprimer, setpatientASupprimer] = useState(null);
        const [valeurrecherche, setvaleurrecherche] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const [patients, setPatients] = useState([]);
        const [patientsFiltres, setpatientsFiltres] = useState([]);
        const [erreur, setErreur] = useState(null);
        const [isloading, setisloading] = useState(true);

   

      const patientsPerPage = 8;
    
      
    useEffect(()=>{
         
         const fetchPatients = async () => {
            const token = localStorage.getItem('token');
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
                setisloading(false);
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
    
    const [pagesToShow, setpagesToShow] = useState([]);
    const totalPages = Math.ceil(patientsFiltres.length / patientsPerPage);
    
    useEffect(() => {
      // Ne pas afficher la pagination s'il n'y a qu'une page ou moins
      if (totalPages <= 1) {
        setpagesToShow([]);
        return;
      }
      
      if (totalPages >= 6) {
        setpagesToShow([1, 2, 3, "...", totalPages - 1, totalPages]);
      } else {
        const fullList = Array.from({ length: totalPages }, (_, i) => i + 1);
        setpagesToShow(fullList);
      }
    }, [patientsFiltres.length, totalPages]);
    
    const handleClick = (page) => {
      if (page !== "..." && page !== currentPage && page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    }
    
  
    
    const supprimerPatient = async () => {
        if (!patientASupprimer) return;

        const token2 = localStorage.getItem('token');
        try {
            await axiosInstance.delete(`/patients/${patientASupprimer}`);

            // Supprime l'patient localement du tableau
            setPatients((prevData) =>
                prevData.filter((item) => item.id !== patientASupprimer)
            );
            setPopupsupprime(false);
            setpatientASupprimer(null);
            console.log(`patient ${patientASupprimer} supprimé`);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
        };
    
    
   

    
    
        //toggle boutton
    
        
    
      const modification = (numeropage) => {
    let nouvelleListe = [...pagesToShow] // copie de l'ancien tableau

    if (numeropage > 2 && numeropage < totalPages - 2) {
        nouvelleListe[0] = numeropage - 2
        nouvelleListe[1] = numeropage - 1
        nouvelleListe[2] = numeropage
        nouvelleListe[3] = '...'
    } else if (numeropage === totalPages - 2) {
        nouvelleListe[0] = numeropage - 3
        nouvelleListe[1] = numeropage - 2
        nouvelleListe[2] = numeropage - 1
        nouvelleListe[3] = numeropage
    } else {
        // Peut-être une autre logique ici ?
    }
    console.log(pagesToShow)
    setpagesToShow(nouvelleListe)
    }
  // S'assurer que currentPage est toujours valide
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }
  
  const indexOfLastPatient = validCurrentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patientsFiltres.slice(indexOfFirstPatient, indexOfLastPatient);


   const navigate = useNavigate();

  const handleRowClick = (patient) => {
    navigate(`/secretaire/patient/rendezvous/${patient.nom}`);
  };

  // gestion popup
 
 
   if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
    {/* Modal de suppression */}
    <ConfirmationModal
        isOpen={Popupsupprime}
        onClose={() => setPopupsupprime(false)}
        title="Confirmation de suppression"
        message="Êtes-vous sûr de vouloir supprimer ce patient ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={supprimerPatient}
        confirmType="danger"
    />

    {/* Supprimer l'ancien code de popup */}
    {/* <Overlay onClick={() => setPopupsupprime(false)} $Overlaydisplay = {Popupsupprime ? 'block' : 'none'}/>
        <Popupsuppr $Popupdisplay = {Popupsupprime ? 'flex' : 'none'}>
            <p>voulez-vous supprimer cet patient ?</p>
            <Containbouttonpopup>
                <Bouttonpopup onClick={supprimerPatient}> oui </Bouttonpopup>
                <Bouttonpopup onClick={()=> setPopupsupprime(false)}> non </Bouttonpopup>
            </Containbouttonpopup>
        </Popupsuppr> */}
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgmedecin} nomprofil={nomprofil}>
                    <Span1>Liste des patients</Span1>
                </Barrehorizontal1> 

            </SousDiv1Style>
            
            <SousDiv2Style >
               <div className='affichebarh2'
               style={{
                marginTop: '-20px',
              }}
               >
                    <div className='recherche'>
                        <img className='iconburger' src={iconburger}></img>
                        <input className='inputrecherche' type="text" id="text1" placeholder='Tapez votre recherche ici'  value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></input>
                        <img className='iconrecherche' src={iconrecherche}></img>
                    </div>
                    <Link to="/secretaire/patient/add"><button className='add-button add-button-with-icon'> <span>+</span> Ajouter un patient</button></Link>
                </div>
               
               
                {/*<Affichebarh2 >
                  <Barrehorizontal2><Link to="/admin/patient/add"><Boutton nomboutton="Ajouter un patient"/></Link></Barrehorizontal2>  
                </Affichebarh2>*/}
                
                <div className='zonedaffichage'>
                     <div className='numero'>
                            <div>
                                <h2 className='nomtable'> Utilisateurs </h2>
                            </div>
                                                         <Pagination
                               currentPage={currentPage}
                               totalPages={totalPages}
                               onPageChange={setCurrentPage}
                               onModification={modification}
                               itemsPerPage={patientsPerPage}
                               totalItems={patientsFiltres.length}
                             />
                            
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
                                <td className='bouttons td'>
                                {/*<button
                                    onClick={() => toggleStatus(patient.id)}
                                    className={`toggle-button ${patient.isActive ? "on" : ""}`}
                                    >
                                <div className={ `circle  ${patient.isActive  ? "active" : ""}`} ></div></button>*/}
                                <button onClick={()=> {setpatientASupprimer(patient.id);setPopupsupprime(true);}}><img src={iconsupprime} className='iconsupprime'></img></button>
                               
                                
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
export default PatientSecretaire
