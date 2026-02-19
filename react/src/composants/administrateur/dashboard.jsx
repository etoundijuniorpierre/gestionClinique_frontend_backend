
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../composants/config/axiosConfig';
import { API_BASE, STATS_ENDPOINTS } from '../../composants/config/apiconfig';
import '../../styles/dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofilDefault from '../../assets/photoDoc.png'
import iconutilisateurblanc from '../../assets/iconutilisateurdashboardblanc.svg'

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function Dashboard() {
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')
    const [imgprofil, setImgprofil] = useState(imgprofilDefault)
    const [statjour, setstatjour] = useState({})
    const [usersconnecte, setusersconnecte] = useState([])
    const [usersdisconnecte, setusersdisconnecte] = useState([])
    const [connexionadmin, setconnexionadmin] = useState([])
    const [historiques, sethistoriques] = useState([])
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [blobUrls, setBlobUrls] = useState([]) // Pour stocker les URLs des blobs
    const [monthlyrevenu, setMonthlyrevenu] = useState([])
    const [yearlyStats, setYearlyStats] = useState({})
    const [lastMonthStats, setLastMonthStats] = useState({})
    const [statsError, setStatsError] = useState(null)
    const [statsSuccess, setStatsSuccess] = useState(false)
    const [selectedStatsType, setSelectedStatsType] = useState('daily') // 'daily', 'monthly', 'lastMonth', 'yearly'
    const [datejour, setDatejour] = useState(new Date().toISOString().split('T')[0])
    // Récupération du nom et de la photo de profil de l'utilisateur connecté
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get(`utilisateurs/${idUser}`);
                if (response && response.data) {
                    setnomprofil(response.data.nom || '')
                    // Utiliser l'API de récupération des images par ID
                    if (response.data.id) {
                        try {
                            const photoResponse = await axiosInstance.get(`utilisateurs/${response.data.id}/photo`, {
                                responseType: 'blob'
                            });
                            if (photoResponse.data && photoResponse.data.size > 0) {
                                const imageUrl = URL.createObjectURL(photoResponse.data);
                                setImgprofil(imageUrl);
                                setBlobUrls(prev => [...prev, imageUrl]);
                            } else {
                                setImgprofil(imgprofilDefault);
                            }
                        } catch (photoError) {
                            console.log('Photo non disponible pour l\'utilisateur, utilisation de l\'image par défaut');
                            setImgprofil(imgprofilDefault);
                        }
                    } else {
                        setImgprofil(imgprofilDefault);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du profil utilisateur:', error);
                setImgprofil(imgprofilDefault);
                setnomprofil('Utilisateur');
            }
        }
        fetchUserProfile()
    }, [idUser]);

    // Récupération des statistiques journalières
    useEffect(() => {
        const token = localStorage.getItem('token');
    
        const statjournalier = async () => {
            try {
                const url = datejour
                    ? `${STATS_ENDPOINTS.DAILY}?date=${datejour}`
                    : STATS_ENDPOINTS.DAILY;
    
                const response = await axiosInstance.get(url);
    
                if (response && response.data) {
                    setstatjour(response.data || {});
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
                setstatjour({});
            }
        };
    
        statjournalier();
    }, [datejour]);    

    // Récupération des revenus mensuels
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchMonthlyrevenu = async () => {
            try {
                setStatsLoading(true);
                // Récupérer les données pour tous les mois de l'année en cours
                const currentYear = new Date().getFullYear();
                const monthlyData = [];

                for (let month = 1; month <= 12; month++) {
                    try {
                        const response = await axiosInstance.get(`${STATS_ENDPOINTS.MONTHLY}?month=${month}`);

                        if (response && response.data) {
                            // Extraire le chiffre d'affaires du mois
                            const revenu = response.data.chiffreAffaires || response.data.revenu || 0;
                            monthlyData.push(revenu);
                            console.log(`Mois ${month}: ${revenu} FCFA`);
                        } else {
                            monthlyData.push(0);
                            console.log(`Mois ${month}: Aucune donnée`);
                        }
                    } catch (monthError) {
                        console.error(`Erreur pour le mois ${month}:`, monthError);
                        monthlyData.push(0);
                        // Si c'est le premier mois qui échoue, on note l'erreur
                        if (month === 1) {
                            setStatsError(`Erreur lors du chargement des données pour le mois ${month}`);
                        }
                    }
                }

                setMonthlyrevenu(monthlyData);
                setStatsSuccess(true);
                setStatsError(null);
            } catch (error) {
                console.error('Erreur lors de la récupération des revenus mensuels:', error);
                setMonthlyrevenu([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                setStatsError('Erreur lors du chargement des revenus mensuels');
                setStatsSuccess(false);
            } finally {
                setStatsLoading(false);
            }
        }
        fetchMonthlyrevenu()
    }, []);

    // Récupération des statistiques annuelles
    useEffect(() => {
        const fetchYearlyStats = async () => {
            try {
                setStatsLoading(true);
                const currentYear = new Date().getFullYear();
                const response = await axiosInstance.get(`${STATS_ENDPOINTS.YEARLY}?year=${currentYear}`);

                if (response && response.data) {
                    setYearlyStats(response.data);
                    setStatsSuccess(true);
                    setStatsError(null);
                    console.log('Statistiques annuelles:', response.data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques annuelles:', error);
                setYearlyStats({});
                setStatsError('Erreur lors du chargement des statistiques annuelles');
                setStatsSuccess(false);
            } finally {
                setStatsLoading(false);
            }
        }
        fetchYearlyStats()
    }, []);

    // Récupération des statistiques du dernier mois
    useEffect(() => {
        const fetchLastMonthStats = async () => {
            try {
                const response = await axiosInstance.get(`${STATS_ENDPOINTS.MONTHLY}?month=last`);

                if (response && response.data) {
                    setLastMonthStats(response.data);
                    console.log('Statistiques du dernier mois:', response.data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques du dernier mois:', error);
                setLastMonthStats({});
            }
        }
        fetchLastMonthStats()
    }, []);

    // Récupération des utilisateurs connectés avec leur image de profil
    useEffect(() => {
        const token = localStorage.getItem('token');
        const utilisateursconnectes = async () => {
            try {
                const response = await axiosInstance.get(`utilisateurs/connected/last-activity`);
                if (response && response.data) {
                    // Pour chaque utilisateur, récupérer sa photo de profil via l'API
                    const usersWithImg = await Promise.all(
                        response.data.map(async user => {
                            try {
                                const photoResponse = await axiosInstance.get(`utilisateurs/${user.id}/photo`, {
                                    responseType: 'blob'
                                });
                                if (photoResponse.data && photoResponse.data.size > 0) {
                                    const imageUrl = URL.createObjectURL(photoResponse.data);
                                    setBlobUrls(prev => [...prev, imageUrl]);
                                    return { ...user, imgProfilUrl: imageUrl };
                                } else {
                                    return { ...user, imgProfilUrl: imgprofilDefault };
                                }
                            } catch (photoError) {
                                // Si pas de photo (404 ou autre erreur), utiliser l'image par défaut
                                return { ...user, imgProfilUrl: imgprofilDefault };
                            }
                        })
                    );
                    setusersconnecte(usersWithImg || [])
                    // Filtrer pour l'admin connecté
                    const adminUser = usersWithImg.find(user => user.id === parseInt(idUser))
                    if (adminUser) {
                        setconnexionadmin([adminUser])
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs connectés:', error);
                setusersconnecte([])
                setconnexionadmin([])
            }
        }
        utilisateursconnectes()
    }, [idUser]);

    // Récupération des utilisateurs déconnectés avec leur image de profil
    useEffect(() => {
        const token = localStorage.getItem('token');
        const utilisateursdeconnectes = async () => {
            try {
                const response = await axiosInstance.get(`utilisateurs/disconnected/last-activity`);
                if (response && response.data) {
                    const usersWithImg = await Promise.all(
                        response.data.map(async user => {
                            try {
                                const photoResponse = await axiosInstance.get(`utilisateurs/${user.id}/photo`, {
                                    responseType: 'blob'
                                });
                                if (photoResponse.data && photoResponse.data.size > 0) {
                                    const imageUrl = URL.createObjectURL(photoResponse.data);
                                    setBlobUrls(prev => [...prev, imageUrl]);
                                    return { ...user, imgProfilUrl: imageUrl };
                                } else {
                                    return { ...user, imgProfilUrl: imgprofilDefault };
                                }
                            } catch (photoError) {
                                // Si pas de photo (404 ou autre erreur), utiliser l'image par défaut
                                return { ...user, imgProfilUrl: imgprofilDefault };
                            }
                        })
                    );
                    setusersdisconnecte(usersWithImg || [])
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs déconnectés:', error);
                setusersdisconnecte([])
            }
        }
        utilisateursdeconnectes()
    }, []);

    // Nettoyage des URLs des blobs lors du démontage du composant
    useEffect(() => {
        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [blobUrls]);

    // Récupération de l'historique des actions
    useEffect(() => {
        const token = localStorage.getItem('token');
        const Historique = async () => {
            try {
                // Récupérer TOUTES les actions sans limitation
                const response = await axiosInstance.get(`historiqueActions`);
                if (response && response.data) {
                    // Trier du plus récent au plus ancien - Aucune limitation sur le nombre d'actions
                    const sortedHistorique = response.data.sort((a, b) => {
                        const dateA = new Date(a.dateAction || a.createdAt || 0);
                        const dateB = new Date(b.dateAction || b.createdAt || 0);
                        return dateB - dateA; // dateB - dateA = ordre décroissant (récent → ancien)
                    });
                    sethistoriques(sortedHistorique || [])
                } else {
                    sethistoriques([])
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'historique:', error);
                sethistoriques([])
            } finally {
                setLoading(false)
            }
        }
        Historique()
    }, [idUser]);

    // Fonction de recherche par mot-clé (filtrage côté frontend)
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fonction pour réessayer le chargement des statistiques
    const retryStats = () => {
        setStatsError(null);
        // Recharger les statistiques
        window.location.reload();
    };

    // Fonction pour obtenir les statistiques selon le type sélectionné
    const getCurrentStats = () => {
        const stats = (() => {
            switch (selectedStatsType) {
                case 'daily':
                    return statjour;
                case 'monthly':
                    return statjour; 
                case 'lastMonth':
                    return lastMonthStats;
                case 'yearly':
                    return yearlyStats;
                default:
                    return statjour;
            }
        })();
        return stats || {};
    };

    // Fonction pour obtenir le titre selon le type sélectionné
    const getStatsTitle = () => {
        switch (selectedStatsType) {
            case 'daily':
                return 'Statistiques du jour';
            case 'monthly':
                return 'Statistiques du mois actuel';
            case 'lastMonth':
                return 'Statistiques du dernier mois';
            case 'yearly':
                return 'Statistiques de l\'année';
            default:
                return 'Statistiques du jour';
        }
    };

    // Fonction pour gérer le changement de type de statistiques
    const handleStatsTypeChange = (newType) => {
        setSelectedStatsType(newType);
        // Réinitialiser les erreurs lors du changement
        setStatsError(null);
    };

    if (loading) {
        console.log('🔄 Dashboard en cours de chargement...');
        return (
            <div className="loading-container" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px',
                color: '#333'
            }}>
                <div>Chargement du dashboard...</div>
            </div>
        );
    }

    console.log('Dashboard prêt à s\'afficher', {
        statjour,
        usersconnecte: usersconnecte.length,
        historiques: historiques.length,
        nomprofil,
        imgprofil
    });

    return (
        <>
            {/* Header Section */}
            <div className="sous-div1">
                <Barrehorizontal1 titrepage="Dashboard" imgprofil1={imgprofil} nomprofil={nomprofil}>
                    <span className="span1">Home</span>
                </Barrehorizontal1>
            </div>

            {/* Main Dashboard Container */}
            <div className='zonedaffichage-dashboad'>
                {/* Dashboard Header */}
                <div className='numero'>
                    <h2 className='nomtable'>Statistiques globales</h2>
                </div>

                {/* Divider Bar */}
                <div className='conteneurbarre'>
                    <div className='barre'></div>
                </div>


                {/* Dashboard Grid Layout */}
                <div className='dashboard-grid'>
                    {/* Grid 1: Account Information */}
                    <div className='account-grid grid-1'>
                        <p className='grid-title title'>Ce compte</p>
                        <div className='grid-01'>
                            {/* Connection Info */}
                            <div className='grid-11 box-gid-01'>
                                <div className="grid-1-content-image">
                                    <img className='responsive-image' src={connexionadmin[0]?.imgProfilUrl || imgprofil} alt="profile" />
                                </div>

                                <div className='grid-11-content'>
                                    <p className='sous-grid-title'>Connecté depuis le</p>
                                    {connexionadmin && connexionadmin.length > 0 ? connexionadmin.map((connexion) => (
                                        <p className='grid-11-date' key={connexion.id}>
                                            {connexion && connexion.lastLoginDate ? (
                                                <>
                                                    {connexion.lastLoginDate.split("T")[0]} A <br />
                                                    <span className='grid-11-date-heure'>
                                                        {connexion.lastLoginDate.split("T")[1] ? connexion.lastLoginDate.split("T")[1].split(".")[0] : ''}
                                                    </span>
                                                </>
                                            ) : 'N/A'}
                                        </p>
                                    )) : <p className='grid-11-date'>Aucune donnée disponible</p>}
                                </div>
                            </div>

                            {/* Last Connection */}
                            <div className='grid-13 box-gid-01'>
                                <div className="grid-1-content-image">
                                    <img className='responsive-image' src={connexionadmin[0]?.imgProfilUrl || imgprofil} alt="profile" />
                                </div>

                                <div className='grid-11-content'>
                                    <p className='sous-grid-title'> Dernière connection </p>
                                    {connexionadmin && connexionadmin.length > 0 ? connexionadmin.map((connexion) => (
                                        <p className='grid-11-date' key={connexion.id}>
                                            {connexion && connexion.lastLogoutDate ? (
                                                <>
                                                    {connexion.lastLogoutDate.split("T")[0]}<br />
                                                    <span className='grid-11-date-heure'>
                                                        {connexion.lastLogoutDate.split("T")[1] ? connexion.lastLogoutDate.split("T")[1].split(".")[0] : ''}
                                                    </span>
                                                </>
                                            ) : 'N/A'}
                                        </p>
                                    )) : <p className='grid-11-date'>Aucune donnée disponible</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='historique-grid'>
                        <div className='historique-header'>
                            <p className='grid-3-title title'>Historique des actions</p>
                            <div className='search-container'>
                                <input
                                    type="text"
                                    placeholder="Rechercher par mot-clé..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className='search-input'
                                />
                                {/* isSearching && <div className='search-loading'>Recherche...</div> */}
                            </div>
                        </div>
                        <div className='grid-3-content'>
                            {/* Affichage des résultats de recherche ou de l'historique complet */}
                            <ul className='sous-grid-liste'>
                                {searchTerm.trim() ? (
                                    // Résultats de recherche par mot-clé (filtrage côté frontend)
                                    historiques.filter(historique =>
                                        historique.action && historique.action.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).length > 0 ? (
                                        historiques.filter(historique =>
                                            historique.action && historique.action.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map((historique) => (
                                            <li key={historique.id}>
                                                {historique.action || 'Action non spécifiée'}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Aucun résultat trouvé</li>
                                    )
                                ) : (
                                    // Historique complet trié du plus récent au plus ancien
                                    historiques && historiques.length > 0 ? (
                                        historiques.map((historique) => (
                                            <li key={historique.id}>
                                                {historique.action || 'Action non spécifiée'}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Aucune activité récente</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Grid 2: Today's Statistics */}
                    <div className='stats-grid grid-2'>
                        <div className='stats-header'>
                            <div className='stats-title-section'>
                                <select
                                    className='stats-selector'
                                    value={selectedStatsType}
                                    onChange={(e) => handleStatsTypeChange(e.target.value)}
                                >
                                    <option value="daily" className='stats-selector-option'>📅 Statistiques du jour</option>
                                    <option value="monthly" className='stats-selector-option'>📊 Statistiques du mois actuel</option>
                                    <option value="lastMonth" className='stats-selector-option'>📈 Statistiques du dernier mois</option>
                                    <option value="yearly" className='stats-selector-option'>📋 Statistiques de l'année</option>
                                </select>

                            </div>

                        </div>
                        <div className='grid-2-content'>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text">Patients enregistrés</p>
                                <div className="grid-2-content-chid-chiffre">{getCurrentStats().nbrPatientEnrg || 0}</div>
                            </div>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text">Nombre de RDV validés</p>
                                <div className="grid-2-content-chid-chiffre">{getCurrentStats().nbrRendezVousCONFIRME || 0}</div>
                            </div>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text">Nombre de RDV annulés</p>
                                <div className="grid-2-content-chid-chiffre">{getCurrentStats().nbrRendezANNULE || 0}</div>
                            </div>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text">Nombre de consultations effectuées</p>
                                <div className="grid-2-content-chid-chiffre">{getCurrentStats().nbrConsultation || 0}</div>
                            </div>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text">Chiffre d'affaires total</p>
                                <div className="grid-2-content-chid-chiffre">
                                    {getCurrentStats().revenu ? `${getCurrentStats().revenu.toLocaleString()} FCFA` : '0 FCFA'}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Grid 3: Connected Users */}
                    <div className='grid-3'>
                        <p className='grid-3-title title'>Etat des Connexions</p>
                        <div className='grid-3-content'>
                            {/* Section des utilisateurs connectés */}
                            <div className='section-title'>
                                <h4>Utilisateurs connectés</h4>
                            </div>
                            {usersconnecte && usersconnecte.length > 0 ? usersconnecte.map((user) => (
                                <div key={user.id} className='grid-31'>
                                    <div className="content-image img-connecte">
                                        <img className='responsive-image img-connecte' src={user.imgProfilUrl || imgprofilDefault} alt="profile" />
                                        <div className='img-nom'>
                                            <p>{user.nom}.</p>
                                        </div>
                                    </div>

                                    <div className='grid-31-content'>
                                        <p className='sous-grid-3-title'>Connecté depuis le</p>
                                        <p className='grid-31-date'>
                                            {user && user.lastLoginDate ? (
                                                <>
                                                    {user.lastLoginDate.split("T")[0]} à
                                                    <br />
                                                    <span className='grid-31-date-heure'>
                                                        {user.lastLoginDate.split("T")[1] ? user.lastLoginDate.split("T")[1].split(".")[0] : ''}
                                                    </span>
                                                </>
                                            ) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )) : <div className='grid-31'><p>Aucun utilisateur connecté</p></div>}

                            {/* Section des utilisateurs déconnectés */}
                            {usersdisconnecte && usersdisconnecte.length > 0 && (
                                <>
                                    <div className='section-title'>
                                        <h4>Utilisateurs déconnectés</h4>
                                    </div>
                                    {usersdisconnecte.map((user) => (
                                        <div key={user.id} className='grid-31 disconnect'>
                                            <div className="content-image img-connecte">
                                                <img className='responsive-image img-connecte' src={user.imgProfilUrl || imgprofilDefault} alt="profile" />
                                                <div className='img-nom'>
                                                    <p>{user.nom}</p>
                                                </div>
                                            </div>


                                            <div className='grid-31-content'>
                                                <p className='sous-grid-3-title'>Dernière connexion</p>
                                                <p className='grid-31-date'>
                                                    {user && user.lastLogoutDate ? (
                                                        <>
                                                            {user.lastLogoutDate.split("T")[0]} à
                                                            <br />
                                                            <span className='grid-31-date-heure'>
                                                                {user.lastLogoutDate.split("T")[1] ? user.lastLogoutDate.split("T")[1].split(".")[0] : ''}
                                                            </span>
                                                        </>
                                                    ) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Grid 4: revenu Chart */}
                    <div className='grid-4'>
                        <p className='grid-title chart title'>
                            Chiffre d'affaires par mois (en FCFA)
                            {statsSuccess && <span className='success-indicator'>✓</span>}
                        </p>
                        <div className='line-chart'>
                            {statsLoading ? (
                                <div className='chart-loading'>
                                    <div>Chargement des données...</div>
                                </div>
                            ) : statsError ? (
                                <div className='chart-error'>
                                    <div>{statsError}</div>
                                    <button
                                        className='retry-button'
                                        onClick={retryStats}
                                    >
                                        Réessayer
                                    </button>
                                </div>
                            ) : (
                                <Line
                                    data={{
                                        labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
                                        datasets: [
                                            {
                                                label: "revenu",
                                                data: (monthlyrevenu && monthlyrevenu.length > 0) ? monthlyrevenu : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                                backgroundColor: "white",
                                                borderColor: "rgba(159, 159, 255, 1)",
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        elements: {
                                            line: {
                                                tension: 0,
                                            },
                                        },
                                        plugins: {
                                            title: {
                                                text: "Monthly revenu & Cost",
                                            },
                                        },
                                    }}
                                />
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar Information */}

                <div className='barre-dashboard'>

                    <img className='image-barre' src={iconutilisateurblanc} alt="users" />
                    <p>Uti. connecté : {usersconnecte.length}</p>

                </div>

            </div>

        </>
    )
}

export default Dashboard
