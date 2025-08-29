import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import '../../styles/action-buttons.css'
import '../../styles/rendezvous-status.css'
import Styled from 'styled-components'
import axiosInstance from '../config/axiosConfig';
import React from 'react';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconburger from '../../assets/iconburger.png'
import iconsupprime from '../../assets/Iconsupprime.svg'
import { Link, useNavigate, useParams } from 'react-router-dom';
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
const Span2 = Styled.span`
  
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


function RendezvousScretaireToday() {
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
  const [valeurrecherche, setvaleurrecherche] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setisloading] = useState(true);
  const [rendezvous, setrendezvous] = useState([]);
  const [rendezvousFiltres, setrendezvousFiltres] = useState([]);

  const [erreur, setErreur] = useState(null);


    const { today } = useParams();
    const rendezvousPerPage = 8;
    console.log(today)

    useEffect(() => {

        const fetchrendezvous = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await axiosInstance.get(`/rendezvous/jour/${today}`);
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
    }, [today]);

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
            u.statut.toLowerCase().includes(recherche)
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
        navigate(`/secretaire/rendezvous/viewrendezvous/${rendezvous.id}`);
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
        <SousDiv1Style>
            <Barrehorizontal1 titrepage="Calendrier" imgprofil1={imgprofil} nomprofil={nomprofil}>
                <Span1 onClick={() => navigate("/secretaire/calendrier")}>Liste des evenements</Span1>
                <Span2 > {">"} Rendez vous du jours </Span2>
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

            </div>



            <div className='zonedaffichage'>
                <div className='numero'>
                    <div>
                        <h2 className='nomtable'> Rendez-vous du jour </h2>
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
                                        <input
                                            type="checkbox"
                                            checked={rendezvous.statut === "ANNULE"}  /* Coché seulement si ANNULE */
                                            onChange={() => {
                                                // Désactiver pour les rendez-vous CONFIRME et TERMINE
                                                if (rendezvous.statut === "CONFIRME" || rendezvous.statut === "TERMINE") {
                                                    return;
                                                }
                                                setstatutAmodifier([rendezvous.id, rendezvous.statut]);
                                                setPopupstatut(true);
                                            }}
                                            className={`toggle-button ${
                                                rendezvous.statut === "CONFIRME" ? "disabled-confirme" : 
                                                rendezvous.statut === "TERMINE" ? "disabled-termine" : ""
                                            }`}
                                            title={
                                                rendezvous.statut === "ANNULE" ? "Rendez-vous annulé" : 
                                                rendezvous.statut === "CONFIRME" ? "Rendez-vous confirmé - ne peut pas être annulé" :
                                                rendezvous.statut === "TERMINE" ? "Rendez-vous terminé" :
                                                "Cliquer pour annuler"
                                            }
                                            disabled={rendezvous.statut === "CONFIRME" || rendezvous.statut === "TERMINE"}
                                        />
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
export default RendezvousScretaireToday
