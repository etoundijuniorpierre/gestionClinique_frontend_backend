import Styled from 'styled-components'
import React, { useEffect, useState } from 'react';
import { API_BASE } from './config/apiconfig'
import axiosInstance from './config/axiosConfig';
import Cloche from './cloche'
import notificationApi from '../services/notificationApi';
import styled from 'styled-components';
import Photoprofil from './photoprofil'
import notificationService from '../services/notificationService';

const Barrehorizontal1Style = Styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: -30px;
`
const DivStyle = Styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    height: 70px;
`
const TitreStyle = Styled.h1`
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 800;
    font-size: 42px;
    color: #1e293b;
    margin: 0;
    padding: 0;
    position: relative;
    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
    line-height: 1.1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Animation d'entrée lors du changement de page */
    animation: titleSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Border-bottom élégant avec gradient */
    &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
        border-radius: 2px;
        transform: scaleX(0);
        transform-origin: left;
        animation: borderSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }
    
    /* Hover effect */
    &:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
        
        &::after {
            transform: scaleX(1);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
    }
    
    /* Animations keyframes */
    @keyframes titleSlideIn {
        0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes borderSlideIn {
        0% {
            transform: scaleX(0);
        }
        100% {
            transform: scaleX(1);
        }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        font-size: 32px;
        
        &::after {
            bottom: -6px;
            height: 2px;
        }
    }
    
    @media (max-width: 480px) {
        font-size: 28px;
        
        &::after {
            bottom: -5px;
            height: 2px;
        }
    }
`
const NomDocStyle = Styled.p`
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 700;
    font-size: 1.4em;
    padding: 8px 16px;
    margin: 0;
    white-space: nowrap;
    color: #1e293b;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    /* Effet de brillance subtil */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s ease;
    }
    
    /* Hover effects */
    &:hover {
        transform: translateY(-2px);
        border-color: #3b82f6;
        box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
        background: linear-gradient(135deg, #f1f5f9 0%, #dbeafe 100%);
        
        &::before {
            left: 100%;
        }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        font-size: 1.2em;
        padding: 6px 12px;
    }
    
    @media (max-width: 480px) {
        font-size: 1.1em;
        padding: 5px 10px;
    }
`
const Contenu = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 80px;
    padding: 10px 0;
`
const Chemin = Styled.div`
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 1.2em;
    display: flex;
