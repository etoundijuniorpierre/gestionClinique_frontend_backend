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
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconsupprime from '../../assets/Iconsupprime.svg'
import iconburger from '../../assets/iconburger.png'
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';
import Pagination from '../shared/Pagination';

const SousDiv1Style = Styled.div`
    padding-right: 32px;
`
const SousDiv2Style = Styled.div`
   width: 100%;
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  
`





const Span1 = Styled.span`
    cursor: pointer;
`






// Suppression des anciens popups - remplacés par le système Modal

const Containbouttonpopup = Styled.div`
    display: flex;
    padding: 32px;
    border-radius: 16px;
    gap: 30px;
    background-color: white;
`
const Bouttonpopup = Styled.button`
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 1em;
    min-width: 150px;
    padding: 16px;
    border-radius: 16px;
    border: 1px solid rgba(159, 159, 255, 1);
    color: rgba(159, 159, 255, 1);
`
const Overlay = Styled.div`
  display: ${props => props.$Overlaydisplay};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(239, 239, 255, 1);
  z-index: 998;
`
function Utilisateur() {
    const navigate = useNavigate();
    const { startLoading, stopLoading, isLoading } = useLoading();
    const { showConfirmation } = useConfirmation();
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')

    useEffect(() => {
        const nomutilisateur = async () => {
            try {
                const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
                console.log('Token utilisé:', localStorage.getItem('token'));
                if (response) {
                    setnomprofil(response.data.nom)
                } else {
                    setErreur('Données introuvables');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
            }
        }
        nomutilisateur()
    }, [idUser]);

    // fonction du tableau
    const [utilisateurs, setutilisateurs] = useState([]);
    const [utilisateursFiltres, setutilisateursFiltres] = useState([]);
    const [erreur, setErreur] = useState(null);
    const [valeurrecherche, setvaleurrecherche] = useState('');
    const [currentPage, setCurrentPage] = useState(1);


    const utilisateursPerPage = 8;

    // Fonction utilitaire pour extraire le nom du service médical
    const getServiceMedicalName = (utilisateur) => {
        // Vérifier d'abord si l'utilisateur a un service médical
        if (utilisateur.serviceMedicalName) {
            return utilisateur.serviceMedicalName;
        }
        else if (utilisateur.role && utilisateur.role.roleType === 'MEDECIN') {
            return 'Service non défini';
        } else {
            return '—';
        }
    };

    useEffect(() => {
        startLoading('fetchUtilisateurs');
        const fetchUtilisateurs = async () => {
            try {
                const response = await axiosInstance.get(`/utilisateurs`);
                console.log('Token utilisé:', localStorage.getItem('token'));
                if (response && response.data) {
                    // Trier les utilisateurs par ordre décroissant (plus récent en premier)
                    const utilisateursTries = response.data.sort((a, b) => {
                        // Trier par ID (plus récent en premier)
                        return b.id - a.id;
                    });
                    
                    // Debug: afficher la structure du premier utilisateur
                    if (utilisateursTries.length > 0) {
                        console.log('Structure utilisateur complète:', utilisateursTries[0]);
                        console.log('Propriétés disponibles:', Object.keys(utilisateursTries[0]));
                        console.log('Service médical direct:', utilisateursTries[0].serviceMedicalName);
                        console.log('Service médical possible:', utilisateursTries[0].serviceMedical);
                        console.log('Service médical nom:', utilisateursTries[0].serviceMedicalNom);
                        console.log('Service médical objet:', utilisateursTries[0].serviceMedical);
                    }
                    
                    setutilisateurs(utilisateursTries);
                    setutilisateursFiltres(utilisateursTries);
                } else {
                    setErreur('Données introuvables');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                stopLoading('fetchUtilisateurs');
            }

        };
        fetchUtilisateurs();
    }, []);

    useEffect(() => {
        const recherche = valeurrecherche.trim().toLowerCase();
        if (!recherche) {
            setutilisateursFiltres(utilisateurs);
            return;
        }
        const resultats = utilisateurs.filter((u) => {
            const nom = (u.nom || '').toLowerCase();
            const prenom = (u.prenom || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            const role = (u.role?.roleType || '').toLowerCase();
            const serviceMedical = (getServiceMedicalName(u) || '').toLowerCase();
            const serviceMedicalName = (u.serviceMedicalName || '').toLowerCase();
            return (
                nom.includes(recherche) ||
                prenom.includes(recherche) ||
                email.includes(recherche) ||
                role.includes(recherche) ||
                serviceMedical.includes(recherche) ||
                serviceMedicalName.includes(recherche)
            );
        });
        setutilisateursFiltres(resultats);
    }, [valeurrecherche, utilisateurs]);





    const totalPages = Math.ceil(utilisateursFiltres.length / utilisateursPerPage);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    const handleModification = (page) => {
        // Logique de modification si nécessaire
        console.log('Page modifiée:', page);
    };



    //toggle boutton


    const toggleStatus = async (userId, currentStatus) => {
        if (!userId) return;

        startLoading('toggleStatus');
        try {
            const response = await axiosInstance.patch(`/utilisateurs/${userId}/status/${!currentStatus}`, { utilisateurs });
            const user = response.data;
            setutilisateurs((prevData) =>
                prevData.map((item) =>
                    item.id === userId ? user : item
                )
            );
            // La mise à jour de utilisateurs déclenchera le useEffect du filtre
            window.showNotification('Statut modifié avec succès', 'success');
            console.log(response.data);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.log(error)
            window.showNotification('Erreur lors de la modification du statut', 'error');
        } finally {
            stopLoading('toggleStatus');
        }
    }




    const indexOfLastutilisateur = currentPage * utilisateursPerPage;
    const indexOfFirstutilisateur = indexOfLastutilisateur - utilisateursPerPage;
    //const currentutilisateurs = utilisateurs.slice(indexOfFirstutilisateur, indexOfLastutilisateur);
    const currentutilisateurs = utilisateursFiltres.slice(indexOfFirstutilisateur, indexOfLastutilisateur);


    //

    //aficher les détails d'un utilisateur
    //const [user, setuser] = useState({})

    //

    const handleRowClick = (utilisateur) => {
        navigate(`/admin/utilisateur/viewuser/${utilisateur.id}`);
    };



    const supprimerUtilisateur = async (userId) => {
        if (!userId) return;

        startLoading('deleteUser');
        try {
            await axiosInstance.delete(`/utilisateurs/${userId}`);

            setutilisateurs((prevUtilisateurs) =>
                prevUtilisateurs.filter((u) => u.id !== userId)
            );

            window.showNotification('Utilisateur supprimé avec succès', 'success');
            console.log(`Utilisateur ${userId} supprimé`);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
            window.showNotification('Erreur lors de la suppression', 'error');
        } finally {
            stopLoading('deleteUser');
        }
    };



    if (isLoading('fetchUtilisateurs')) return <p>Chargement...</p>;

    if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return (<>
        <SousDiv1Style>
            <Barrehorizontal1 titrepage="Gestion des utilisateurs" imgprofil1={imgprofil} nomprofil={nomprofil}>
                <Span1>Liste des utilisateurs</Span1>
            </Barrehorizontal1>
        </SousDiv1Style>

        <SousDiv2Style >
            <div className='affichebarh2'>
                <div className='recherche'>
                    <img className='iconburger' src={iconburger}></img>
                    <input className='inputrecherche' type="text" id="text1" placeholder='Tapez votre recherche ici' value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></input>
                    <img className='iconrecherche' src={iconrecherche}></img>
                </div>
                <Link to="/admin/utilisateur/add"><button className='add-button add-button-with-icon' > <span>+</span> Ajouter un utilisateur</button></Link>
            </div>


            <div className='zonedaffichage'>
                <div className='numero'>
                    <div>
                        <h2 className='nomtable'> Utilisateurs </h2>
                    </div>
                    <div className='divbutton'>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onModification={handleModification}
                            itemsPerPage={utilisateursPerPage}
                            totalItems={utilisateursFiltres.length}
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
                                <th className='th'>Service médical</th>
                                <th className='th'>Rôle</th>
                                <th className='th'>Statut</th>
                                <th className='action th'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentutilisateurs.map((utilisateur) => (
                                <tr key={utilisateur.id} className={`tr ${
                                    !utilisateur.actif ? "rendezvous-termine" : ""
                                }`}>
                                    <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => { handleRowClick(utilisateur) }}>{utilisateur.nom ? utilisateur.nom.charAt(0).toUpperCase() + utilisateur.nom.slice(1).toLowerCase() : ''}</td>
                                    <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => { handleRowClick(utilisateur) }}>{utilisateur.prenom ? utilisateur.prenom.charAt(0).toUpperCase() + utilisateur.prenom.slice(1).toLowerCase() : ''}</td>
                                    <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => { handleRowClick(utilisateur) }}>{utilisateur.email}</td>
                                    <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => { handleRowClick(utilisateur) }}>{getServiceMedicalName(utilisateur)}</td>
                                    <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => { handleRowClick(utilisateur) }}>{utilisateur.role.roleType}</td>
                                    <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => { handleRowClick(utilisateur) }}>{utilisateur.actif ? "actif" : "inactif"}</td>
                                    <td className='td bouttons'>
                                        <input
                                            type="checkbox"
                                            checked={utilisateur.actif}
                                            onChange={() => {
                                                showConfirmation({
                                                    title: "Modification du statut",
                                                    message: `Voulez-vous ${utilisateur.actif ? 'désactiver' : 'activer'} l'utilisateur ${utilisateur.nom ? utilisateur.nom.charAt(0).toUpperCase() + utilisateur.nom.slice(1).toLowerCase() : ''} ${utilisateur.prenom ? utilisateur.prenom.charAt(0).toUpperCase() + utilisateur.prenom.slice(1).toLowerCase() : ''} ?`,
                                                    onConfirm: () => toggleStatus(utilisateur.id, utilisateur.actif),
                                                    confirmText: "Confirmer",
                                                    cancelText: "Annuler"
                                                });
                                            }}
                                            className={`toggle-button ${utilisateur.actif ? "admin-active" : "disabled-termine"}`}
                                            disabled={isLoading('toggleStatus') || parseInt(utilisateur.id) === parseInt(idUser)}
                                            title={parseInt(utilisateur.id) === parseInt(idUser) ? "Vous ne pouvez pas modifier votre propre statut" : (utilisateur.actif ? "Utilisateur actif - cliquer pour désactiver" : "Utilisateur inactif - cliquer pour activer")}
                                        />
                                        <button
                                            onClick={() => {
                                                showConfirmation({
                                                    title: "Suppression d'utilisateur",
                                                    message: `Voulez-vous vraiment supprimer l'utilisateur ${utilisateur.nom ? utilisateur.nom.charAt(0).toUpperCase() + utilisateur.nom.slice(1).toLowerCase() : ''} ${utilisateur.prenom ? utilisateur.prenom.charAt(0).toUpperCase() + utilisateur.prenom.slice(1).toLowerCase() : ''} ?`,
                                                    onConfirm: () => supprimerUtilisateur(utilisateur.id),
                                                    confirmText: "Supprimer",
                                                    cancelText: "Annuler",
                                                    variant: "danger"
                                                });
                                            }}
                                            disabled={isLoading('deleteUser') || parseInt(utilisateur.id) === parseInt(idUser)}
                                            className={`delete-button ${parseInt(utilisateur.id) === parseInt(idUser) ? "disabled" : ""}`}
                                            title={parseInt(utilisateur.id) === parseInt(idUser) ? "Vous ne pouvez pas supprimer votre propre compte" : "Supprimer l'utilisateur"}
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
export default Utilisateur
