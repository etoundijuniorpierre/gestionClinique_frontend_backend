import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import '../../styles/add-buttons.css'
import '../../styles/action-buttons.css'
import '../../styles/rendezvous-status.css'
import Styled from 'styled-components'
import axiosInstance from '../config/axiosConfig';
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconsupprime from '../../assets/Iconsupprime.svg'
import iconburger from '../../assets/iconburger.png'
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal, InfoModal } from '../shared/UnifiedModal';
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




const Span1 = Styled.span`
    cursor: pointer;
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

// Remplacer les anciens styles de popups par des styles modernes et uniformes
const ModalOverlay = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = Styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = Styled.h3`
  margin: 0;
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
`;

const ModalClose = Styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    color: #666;
  }
`;

const ModalBody = Styled.div`
  padding: 24px;
`;

const ModalMessage = Styled.p`
  margin: 0 0 16px 0;
  color: #333333;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  text-align: center;
`;

const ModalFooter = Styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const ModalButton = Styled.button`
  background-color: ${props => props.primary ? 'rgba(159, 159, 255, 1)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'rgba(159, 159, 255, 1)'};
  border: 1px solid rgba(159, 159, 255, 1);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:hover {
    background-color: ${props => props.primary ? 'rgba(139, 139, 235, 1)' : 'rgba(239, 239, 255, 1)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

function Rendezvous() {
    //const [isVisible, setisVisible] = useState(0)
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token');
        const nomutilisateur = async () => {
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

    // fonction du tableau
    const [Popupsupprime, setPopupsupprime] = useState(false)
    const [rendezvousASupprimer, setrendezvousASupprimer] = useState(null);
    const [statutAmodifier, setstatutAmodifier] = useState(null);
    const [Popupstatut, setPopupstatut] = useState(false)
    const [PopupInfo, setPopupInfo] = useState(false)
    const [rendezvousInfo, setrendezvousInfo] = useState(null)
    const [valeurrecherche, setvaleurrecherche] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isloading, setisloading] = useState(true);
    const [rendezvous, setrendezvous] = useState([]);
    const [rendezvousFiltres, setrendezvousFiltres] = useState([]);

    const [erreur, setErreur] = useState(null);


    const rendezvousPerPage = 8;


    useEffect(() => {

        const fetchrendezvous = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.get(`/rendezvous`);
                console.log(token);
                if (response && response.data) {
                    // Trier les rendez-vous par ordre décroissant (plus récent en premier)
                    const rendezvousTries = response.data.sort((a, b) => {
                        // Trier d'abord par date (du plus récent au plus ancien)
                        if (a.jour && b.jour) {
                            const dateA = new Date(a.jour);
                            const dateB = new Date(b.jour);
                            if (dateA.getTime() !== dateB.getTime()) {
                                return dateB.getTime() - dateA.getTime();
                            }
                        }
                        // Si même date, trier par heure (du plus tôt au plus tard)
                        if (a.heure && b.heure) {
                            return a.heure.localeCompare(b.heure);
                        }
                        // Si pas d'heure, trier par ID (plus récent en premier)
                        return b.id - a.id;
                    });

                    setrendezvous(rendezvousTries);
                    setrendezvousFiltres(rendezvousTries);
                } /*else {
                setErreur('Données introuvables');
                }*/
            } catch (error) {
                console.error('Erreur lors de la récupération des rendezvous:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }

        };
        fetchrendezvous();
    }, []);

    useEffect(() => {
        if (!valeurrecherche.trim()) {
            setrendezvousFiltres(rendezvous); // Si rien à chercher, on affiche tout
            return;
        }

        const recherche = valeurrecherche.toLowerCase();

        const resultats = rendezvous.filter((u) =>
            u.jour.toLowerCase().includes(recherche) ||
            u.patientNomComplet.toLowerCase().includes(recherche) ||
            u.medecinNomComplet.toLowerCase().includes(recherche) ||
            (u.statut === "ANNULE" ? "annulé" : "actif").includes(recherche)
        );

        setrendezvousFiltres(resultats);
    }, [valeurrecherche, rendezvous]);





    const [pagesToShow, setpagesToShow] = useState([]);
    const totalPages = Math.ceil(rendezvousFiltres.length / rendezvousPerPage);

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
    }, [rendezvousFiltres.length, totalPages]);

    //let pagesToShow = [1, 2, 3, "...", totalPages - 1, totalPages];

    const handleClick = (page) => {
        if (page !== "..." && page !== currentPage) {
            setCurrentPage(page);
        }
    }



    //toggle boutton


    // Remplacer la fonction toggleStatus par annulerRendezVous
    const annulerRendezVous = () => {
        if (!statutAmodifier) return;

        // Empêcher l'annulation des rendez-vous confirmés
        if (statutAmodifier[1] === "CONFIRME") {
            if (window.showNotification) {
                window.showNotification("Les rendez-vous confirmés ne peuvent pas être annulés", "warning");
            }
            setPopupstatut(false);
            setstatutAmodifier(null);
            return;
        }

        const annuler = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axiosInstance.put(`/rendezvous/${statutAmodifier[0]}/cancel`, {});

                // Mettre à jour la liste des rendez-vous avec le statut "ANNULE"
                setrendezvous((prevData) =>
                    prevData.map((item) =>
                        item.id === statutAmodifier[0] ? { ...item, statut: "ANNULE" } : item
                    )
                );

                setPopupstatut(false);
                setstatutAmodifier(null);

                // Afficher un message de succès
                if (window.showNotification) {
                    window.showNotification("Rendez-vous annulé avec succès", "success");
                }

                console.log(response.data);
            } catch (error) {
                console.error('Erreur lors de l\'annulation du rendez-vous:', error);

                // Afficher un message d'erreur
                if (window.showNotification) {
                    window.showNotification("Erreur lors de l'annulation du rendez-vous", "error");
                }
            }
        };

        annuler();
    };

    // Fonction pour gérer le clic sur un rendez-vous annulé
    const handleRendezVousAnnuleClick = (rendezvous) => {
        setrendezvousInfo(rendezvous);
        setPopupInfo(true);
    };

    // Fonction pour gérer la navigation vers la modification selon le statut
    const handleModificationClick = (rendezvous) => {
        if (rendezvous.statut === "ANNULE") {
            // Pour les rendez-vous annulés, afficher le popup d'information
            handleRendezVousAnnuleClick(rendezvous);
            return;
        }

        if (rendezvous.statut === "TERMINE") {
            if (window.showNotification) {
                window.showNotification("Impossible de modifier un rendez-vous terminé", "warning");
            }
            return;
        }

        if (rendezvous.statut === "CONFIRME") {
            if (window.showNotification) {
                window.showNotification("Ce rendez-vous est confirmé. Modifications limitées.", "info");
            }
        }

        // Navigation vers la modification
        navigate(`/secretaire/rendezvous/modifier/${rendezvous.id}`);
    };


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

    const indexOfLastrendezvous = validCurrentPage * rendezvousPerPage;
    const indexOfFirstrendezvous = indexOfLastrendezvous - rendezvousPerPage;
    const currentrendezvous = rendezvousFiltres.slice(indexOfFirstrendezvous, indexOfLastrendezvous);


    //

    //aficher les détails d'un rendezvous
    //const [user, setuser] = useState({})

    //
    const navigate = useNavigate();

    const handleRowClick = (rendezvous) => {
        // Si le rendez-vous est annulé, afficher le popup d'information au lieu de naviguer
        if (rendezvous.statut === "ANNULE") {
            handleRendezVousAnnuleClick(rendezvous);
            return;
        }
        navigate(`/secretaire/rendezvous/viewrendezvous/${rendezvous.id}`);
    };



    // Modifier la fonction supprimerrendezvous
    const supprimerrendezvous = async () => {
        if (!rendezvousASupprimer) return;

        const token = localStorage.getItem('token');
        try {
            await axiosInstance.delete(`/rendezvous/${rendezvousASupprimer}`);

            // Mettre à jour la liste des rendez-vous
            setrendezvous((prevrendezvous) =>
                prevrendezvous.filter((u) => u.id !== rendezvousASupprimer)
            );

            setPopupsupprime(false);
            setrendezvousASupprimer(null);

            // Afficher un message de succès
            if (window.showNotification) {
                window.showNotification("Rendez-vous supprimé avec succès", "success");
            }

            console.log(`rendezvous ${rendezvousASupprimer} supprimé`);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);

            // Afficher un message d'erreur
            if (window.showNotification) {
                window.showNotification("Erreur lors de la suppression du rendez-vous", "error");
            }
        }
    };


    if (isloading) return <p>Chargement...</p>;

    if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return (<>
        {/* Modal de suppression */}
        <ConfirmationModal
            isOpen={Popupsupprime}
            onClose={() => setPopupsupprime(false)}
            title="Confirmation de suppression"
            message="Êtes-vous sûr de vouloir supprimer ce rendez-vous ?"
            confirmText="Supprimer"
            cancelText="Annuler"
            onConfirm={supprimerrendezvous}
            confirmType="danger"
        />

        {/* Modal de changement de statut */}
        <ConfirmationModal
            isOpen={Popupstatut}
            onClose={() => setPopupstatut(false)}
            title="Confirmation d'annulation"
            message="Voulez-vous annuler ce rendez-vous ?"
            confirmText="Oui, annuler"
            cancelText="Non"
            onConfirm={annulerRendezVous}
            confirmType="warning"
        />

        {/* Modal d'information pour rendez-vous annulé */}
        <InfoModal
            isOpen={PopupInfo}
            onClose={() => setPopupInfo(false)}
            title="Rendez-vous annulé"
            message="Ce rendez-vous est annulé. Impossible de le réactiver. Veuillez le supprimer et créer un nouveau rendez-vous si nécessaire."
            buttonText="Compris"
        />

        <SousDiv1Style>
            <Barrehorizontal1 titrepage="Gestion des rendez-vous" imgprofil1={imgprofil} nomprofil={nomprofil}>
                <Span1>Liste des rendez vous</Span1>
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
                    <input className='inputrecherche' type="text" id="text1" placeholder='Tapez votre recherche ici' value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></input>
                    <img className='iconrecherche' src={iconrecherche}></img>
                </div>
                <Link to="/secretaire/patient?focus=patient"><button className='add-button add-button-with-icon'> <span>+</span> Créer un rendez-vous</button></Link>
            </div>



            <div className='zonedaffichage'>
                <div className='numero'>
                    <div>
                        <h2 className='nomtable'> Rendez-vous </h2>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onModification={modification}
                        itemsPerPage={rendezvousPerPage}
                        totalItems={rendezvousFiltres.length}
                    />

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
                                <th className='th'>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {currentrendezvous.map((rendezvous) => (
                                <tr key={rendezvous.id} className={`tr ${
                                    rendezvous.statut === "ANNULE" ? "rendezvous-annule" :
                                    rendezvous.statut === "TERMINE" ? "rendezvous-termine" :
                                    rendezvous.statut === "CONFIRME" ? "rendezvous-confirme" : ""
                                }`}>



                                    <td onClick={() => { handleRowClick(rendezvous) }} className='td'>{rendezvous.jour}</td>
                                    <td onClick={() => { handleRowClick(rendezvous) }} className='td'>{rendezvous.heure}</td>
                                    <td onClick={() => { handleRowClick(rendezvous) }} className='td'>{rendezvous.serviceMedical}</td>
                                    <td onClick={() => { handleRowClick(rendezvous) }} className='td'>{rendezvous.patientNomComplet ? rendezvous.patientNomComplet.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ') : ''}</td>
                                    <td onClick={() => { handleRowClick(rendezvous) }} className='td'>{rendezvous.medecinNomComplet ? `Dr. ${rendezvous.medecinNomComplet.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ')}` : ''}</td>
                                    <td onClick={() => { handleRowClick(rendezvous) }} className='td'>{rendezvous.nomSalle}</td>
                                    <td onClick={() => { handleRowClick(rendezvous) }} className='td'>
                                        {rendezvous.statut}
                                    </td>
                                    <td className='td bouttons'>
                                        {/* Toggle button - désactivé pour les rendez-vous annulés, confirmés et terminés */}
                                        <input
                                            type="checkbox"
                                            checked={rendezvous.statut === "ANNULE"}
                                            onChange={() => {
                                                // Désactiver pour les rendez-vous CONFIRME, TERMINE et ANNULE
                                                if (rendezvous.statut === "CONFIRME" || rendezvous.statut === "TERMINE" || rendezvous.statut === "ANNULE") {
                                                    if (rendezvous.statut === "ANNULE") {
                                                        handleRendezVousAnnuleClick(rendezvous);
                                                    }
                                                    return;
                                                }
                                                setstatutAmodifier([rendezvous.id, rendezvous.statut]);
                                                setPopupstatut(true);
                                            }}
                                            className={`toggle-button ${
                                                rendezvous.statut === "CONFIRME" ? "disabled-confirme" : 
                                                rendezvous.statut === "TERMINE" ? "disabled-termine" : 
                                                rendezvous.statut === "ANNULE" ? "disabled-annule" : ""
                                            }`}
                                            title={
                                                rendezvous.statut === "ANNULE" ? "Rendez-vous annulé - impossible de réactiver" : 
                                                rendezvous.statut === "CONFIRME" ? "Rendez-vous confirmé - ne peut pas être annulé" :
                                                rendezvous.statut === "TERMINE" ? "Rendez-vous terminé" :
                                                "Cliquer pour annuler"
                                            }
                                            disabled={rendezvous.statut === "CONFIRME" || rendezvous.statut === "TERMINE" || rendezvous.statut === "ANNULE"}
                                        />

                                        {/* Bouton de suppression - désactivé pour les rendez-vous terminés */}
                                        <button 
                                            onClick={() => { 
                                                // Désactiver pour les rendez-vous TERMINE
                                                if (rendezvous.statut === "TERMINE") {
                                                    return;
                                                }
                                                setrendezvousASupprimer(rendezvous.id); 
                                                setPopupsupprime(true); 
                                            }}
                                            className={`delete-button ${rendezvous.statut === "TERMINE" ? "disabled-termine" : ""}`}
                                            title={
                                                rendezvous.statut === "TERMINE" ? "Rendez-vous terminé - ne peut pas être supprimé" :
                                                "Supprimer le rendez-vous"
                                            }
                                            disabled={rendezvous.statut === "TERMINE"}
                                        >
                                            <img src={iconsupprime} className='iconsupprime' alt="Supprimer"></img>
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
export default Rendezvous
