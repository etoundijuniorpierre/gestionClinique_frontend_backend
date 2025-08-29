import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import Styled from 'styled-components'
import axiosInstance from '../config/axiosConfig';
import React from 'react';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import Pagination from '../shared/Pagination';
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconburger from '../../assets/iconburger.png'
import { Link, useNavigate, useParams  } from 'react-router-dom';
import { ConfirmationModal } from '../shared/UnifiedModal';

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
    height: 70vh;
    display: ${props => props.$zonedaffichagedisplay};
    flex-direction: column;
    gap: 15px;
    background-color: rgba(239, 239, 255, 1);
    border-radius: 10px;
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

const AfficheTableauStyle = Styled.div`
    display: flex;
    justify-content: center;
`




const Span1= Styled.span`
    cursor: pointer;
`
const Span2= Styled.span`
  
`

// Style component du tableau
    const NumeroStyle = Styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
`
const DivbuttonStyle = Styled.div`
    display: flex;
    gap: 15px;
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


function RendezvousMedecinToday(){
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')
    
    // Récupération du nom de l'utilisateur connecté
    useEffect(() => {
        const token = localStorage.getItem('token');
        const nomutilisateur = async () => {
            try {
                const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
                if (response) {
                    setnomprofil(response.data.nom)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        }
        nomutilisateur()
    }, [idUser]);

    const [valeurrecherche, setvaleurrecherche] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isloading, setisloading] = useState(true);
    const [rendezvous, setrendezvous] = useState([]);
    const [rendezvousFiltres, setrendezvousFiltres] = useState([]);
  
    const [erreur, setErreur] = useState(null);

    const { today } = useParams();
    const rendezvousPerPage = 8;
    console.log('=== RDVDAY COMPONENT ===');
    console.log('Paramètre today reçu:', today);
    console.log('Type de today:', typeof today);
    console.log('URL complète:', window.location.href);
    
    useEffect(()=>{
        console.log('=== FETCHING RENDEZ-VOUS ===');
        console.log('Date utilisée pour l\'API:', today);
        
        const fetchrendezvous = async () => {
            const id = localStorage.getItem('id');
            
            if (!id) {
                console.error('ID manquant');
                setErreur('Authentification échouée. Veuillez vous reconnecter.');
                setisloading(false);
                return;
            }
            
            try {
                const response = await axiosInstance.get(`/utilisateurs/${id}/rendez-vous/confirmed/${today}`);
                console.log('Réponse API:', response);
                console.log('Données reçues:', response.data);
              if (response && response.data) {
                // Trier les rendez-vous par ordre décroissant (plus récent en premier)
                const rendezvousTries = response.data.sort((a, b) => {
                    // Trier d'abord par heure (du plus tôt au plus tard pour la journée)
                    if (a.heure && b.heure) {
                        return a.heure.localeCompare(b.heure);
                    }
                    // Si pas d'heure, trier par ID (plus récent en premier)
                    return b.id - a.id;
                });
                
                setrendezvous(rendezvousTries);
                setrendezvousFiltres(rendezvousTries);
                } else {
                //setErreur('Données introuvables');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des rendezvous:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchrendezvous();
        },[today]);
        
    useEffect(() => {
            if (!valeurrecherche.trim()) {
                setrendezvousFiltres(rendezvous); 
                return;
            }

            const recherche = valeurrecherche.toLowerCase();

            const resultats = rendezvous.filter((u) =>
                u.jour.toLowerCase().includes(recherche) ||
                u.patientNomComplet.toLowerCase().includes(recherche) ||
                u.medecinNomComplet.toLowerCase().includes(recherche) ||
                u.statut.toLowerCase().includes(recherche)
            );

            setrendezvousFiltres(resultats);
    }, [valeurrecherche, rendezvous]);


    const totalPages = Math.ceil(rendezvousFiltres.length / rendezvousPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleModification = (page) => {
        // Cette fonction peut être utilisée pour des actions supplémentaires lors du changement de page
        console.log('Page modifiée:', page);
    };

    const indexOfLastrendezvous = currentPage * rendezvousPerPage;
    const indexOfFirstrendezvous = indexOfLastrendezvous - rendezvousPerPage;
    //const currentrendezvous = rendezvous.slice(indexOfFirstrendezvous, indexOfLastrendezvous);
    const currentrendezvous = rendezvousFiltres.slice(indexOfFirstrendezvous, indexOfLastrendezvous);
    

     const navigate = useNavigate();

  const handleRowClick = (rendezvous) => {
    navigate(`/medecin/rendezvous/viewrendezvous/${rendezvous.id}`);
  };


  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Calendrier" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1 onClick={()=> navigate("/medecin/calendrier")}>Liste des evenements</Span1>
                    <Span2 > {">"} Rendez vous du jours </Span2>
                </Barrehorizontal1>
            </SousDiv1Style>
            
            <SousDiv2Style >
                <div className='affichebarh2'>
                    <div className='recherche'>
                        <img className='iconburger' src={iconburger}></img>
                        <input className='inputrecherche' type="text" id="text1" placeholder='Tapez votre recherche ici'  value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></input>
                        <img className='iconrecherche' src={iconrecherche}></img>
                    </div>
                    
                </div>
                    
                
                <div className='zonedaffichage'>
                    <div className='numero'>
                            <div>
                                <h2 className='nomtable'> Rendez-vous du jour </h2>
                            </div>
                            <div className='divbutton'>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    onModification={handleModification}
                                    itemsPerPage={rendezvousPerPage}
                                    totalItems={rendezvousFiltres.length}
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
                            
                            <th className='th'>Jour</th>
                            <th className='th'>Heure</th>
                            <th className='th'>Service medical</th>
                            <th className='th'>Nom du patient</th>
                            <th className='th'>Nom du medecin</th>
                            <th className='th'>Nom de la salle</th>
                            <th className='th'>Statut</th>
                           
                           
                        </tr>
                        </thead>
                        <tbody>
                        {currentrendezvous.map((rendezvous) => (
                           <tr key={rendezvous.id} className='tr'>
    
                            
                            
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.jour}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.heure}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.serviceMedical}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.patientNomComplet ? rendezvous.patientNomComplet.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ') : ''}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.medecinNomComplet ? `Dr. ${rendezvous.medecinNomComplet.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ')}` : ''}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.nomSalle}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.statut}</td>
                            
                            </tr>
                        ))}
                        </tbody>
                    </table>
                   
                    </div>
                </div>

               
                
            </SousDiv2Style>
    </>)   
}
export default RendezvousMedecinToday
