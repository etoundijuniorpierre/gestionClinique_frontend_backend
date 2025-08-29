import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/apiconfig';
import axiosInstance from '../config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png';
import { ConfirmationModal } from '../shared/UnifiedModal';
import '../../styles/add-buttons.css'

const SousDiv1Style = Styled.div`
  width: 99%;
  padding-left: 1%;
`;

const Span2 = Styled.span``;

const Span1 = Styled.span`
  cursor: pointer;
`;

const Affichedetailuser = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = Styled.div`
  position: relative;
  overflow: hidden;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  font-family: sans-serif;
  border: 1px solid rgba(217, 217, 217, 1);
  
  &::before {
    message: '';
    position: absolute;
    inset: 0;
    background-image: url(${fondImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.1;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Title = Styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title1 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;

const Title2 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(159, 159, 255, 1);
  padding-bottom: 10px;
  font-family: Roboto;
  cursor: pointer;
`;

const TraitHorizontal = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(159, 159, 255, 1);
  margin-bottom: 20px;
`;

const FormRow = Styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const FormGroup = Styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Form = Styled.form`
  margin: 0;
  padding-left: 0;
  width: 766px;
`;

const Label = Styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: rgba(51, 51, 51, 1);
`;

const Input = Styled.input`
  padding: 10px;
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 8px;
  width: 351px;
  color: rgba(30, 30, 30, 1);
  &:focus {
    border: 1px solid rgba(159, 159, 255, 1);
    outline: none;
  }
`;

const Select = Styled.select`
  min-width: 351px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  &:focus {
    border: 1px solid rgba(159, 159, 255, 1);
    outline: none;
  }
`;

const TextArea = Styled.textarea`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  min-width: 351px;
  min-height: 80px;
  &:focus {
    border: 1px solid rgba(159, 159, 255, 1);
    outline: none;
  }
`;

const ButtonRow = Styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
  padding-left: 32px;
  padding-right: 32px;
