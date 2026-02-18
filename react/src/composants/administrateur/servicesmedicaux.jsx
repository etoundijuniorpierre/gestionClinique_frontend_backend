import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import '../../styles/add-buttons.css'
import '../../styles/action-buttons.css'
import '../../styles/rendezvous-status.css'
import Styled from 'styled-components'
import React, { useState, useEffect } from 'react';
import Barrehorizontal1 from '../barrehorizontal1';
import iconrecherche from '../../assets/iconrecherche.png'
import iconsupprime from '../../assets/Iconsupprime.svg'
import iconmodif from '../../assets/Edit 4.png'
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';
import Pagination from '../shared/Pagination';
import { handleApiError } from '../../utils/errorHandler';
import serviceMedicalService from '../../services/serviceMedicalService';

console.log('🏥 ServicesMedicaux component loaded');

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

const Containbouttonpopup = Styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
`

const ButtonStyle = Styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`

const ButtonAnnulerStyle = Styled.button`
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #545b62;
    }
`

const ServicesMedicaux = () => {
    console.log('🏥 ServicesMedicaux component rendering');
    
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const { showConfirmation } = useConfirmation();

    // Charger les services médicaux
    const loadServices = async () => {
        try {
            showLoading();
            const data = await serviceMedicalService.getAllServicesMedicaux();
            setServices(data);
            setFilteredServices(data);
        } catch (error) {
            handleApiError(error, 'Erreur lors du chargement des services médicaux');
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    // Filtrage des services
    useEffect(() => {
        const filtered = services.filter(service =>
            service.nomService?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.medecinResponsable?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.medecinResponsable?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServices(filtered);
        setCurrentPage(1);
    }, [searchTerm, services]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
    const calculatedTotalPages = Math.ceil(filteredServices.length / itemsPerPage);
    
    // Mettre à jour le state totalPages
    useEffect(() => {
        setTotalPages(calculatedTotalPages);
    }, [calculatedTotalPages]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Suppression d'un service
    const handleDelete = async (service) => {
        const confirmed = await showConfirmation(
            'Confirmer la suppression',
            `Êtes-vous sûr de vouloir supprimer le service "${service.nomService}" ?`
        );

        if (confirmed) {
            try {
                showLoading();
                await serviceMedicalService.deleteServiceMedical(service.id);
                await loadServices(); // Recharger la liste
            } catch (error) {
                handleApiError(error, 'Erreur lors de la suppression du service médical');
            } finally {
                hideLoading();
            }
        }
    };

    // Formatage de la date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <div className='div1'>
            <Barrehorizontal1 />
            <div className='div2'>
                <SousDiv1Style>
                    <div className='divtitre'>
                        <h1 className='titreadmin'>Gestion des Services Médicaux</h1>
                    </div>
                </SousDiv1Style>
                <SousDiv2Style>
                    <div className='divrecherche'>
                        <input
                            type="text"
                            placeholder="Rechercher un service médical..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="inputrecherche"
                        />
                        <img src={iconrecherche} alt="recherche" className='iconrecherche' />
                    </div>

                    <div className='divadd'>
                        <Link to="/admin/services-medicaux/creer">
                            <button className='bouttonajouter'>
                                <span style={{ marginRight: '8px', fontSize: '1.2em' }}>+</span>
                                Ajouter un Service Médical
                            </button>
                        </Link>
                    </div>

                    <div className='tableau-container'>
                        <table className='tableau'>
                            <thead>
                                <tr>
                                    <th>Nom du Service</th>
                                    <th>Médecin Responsable</th>
                                    <th>Nombre de Médecins</th>
                                    <th>Date de Création</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((service) => (
                                        <tr key={service.id}>
                                            <td>{service.nomService}</td>
                                            <td>
                                                {service.medecinResponsable ? 
                                                    `${service.medecinResponsable.prenom} ${service.medecinResponsable.nom}` 
                                                    : '-'
                                                }
                                            </td>
                                            <td>
                                                {service.medecinInfos ? service.medecinInfos.length : 0}
                                            </td>
                                            <td>{formatDate(service.creationDate)}</td>
                                            <td>
                                                <div className='action-buttons'>
                                                    <Span1 onClick={() => navigate(`/admin/services-medicaux/modifier/${service.id}`)}>
                                                        <img src={iconmodif} alt="modifier" className='iconaction' />
                                                    </Span1>
                                                    <Span1 onClick={() => handleDelete(service)}>
                                                        <img src={iconsupprime} alt="supprimer" className='iconaction' />
                                                    </Span1>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className='text-center'>
                                            {searchTerm ? 'Aucun service trouvé pour cette recherche' : 'Aucun service médical disponible'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </SousDiv2Style>
            </div>
        </div>
    );
};

export default ServicesMedicaux;