`

function Barrehorizontal1({titrepage, imgprofil1, nomprofil, children, notificationCount = 0, userRole = 'USER'}){
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState(imgprofil1);
    const [globalNotificationCount, setGlobalNotificationCount] = useState(0);
    const userId = localStorage.getItem('id');

    // Fonction pour obtenir le titre approprié selon le rôle
    const getTitlePrefix = (role) => {
        // Nettoyer le rôle (enlever les guillemets si c'est une chaîne JSON)
        let cleanRole = role;
        if (typeof role === 'string' && role.startsWith('"') && role.endsWith('"')) {
            try {
                cleanRole = JSON.parse(role);
            } catch (error) {
                console.warn('Erreur lors du parsing du rôle:', error);
            }
        }
        
        switch (cleanRole) {
            case 'MEDECIN':
                return 'Dr.';
            case 'ADMIN':
                return 'Admin.';
            case 'SECRETAIRE':
                return 'Sec.';
            default:
                return '';
        }
    };

    // Récupérer la photo de profil actuelle
    useEffect(() => {
        let objectUrl;
    
        const fetchCurrentPhoto = async () => {
            const token = localStorage.getItem('token');
            if (userId && token) {
                try {
                    const response = await axiosInstance.get(`/utilisateurs/${userId}/photo`, {
                        responseType: 'blob',
                    });
    
                    objectUrl = URL.createObjectURL(response.data);
                    setCurrentPhotoUrl(objectUrl);
                } catch (error) {
                    console.error('Erreur récupération photo:', error);
                }
            }
        };
    
        fetchCurrentPhoto();
    
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [userId]);

    // Effet pour écouter les notifications globales
    useEffect(() => {
        // Récupérer toutes les notifications non lues depuis l'API (sans filtrer le type)
        const fetchNotifications = async () => {
            try {
                const userId = localStorage.getItem('id');
                if (userId) {
                    const apiNotifications = await notificationApi.getUnreadNotifications(userId);
                    setNotifications(apiNotifications);
                    setGlobalNotificationCount(apiNotifications.length);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des notifications:', error);
            }
        };
        fetchNotifications();
    }, [dropdownOpen]); // refresh à chaque ouverture

    // Marquer toutes les notifications comme lues à la fermeture du menu
    const handleDropdownClose = async () => {
        setDropdownOpen(false);
        try {
            // Marquer toutes comme lues côté API
            await Promise.all(notifications.map(n => notificationApi.markAsRead(n.id)));
            setNotifications([]);
            setGlobalNotificationCount(0);
        } catch (error) {
            console.error('Erreur lors du marquage comme lues:', error);
        }
    };
    

    const handlePhotoUpload = async (file) => {
        try {
            // Validation du fichier
            const maxSize = 15 * 1024 * 1024; // 15MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            
            if (file.size > maxSize) {
                if (window.showNotification) {
                    window.showNotification('Le fichier est trop volumineux (max 15MB)', 'error');
                }
                return;
            }
            
            if (!allowedTypes.includes(file.type)) {
                if (window.showNotification) {
                    window.showNotification('Format de fichier non supporté (JPG, PNG, GIF uniquement)', 'error');
                }
                return;
            }

            if (!userId || userId === 'null') {
                if (window.showNotification) {
                    window.showNotification('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.', 'error');
                }
                return;
            }

            // Créer FormData pour l'upload
            const formData = new FormData();
            formData.append('photoProfil', file);



            // Appel API pour uploader la photo
            const token = localStorage.getItem('token');
            const response = await axiosInstance.put(`/utilisateurs/${userId}/photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // La réponse contient les données utilisateur mises à jour
                const photoUrl = response.data?.photoProfil || response.data?.photo_profil;
                if (response.data && photoUrl) {
                    // Construire l'URL complète de la photo
                    const fullPhotoUrl = `${API_BASE}/utilisateurs/${userId}/photo`;
                    
                    // Mettre à jour la photo dans le localStorage et l'état local
                    localStorage.setItem('photoUrl', fullPhotoUrl);
                    setCurrentPhotoUrl(fullPhotoUrl);
                    
                    if (window.showNotification) {
                        window.showNotification('Photo de profil mise à jour avec succès !', 'success');
                    }
                } else {
                    // Fallback : essayer de récupérer la photo séparément
                    try {
                        const userRole = localStorage.getItem('user');
                        console.log('Tentative de récupération de la photo avec token:', token ? `${token.substring(0, 20)}...` : 'null');
                        console.log('Rôle utilisateur:', userRole);
                        const photoResponse = await axiosInstance.get(`/utilisateurs/${userId}/photo`);
                        
                        if (photoResponse.data) {
                            localStorage.setItem('photoUrl', photoResponse.data);
                            setCurrentPhotoUrl(photoResponse.data);
                        }
                        
                        if (window.showNotification) {
                            window.showNotification('Photo de profil mise à jour avec succès !', 'success');
                        }
                    } catch (photoError) {
                        console.error('Erreur lors de la récupération de la photo:', photoError);
                        console.log('PhotoError response:', photoError.response?.data);
                        if (window.showNotification) {
                            window.showNotification('Photo uploadée mais erreur lors de la récupération', 'warning');
                        }
                    }
                }
            }
            
        } catch (error) {
            console.error('Erreur lors de l\'upload de la photo:', error);
            let errorMessage = 'Erreur lors de l\'upload de la photo. Veuillez réessayer.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            } else if (error.response?.status === 403) {
                errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
            } else if (error.response?.status === 400) {
                errorMessage = `Paramètres invalides: ${error.response.data || 'Vérifiez le format du fichier'}`;
            } else if (error.response?.status === 404) {
                errorMessage = 'Endpoint de photo non disponible. Contactez l\'administrateur.';
            } else if (error.response?.status === 413) {
                errorMessage = 'Fichier trop volumineux.';
            }
            
            if (window.showNotification) {
                window.showNotification(errorMessage, 'error');
            }
        }
    };

    const handlePasswordChange = async ({ newPassword, confirmPassword }) => {
        try {
            if (!userId || userId === 'null') {
                throw new Error('ID utilisateur non trouvé');
            }

            // Appel API pour changer le mot de passe
            const token = localStorage.getItem('token');
            const response = await axiosInstance.put(`/utilisateurs/${userId}/password`, {
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });

            if (response.status === 200) {
                // Déconnexion automatique après changement de mot de passe
                if (window.showNotification) {
                    window.showNotification('Mot de passe modifié avec succès ! Vous allez être déconnecté.', 'success');
                }
                
                // Attendre un peu pour que l'utilisateur voie le message
                setTimeout(() => {
                    // Vider le localStorage
                    localStorage.clear();
                    // Rediriger vers la page de login
                    window.location.href = '/';
                }, 2000);
            }
            
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            let errorMessage = 'Erreur lors du changement de mot de passe. Veuillez réessayer.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            } else if (error.response?.status === 403) {
                errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Endpoint de changement de mot de passe non disponible. Contactez l\'administrateur.';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data?.message || 'Données invalides.';
            }
            
            throw new Error(errorMessage);
        }
    };

    // Menu déroulant notifications
    const DropdownMenu = styled.div`
        position: absolute;
        top: 60px;
        right: 0;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        min-width: 320px;
        z-index: 10000;
        padding: 0.5rem 0;
    `;
    const DropdownItem = styled.div`
        padding: 12px 18px;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        &:last-child { border-bottom: none; }
        &:hover { background: #f3f4f6; }
    `;

    return(<>
        <Barrehorizontal1Style>
            <Contenu>
                <TitreStyle>
                    {titrepage}
                </TitreStyle>
                <DivStyle style={{position:'relative'}}>
                    <div style={{position:'relative'}}>
                        <span onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <Cloche notificationCount={globalNotificationCount || notificationCount}/>
                        </span>
                        {dropdownOpen && (
                            <DropdownMenu onMouseLeave={handleDropdownClose}>
                                {notifications.length === 0 ? (
                                    <DropdownItem>Aucune notification</DropdownItem>
                                ) : notifications.map((n) => (
                                    <DropdownItem key={n.id}>
                                        <div style={{fontWeight:'bold'}}>{n.type || 'Notification'}</div>
                                        <div style={{fontSize:'13px',color:'#374151'}}>{n.contenu || 'Nouvelle notification'}</div>
                                        <div style={{fontSize:'11px',color:'#9ca3af'}}>{n.timeAgo || ''}</div>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        )}
                    </div>
                    <Photoprofil 
                        imgprofil={currentPhotoUrl}
                        onPhotoUpload={handlePhotoUpload}
                        onChangePassword={handlePasswordChange}
                        userId={userId}
                    />
                    <NomDocStyle>
                        {getTitlePrefix(userRole)} {nomprofil}
                    </NomDocStyle>
                </DivStyle> 
            </Contenu>
           <Chemin>
                {children}
           </Chemin>
        </Barrehorizontal1Style>
    </>)
}

export default Barrehorizontal1
