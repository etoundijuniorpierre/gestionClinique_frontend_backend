import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import '../../styles/add-buttons.css'
import '../../styles/action-buttons.css'
import '../../styles/formulaire.css'  // AJOUTER IMPORT MANQUANT
import Styled from 'styled-components'
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '../LoadingProvider';
import { handleApiError } from '../../utils/errorHandler';
import serviceMedicalService from '../../services/serviceMedicalService';
import axiosInstance from '../config/axiosConfig';

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

const FormContainer = Styled.div`
    background: white;
    padding: 32px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const FormGroup = Styled.div`
    margin-bottom: 24px;
`

const Label = Styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
`

const Input = Styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
`

const Select = Styled.select`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background: white;
    
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
`

const ButtonContainer = Styled.div`
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 32px;
`

const ButtonStyle = Styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
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
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #545b62;
    }
`

const MultiSelectContainer = Styled.div`
    position: relative;
`

const MultiSelect = Styled.select`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background: white;
    min-height: 80px;
    
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
`

const FormulaireServiceMedical = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        nomService: '',
        medecinResponsableId: '',
        medecinIds: []
    });

    const [medecins, setMedecins] = useState([]);
    const [errors, setErrors] = useState({});

    // Charger les médecins disponibles
    const loadMedecins = async () => {
        try {
            const response = await axiosInstance.get('api/utilisateurs/medecins');
            setMedecins(response.data);
        } catch (error) {
            handleApiError(error, 'Erreur lors du chargement des médecins');
        }
    };

    // Charger le service si en mode édition
    const loadService = async () => {
        if (!id) return;
        
        try {
            showLoading();
            const service = await serviceMedicalService.getServiceMedicalById(id);
            setFormData({
                nomService: service.nomService || '',
                medecinResponsableId: service.medecinResponsable?.id || '',
                medecinIds: service.medecinInfos?.map(medecin => medecin.id) || []
            });
        } catch (error) {
            handleApiError(error, 'Erreur lors du chargement du service médical');
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        loadMedecins();
        if (isEditing) {
            loadService();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Effacer l'erreur quand l'utilisateur commence à taper
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleMedecinsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData(prev => ({
            ...prev,
            medecinIds: selectedOptions
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nomService.trim()) {
            newErrors.nomService = 'Le nom du service est obligatoire';
        }

        if (!formData.medecinResponsableId) {
            newErrors.medecinResponsableId = 'Le médecin responsable est obligatoire';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            showLoading();
            
            if (isEditing) {
                await serviceMedicalService.updateServiceMedical(id, formData);
            } else {
                await serviceMedicalService.createServiceMedical(formData);
            }

            navigate('/admin/services-medicaux');
        } catch (error) {
            handleApiError(error, `Erreur lors de ${isEditing ? 'la mise à jour' : 'la création'} du service médical`);
        } finally {
            hideLoading();
        }
    };

    const handleCancel = () => {
        navigate('/admin/services-medicaux');
    };

    return (
        <div className='div1'>
            <div className='div2'>
                <SousDiv1Style>
                    <div className='divtitre'>
                        <h1 className='titreadmin'>
                            {isEditing ? 'Modifier un Service Médical' : 'Créer un Service Médical'}
                        </h1>
                    </div>
                </SousDiv1Style>
                <SousDiv2Style>
                    <FormContainer>
                        <form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label htmlFor="nomService">
                                    Nom du Service *
                                </Label>
                                <Input
                                    type="text"
                                    id="nomService"
                                    name="nomService"
                                    value={formData.nomService}
                                    onChange={handleChange}
                                    placeholder="Entrez le nom du service médical"
                                    className={errors.nomService ? 'error' : ''}
                                />
                                {errors.nomService && (
                                    <div className="error-message">{errors.nomService}</div>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="medecinResponsableId">
                                    Médecin Responsable *
                                </Label>
                                <Select
                                    id="medecinResponsableId"
                                    name="medecinResponsableId"
                                    value={formData.medecinResponsableId}
                                    onChange={handleChange}
                                    className={errors.medecinResponsableId ? 'error' : ''}
                                >
                                    <option value="">Sélectionner un médecin responsable</option>
                                    {medecins.map(medecin => (
                                        <option key={medecin.id} value={medecin.id}>
                                            {medecin.prenom} {medecin.nom}
                                        </option>
                                    ))}
                                </Select>
                                {errors.medecinResponsableId && (
                                    <div className="error-message">{errors.medecinResponsableId}</div>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="medecinIds">
                                    Médecins du Service
                                </Label>
                                <MultiSelectContainer>
                                    <MultiSelect
                                        id="medecinIds"
                                        name="medecinIds"
                                        multiple
                                        value={formData.medecinIds}
                                        onChange={handleMedecinsChange}
                                    >
                                        {medecins.map(medecin => (
                                            <option key={medecin.id} value={medecin.id}>
                                                {medecin.prenom} {medecin.nom}
                                            </option>
                                        ))}
                                    </MultiSelect>
                                </MultiSelectContainer>
                                <small>Sélectionnez plusieurs médecins en maintenant Ctrl/Cmd + clic</small>
                            </FormGroup>

                            <ButtonContainer>
                                <ButtonStyle type="submit">
                                    {isEditing ? 'Mettre à jour' : 'Créer'}
                                </ButtonStyle>
                                <ButtonAnnulerStyle type="button" onClick={handleCancel}>
                                    Annuler
                                </ButtonAnnulerStyle>
                            </ButtonContainer>
                        </form>
                    </FormContainer>
                </SousDiv2Style>
            </div>
        </div>
    );
};

export default FormulaireServiceMedical;