`;

const Button = Styled.button`
  &:hover {
    background-color: ${props => props.primary ? 'rgba(139, 139, 235, 1)' : 'rgba(239, 239, 255, 1)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = Styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
`;

const InfoMessage = Styled.span`
  color: #3498db;
  font-size: 12px;
  margin-top: 4px;
  font-style: italic;
`;

const HelpMessage = Styled.span`
  color: #7f8c8d;
  font-size: 11px;
  margin-top: 2px;
  font-style: italic;
`;

// Style pour le formulaire flouté quand le statut est TERMINE
const BlurredFormContainer = Styled(FormContainer)`
  filter: blur(2px);
  pointer-events: none;
  opacity: 0.6;
`;

// Message d'information sur le statut
const StatusMessage = Styled.div`
  background-color: ${props => {
    if (props.status === 'TERMINE') return 'rgba(255, 193, 7, 0.1)';
    if (props.status === 'CONFIRME') return 'rgba(40, 167, 69, 0.1)';
    return 'rgba(108, 117, 125, 0.1)';
  }};
  border: 1px solid ${props => {
    if (props.status === 'TERMINE') return 'rgba(255, 193, 7, 0.3)';
    if (props.status === 'CONFIRME') return 'rgba(40, 167, 69, 0.3)';
    return 'rgba(108, 117, 125, 0.3)';
  }};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
  color: ${props => {
    if (props.status === 'TERMINE') return '#856404';
    if (props.status === 'CONFIRME') return '#155724';
    return '#495057';
  }};
`;

const ModifierRendezVous = () => {
  const idUser = localStorage.getItem('id');
  const { id } = useParams();
  const [nomprofil, setnomprofil] = useState('');
  const [rendezvous, setRendezvous] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [isloading, setisloading] = useState(true);
  const [medecins, setMedecins] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    heure: '',
    jour: '',
    notes: '',
    serviceMedical: '',
    medecinId: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nomutilisateur = async () => {
      try {
        const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
        if (response) {
          setnomprofil(response.data.nom);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };
    nomutilisateur();
  }, [idUser]);

  useEffect(() => {
    const fetchRendezvous = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get(`/rendezvous/${id}`);
        const rdv = response.data;
        setRendezvous(rdv);
        setFormData({
          patientId: rdv.patientId || '',
          heure: rdv.heure || '',
          jour: rdv.jour || '',
          notes: rdv.notes || '',
          serviceMedical: rdv.serviceMedical || '',
          medecinId: rdv.medecinId || '',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du rendez-vous:', error);
        setErreur('Erreur lors du chargement');
      } finally {
        setisloading(false);
      }
    };
    fetchRendezvous();
  }, [id]);

  useEffect(() => {
    const fetchMedecins = async () => {
      // Ne récupérer les médecins que si on a une date, heure et service médical
      if (!formData.jour || !formData.heure || !formData.serviceMedical) {
        setMedecins([]);
        return;
      }

      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get(`/utilisateurs/available/${formData.serviceMedical}?jour=${formData.jour}&heure=${formData.heure}`);
        setMedecins(response.data);
        
        // Notification du nombre de médecins disponibles
        if (window.showNotification) {
          if (response.data.length > 0) {
            window.showNotification(`${response.data.length} médecin(s) disponible(s) pour ce créneau`, "success");
          } else {
            window.showNotification("Aucun médecin disponible pour ce créneau", "warning");
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des médecins disponibles:', error);
        setMedecins([]);
        if (window.showNotification) {
          window.showNotification("Erreur lors de la récupération des médecins disponibles", "error");
        }
      }
    };
    fetchMedecins();
  }, [formData.jour, formData.heure, formData.serviceMedical]);

  const navigate = useNavigate();
  
  const handleClick = () => {
    if (window.showNotification) {
      window.showNotification("Retour à la liste des rendez-vous", "info");
    }
    navigate('/secretaire/rendezvous');
  };

  const handleViewClick = () => {
    if (window.showNotification) {
      window.showNotification("Affichage des détails du rendez-vous", "info");
    }
    navigate(`/secretaire/rendezvous/viewrendezvous/${id}`);
  };

  const handleAnnuler = () => {
    if (window.showNotification) {
      window.showNotification("Annulation de la modification du rendez-vous", "info");
    }
    navigate(`/secretaire/rendezvous/viewrendezvous/${id}`);
  };

  // Fonction pour déterminer si un champ peut être modifié selon le statut
  const canEditField = (fieldName) => {
    if (rendezvous?.statut === 'TERMINE') {
      return false; // Aucun champ modifiable si TERMINE
    }
    
    if (rendezvous?.statut === 'CONFIRME') {
      // Seulement la date et l'heure peuvent être modifiées si CONFIRME
      return fieldName === 'jour' || fieldName === 'heure';
    }
    
    // Pour les autres statuts, tous les champs sont modifiables
    return true;
  };

  // Fonction pour obtenir le message de statut approprié
  const getStatusMessage = () => {
    if (rendezvous?.statut === 'TERMINE') {
      return "Ce rendez-vous est terminé et ne peut plus être modifié";
    }
    if (rendezvous?.statut === 'CONFIRME') {
      return "Ce rendez-vous est confirmé. Seule la date et l'heure peuvent être modifiées";
    }
    return null;
  };

  // Fonction pour valider l'heure (entre 7h00 et 20h00)
  const validateTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 7 * 60; // 7h00
    const maxMinutes = 20 * 60; // 20h00
    return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
  };

  // Fonction pour valider la date (pas de date antérieure à aujourd'hui)
  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si le statut est TERMINE, ne pas permettre de modification
    if (rendezvous?.statut === 'TERMINE') {
      return;
    }
    
    // Mettre à jour le formulaire sans validation immédiate
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser les erreurs pour ce champ
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Fonction pour valider un champ spécifique après la saisie
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Si le statut est TERMINE, ne pas permettre de validation
    if (rendezvous?.statut === 'TERMINE') {
      return;
    }
    
    // Validation seulement quand l'utilisateur quitte le champ
    if (name === 'jour' && value) {
      if (!validateDate(value)) {
        setFieldErrors(prev => ({ ...prev, [name]: 'La date ne peut pas être antérieure à aujourd\'hui' }));
        if (window.showNotification) {
          window.showNotification("Date invalide : ne peut pas être antérieure à aujourd'hui", "error");
        }
      }
    }
    
    if (name === 'heure' && value) {
      if (!validateTime(value)) {
        setFieldErrors(prev => ({ ...prev, [name]: 'L\'heure doit être entre 7h00 et 20h00' }));
        if (window.showNotification) {
          window.showNotification("Heure invalide : doit être entre 7h00 et 20h00", "error");
        }
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    // Si le statut est TERMINE, ne pas valider
    if (rendezvous?.statut === 'TERMINE') {
      return false;
    }

    if (!formData.medecinId) {
      errors.medecinId = 'Le médecin est obligatoire';
      hasErrors = true;
    }

    if (!formData.jour) {
      errors.jour = 'La date est obligatoire';
      hasErrors = true;
    } else if (!validateDate(formData.jour)) {
      errors.jour = 'La date ne peut pas être antérieure à aujourd\'hui';
      hasErrors = true;
    }

    if (!formData.heure) {
      errors.heure = 'L\'heure est obligatoire';
      hasErrors = true;
    } else if (!validateTime(formData.heure)) {
      errors.heure = 'L\'heure doit être entre 7h00 et 20h00';
      hasErrors = true;
    }

    if (!formData.serviceMedical) {
      errors.serviceMedical = 'Le service médical est obligatoire';
      hasErrors = true;
    }

    setFieldErrors(errors);
    
    if (hasErrors && window.showNotification) {
      window.showNotification("Veuillez corriger les erreurs dans le formulaire", "error");
    }
    
    return !hasErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Si le statut est TERMINE, ne pas permettre de soumission
    if (rendezvous?.statut === 'TERMINE') {
      if (window.showNotification) {
        window.showNotification("Impossible de modifier un rendez-vous terminé", "error");
      }
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    // Validation supplémentaire : vérifier que la date et l'heure ne sont pas dans le passé
    const selectedDateTime = new Date(`${formData.jour}T${formData.heure}`);
    const now = new Date();
    
    if (selectedDateTime <= now) {
      setFieldErrors(prev => ({
        ...prev,
        jour: 'La date et l\'heure ne peuvent pas être dans le passé',
        heure: 'La date et l\'heure ne peuvent pas être dans le passé'
      }));
      return;
    }

    // Ouvrir la modal de confirmation
    setShowConfirmation(true);
  };

  const handleConfirmModification = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);
    
    const token = localStorage.getItem('token');
    
    try {
      // Préparer les données à envoyer selon le statut
      let dataToSend = {};
      
      if (rendezvous?.statut === 'CONFIRME') {
        // Si CONFIRME, ne modifier que la date et l'heure
        dataToSend = {
          jour: formData.jour,
          heure: formData.heure
        };
      } else {
        // Pour les autres statuts, envoyer toutes les données
        dataToSend = formData;
      }
      
      await axiosInstance.put(`/rendezvous/${id}`, dataToSend);

      // Afficher un message de succès approprié
      if (window.showNotification) {
        if (rendezvous?.statut === 'CONFIRME') {
          window.showNotification("Date et heure du rendez-vous modifiées avec succès", "success");
        } else {
          window.showNotification("Rendez-vous modifié avec succès", "success");
        }
      }

      // Rediriger vers la vue détaillée
      navigate(`/secretaire/rendezvous/viewrendezvous/${id}`);
    } catch (error) {
      console.error('Erreur lors de la modification du rendez-vous:', error);
      
      let errorMessage = "Erreur lors de la modification du rendez-vous";
      if (error.response?.status === 409) {
        errorMessage = "Conflit de planning : ce créneau est déjà pris";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      if (window.showNotification) {
        window.showNotification(errorMessage, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!rendezvous) {
    return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  }
  
  if (isloading) return <p>Chargement...</p>;
  
  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;

  // Déterminer le composant de formulaire à utiliser selon le statut
  const FormComponent = rendezvous?.statut === 'TERMINE' ? BlurredFormContainer : FormContainer;

  return (
    <>
      <SousDiv1Style>
        <Barrehorizontal1 titrepage="Gestion des rendez-vous" imgprofil1={imgprofil} nomprofil={nomprofil}>
          <Span1 onClick={handleClick}>Liste des rendez-vous</Span1>
          <Span2> {">"} Modifier le rendez-vous</Span2>
        </Barrehorizontal1>
      </SousDiv1Style>
      
      <Affichedetailuser>
        <Form onSubmit={handleSubmit}>
          <FormComponent>
            <Title>
              <Title1>Modifier le rendez-vous</Title1>
              <Title2 onClick={handleViewClick}>Voir les détails</Title2>
            </Title>
            
            <TraitHorizontal></TraitHorizontal>
            
            {/* Message d'information sur le statut */}
            {getStatusMessage() && (
              <StatusMessage status={rendezvous?.statut}>
                {getStatusMessage()}
              </StatusMessage>
            )}
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="patientId">Patient</Label>
                <Input
                  id="patientId"
                  name="patientId"
                  value={rendezvous.patientNomComplet || 'Non assigné'}
                  readOnly
                  style={{width: '100%'}}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="jour">Date *</Label>
                <Input
                  id="jour"
                  name="jour"
                  type="date"
                  value={formData.jour}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldErrors.jour ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={!canEditField('jour')}
                />
                {fieldErrors.jour && <ErrorMessage>{fieldErrors.jour}</ErrorMessage>}
                <HelpMessage>Date minimale : aujourd'hui</HelpMessage>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="heure">Heure *</Label>
                <Input
                  id="heure"
                  name="heure"
                  type="time"
                  value={formData.heure}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldErrors.heure ? 'error' : ''}
                  min="07:00"
                  max="20:00"
                  disabled={!canEditField('heure')}
                />
                {fieldErrors.heure && <ErrorMessage>{fieldErrors.heure}</ErrorMessage>}
                <HelpMessage>Heures autorisées : 7h00 à 20h00</HelpMessage>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="serviceMedical">Service médical *</Label>
                <Select
                  id="serviceMedical"
                  name="serviceMedical"
                  value={formData.serviceMedical}
                  onChange={handleChange}
                  className={fieldErrors.serviceMedical ? 'error' : ''}
                  disabled={!canEditField('serviceMedical')}
                >
                  <option value="">Sélectionner un service</option>
                  <option value="MEDECINE_GENERALE">Médecine Générale</option>
                  <option value="PEDIATRIE">Pédiatrie</option>
                  <option value="GYNECOLOGIE">Gynécologie</option>
                  <option value="CARDIOLOGIE">Cardiologie</option>
                  <option value="DERMATOLOGIE">Dermatologie</option>
                  <option value="OPHTALMOLOGIE">Ophtalmologie</option>
                  <option value="ORTHOPEDIE">Orthopédie</option>
                  <option value="RADIOLOGIE">Radiologie</option>
                  <option value="LABORATOIRE_ANALYSES">Laboratoire d'Analyses</option>
                  <option value="URGENCES">Urgences</option>
                  <option value="KINESITHERAPIE">Kinésithérapie</option>
                  <option value="DENTISTE">Dentiste</option>
                  <option value="PSYCHIATRIE">Psychiatrie</option>
                  <option value="NEUROLOGIE">Neurologie</option>
                  <option value="GASTRO_ENTEROLOGIE">Gastro-entérologie</option>
                  <option value="PNEUMOLOGIE">Pneumologie</option>
                  <option value="ENDOCRINOLOGIE">Endocrinologie</option>
                  <option value="RHUMATOLOGIE">Rhumatologie</option>
                </Select>
                {fieldErrors.serviceMedical && <ErrorMessage>{fieldErrors.serviceMedical}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="medecinId">Médecin *</Label>
                <Select
                  id="medecinId"
                  name="medecinId"
                  value={formData.medecinId}
                  onChange={handleChange}
                  className={fieldErrors.medecinId ? 'error' : ''}
                  disabled={!canEditField('medecinId') || !formData.jour || !formData.heure || !formData.serviceMedical}
                >
                  <option value="">
                    {!formData.jour || !formData.heure || !formData.serviceMedical 
                      ? 'Sélectionnez d\'abord la date, heure et service' 
                      : 'Sélectionner un médecin'}
                  </option>
                  {medecins.map((medecin) => (
                    <option key={medecin.id} value={medecin.id}>
                      {medecin.nom} {medecin.prenom}
                    </option>
                  ))}
                </Select>
                {fieldErrors.medecinId && <ErrorMessage>{fieldErrors.medecinId}</ErrorMessage>}
                {!fieldErrors.medecinId && medecins.length > 0 && (
                  <InfoMessage>{medecins.length} médecin(s) disponible(s) pour ce créneau</InfoMessage>
                )}
                {!fieldErrors.medecinId && medecins.length === 0 && formData.jour && formData.heure && formData.serviceMedical && (
                  <InfoMessage>Aucun médecin disponible pour ce créneau</InfoMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="notes">Notes</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Notes optionnelles sur le rendez-vous..."
                  disabled={!canEditField('notes')}
                />
              </FormGroup>
            </FormRow>
          </FormComponent>
          
          <ButtonRow>
            <Button type="button" className="cancel-button" onClick={handleAnnuler}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting || rendezvous?.statut === 'TERMINE'}
            >
              {isSubmitting ? 'Modification...' : 'Modifier le rendez-vous'}
            </Button>
          </ButtonRow>
        </Form>
      </Affichedetailuser>
      
      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          if (window.showNotification) {
            window.showNotification("Modification annulée", "info");
          }
          setShowConfirmation(false);
        }}
        title="Confirmer la modification"
        message="Êtes-vous sûr de vouloir modifier ce rendez-vous ?"
        confirmText="Modifier"
        cancelText="Annuler"
        onConfirm={handleConfirmModification}
        confirmType="warning"
      />
    </>
  );
}

export default ModifierRendezVous; 
