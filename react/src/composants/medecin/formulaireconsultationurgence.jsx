import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig';
import axiosInstance from '../config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import FormulairePrescription from './formulaireprescription';
import '../../styles/add-buttons.css'
import { useConfirmation } from '../ConfirmationProvider';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import PrescriptionPDF from '../generateurPdfPrescription';

const FormContainer = Styled.div`
  position: relative;
  overflow: hidden;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  font-family: sans-serif;
  border: 1px solid rgba(217, 217, 217, 1);
  
  &::before {
    content: '';
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

const SousDiv1Style = Styled.div`
 width: 99%;
`;

const Span2 = Styled.span``;

const Span1 = Styled.span`
    cursor: pointer;
`;

const Afficheformulaireadd = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;

const UrgencyTitle = Styled.h1`
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 600;
  color: #dc2626;
  text-align: center;
  font-family: Roboto;
`;

const UrgencyBadge = Styled.div`
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
`;

const TraitHorizontal = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(220, 38, 38, 1);
  margin-bottom: 20px;
`;

const TraitHorizontal2 = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(217, 217, 217, 1);
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
  padding-left:0;
  width: 766px;
`;

const Label = Styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333333;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`;

const Input = Styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 351px;
  height: 44px;
  color: #333333;
  background-color: #ffffff;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  
  &:focus{
    border: 1px solid #dc2626;
    outline: none;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Select = Styled.select`
  min-width: 351px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 44px;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    border: 1px solid #dc2626;
    outline: none;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const TextArea = Styled.textarea`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 351px;
  height: 44px;
  color: #333333;
  background-color: #ffffff;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  resize: vertical;
  min-height: 44px;
  
  &:focus{
    border: 1px solid #dc2626;
    outline: none;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonRow = Styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 32px;
`;

// Composant Modal pour afficher les informations de la consultation créée
const ConsultationSuccessModal = ({ isOpen, onClose, consultationData, prescriptionData, onGeneratePDF, isLoading, autoGeneratePDF, setAutoGeneratePDF }) => {
  if (!isOpen || !consultationData) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          animation: 'slideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h3 style={{
            margin: 0,
            color: '#dc2626',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif'
          }}>
            🚨 Consultation d'urgence créée avec succès !
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              padding: 0,
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Message de paiement */}
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f59e0b',
            textAlign: 'center'
          }}>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              color: '#92400e', 
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              💰 Paiement de la consultation
            </h4>
            <p style={{
              margin: 0,
              color: '#92400e',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong>Important :</strong> Veuillez vous diriger vers la secrétaire pour régler le paiement de cette consultation d'urgence.
            </p>
            <p style={{
              margin: '8px 0 0 0',
              color: '#92400e',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Une facture a été automatiquement générée pour cette consultation.
            </p>
          </div>

          <div style={{
            backgroundColor: '#fef2f2',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #dc2626'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#991b1b', fontSize: '1.3rem' }}>Informations de la consultation d'urgence</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div><strong>Date:</strong> {new Date(consultationData.creationDate).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</div>
              <div><strong>Température:</strong> {consultationData.temperature}°C</div>
              <div><strong>Poids:</strong> {consultationData.poids} kg</div>
              <div><strong>Taille:</strong> {consultationData.taille} cm</div> 
              <div><strong>Tension Arterielle:</strong> {consultationData.tensionArterielle} mmHg</div>
              <div><strong>Motifs:</strong> {consultationData.motifs}</div>
              <div><strong>Diagnostic:</strong> {consultationData.diagnostic}</div>
              <div><strong>Compte Rendu:</strong> {consultationData.compteRendu}</div>
            </div>
          </div>

          {prescriptionData && (
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #22c55e'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '1.3rem' }}>Prescription créée</h4>
              <div style={{ fontSize: '14px' }}>
                <div><strong>Type:</strong> {prescriptionData.typePrescription}</div>
                <div><strong>Médicaments:</strong> {prescriptionData.medicaments}</div>
                <div><strong>Quantité:</strong> {prescriptionData.quantite}</div>
                <div><strong>Instructions:</strong> {prescriptionData.instructions}</div>
                <div><strong>Durée:</strong> {prescriptionData.dureePrescription}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: '0 24px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <button
            onClick={onGeneratePDF}
            disabled={isLoading || !prescriptionData}
            style={{
              backgroundColor: prescriptionData ? '#dc2626' : '#ccc',
              color: 'white',
              border: '1px solid #dc2626',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
              cursor: prescriptionData && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              if (prescriptionData && !isLoading) {
                e.target.style.backgroundColor = '#b91c1c';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (prescriptionData && !isLoading) {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? '⏳ Génération en cours...' : '📄 Générer le PDF de la prescription'}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <input
              type="checkbox"
              id="autoGeneratePDF"
              checked={autoGeneratePDF}
              onChange={(e) => setAutoGeneratePDF(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />
            <label 
              htmlFor="autoGeneratePDF"
              style={{
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Générer automatiquement le PDF lors de la fermeture
            </label>
          </div>

          <button 
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.borderColor = '#999';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#ddd';
            }}
          >
            Fermer et retourner à la liste
          </button>
        </div>
      </div>
    </div>
  );
};

const FormulaireConsultationUrgence = () => {
  const { showConfirmation } = useConfirmation();
  const navigate = useNavigate();

  const idUser = localStorage.getItem('id');
  const [nomprofil, setnomprofil] = useState('');
  const [canCreateUrgence, setCanCreateUrgence] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nomutilisateur = async () => {
      try {
        const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
        console.log(token);
        if (response) {
          setnomprofil(response.data.nom)
          const rawService = response.data?.serviceMedicalName ?? response.data?.serviceNom ?? response.data?.serviceMedical?.nom ?? response.data?.serviceMedical?.name ?? response.data?.serviceMedical ?? '';
          const serviceName = typeof rawService === 'string' ? rawService.trim().toUpperCase() : String(rawService || '').trim().toUpperCase();
          setCanCreateUrgence(serviceName === 'URGENCES');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      } finally {
        console.log('fin')
      }
    }
    nomutilisateur()
  }, [idUser]);

  useEffect(() => {
    if (canCreateUrgence === false) {
      // Si non autorisé, rediriger vers la liste des rendez-vous
      navigate('/medecin/rendezvous');
    }
  }, [canCreateUrgence, navigate]);

  const [formData, setFormData] = useState({
    motifs: "",
    tensionArterielle: "",
    temperature: 0.1,
    poids: 0.1,
    taille: 0.1,
    compteRendu: "",
    diagnostic: "",
    // Pas de rendezVousId pour les consultations d'urgence
    prescriptions: [
      {
        typePrescription: "",
        medicaments: "",
        instructions: "",
        dureePrescription: "",
        quantite: 9007199254740991
      }
    ]
  });

  // États pour le popup de confirmation
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [consultationData, setConsultationData] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoGeneratePDF, setAutoGeneratePDF] = useState(true);

  const handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;

    // Champs numériques à convertir
    const champsNumeriques = ["temperature", "poids", "taille", "quantite"];

    // Pour les champs numériques, permettre la saisie libre mais nettoyer les caractères non valides
    if (champsNumeriques.includes(name)) {
      // Permettre la saisie de chiffres, virgules, points et espaces
      const cleanValue = value.replace(/[^0-9.,\s]/g, '');

      // Si le champ est vide, stocker 0.1 (valeur par défaut)
      if (!cleanValue.trim()) {
        setFormData(prev => ({
          ...prev,
          [name]: 0.1
        }));
        return;
      }

      // Stocker la valeur nettoyée telle quelle (sera validée lors de la soumission)
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
      return;
    }

    // Si le champ est dans prescriptions[0]
    if (name.startsWith("prescriptions[0].")) {
      const field = name.split(".")[1];
      if (champsNumeriques.includes(field)) {
        // Même logique pour les champs de prescription
        const cleanValue = value.replace(/[^0-9.,\s]/g, '');
        if (!cleanValue.trim()) {
          setFormData(prev => ({
            ...prev,
            prescriptions: [
              {
                ...prev.prescriptions[0],
                [field]: 0.1
              }
            ]
          }));
          return;
        }
        setFormData(prev => ({
          ...prev,
          prescriptions: [
            {
              ...prev.prescriptions[0],
              [field]: cleanValue
            }
          ]
        }));
        return;
      }

      // Champ non numérique
      setFormData(prev => ({
        ...prev,
        prescriptions: [
          {
            ...prev.prescriptions[0],
            [field]: value
          }
        ]
      }));
      return;
    }

    // Pour tous les autres champs
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonction pour récupérer les données de la consultation créée
  const fetchConsultationData = async (consultationId) => {
    try {
      const response = await axiosInstance.get(`/consultations/${consultationId}`);

      if (response.status === 200) {
        setConsultationData(response.data);
        // Récupérer aussi les données de prescription
        await fetchPrescriptionData(consultationId);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de consultation:', error);
    }
  };

  // Fonction pour récupérer les données de prescription
  const fetchPrescriptionData = async (consultationId) => {
    try {
      const response = await axiosInstance.get(`/prescriptions/consultation/${consultationId}`);

      if (response.status === 200 && response.data.length > 0) {
        setPrescriptionData(response.data[0]); // Prendre la première prescription
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de prescription:', error);
    }
  };

  // Fonction pour générer le PDF de la prescription
  const generatePrescriptionPDF = async () => {
    if (!prescriptionData) return;
    
    setIsLoading(true);
    try {
      const pdfData = {
        ...prescriptionData,
        consultationDescription: consultationData?.compteRendu || consultationData?.diagnostic || '',
        medecinNomComplet: `Dr. ${nomprofil}` || 'Dr. Médecin',
        patientNomComplet: consultationData?.patientNomComplet || 'saisir :',
        dateConsultation: consultationData?.dateCreation || new Date().toLocaleDateString('fr-FR'),
        serviceMedical: localStorage.getItem('serviceMedical') || 'Urgence'
      };
      
      // Générer le PDF côté client
      const pdfBlob = await pdf(<PrescriptionPDF prescription={pdfData} />).toBlob();
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription_urgence_${prescriptionData.id || 'consultation'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      if (window.showNotification) {
        window.showNotification('PDF de prescription d\'urgence généré avec succès !', 'success');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      if (window.showNotification) {
        window.showNotification('Erreur lors de la génération du PDF', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour fermer le popup et retourner à la liste
  const handleCloseSuccessPopup = async () => {
    setShowSuccessPopup(false);
    
    // Générer automatiquement le PDF si l'option est activée et si une prescription existe
    if (autoGeneratePDF && prescriptionData) {
      try {
        await generatePrescriptionPDF();
      } catch (error) {
        console.log('Génération automatique du PDF terminée');
      }
    }
    
    // Rediriger vers la liste des rendez-vous
    navigate("/medecin/rendezvous");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs obligatoires
    const errors = [];

    if (!formData.motifs.trim()) {
      errors.push('Les motifs de consultation sont obligatoires');
    }

    if (!formData.diagnostic.trim()) {
      errors.push('Le diagnostic est obligatoire');
    }

    // Validation et formatage des champs numériques
    let temperature = 0.1;
    let poids = 0.1;
    let taille = 0.1;

    try {
      // Traitement de la température
      if (formData.temperature && formData.temperature !== 0.1) {
        const tempVal = parseFloat(formData.temperature.toString().replace(',', '.'));
        if (!isNaN(tempVal) && tempVal > 0) {
          if (tempVal < 30) {
            errors.push('La température doit être supérieure ou égale à 30°C');
          } else if (tempVal > 95) {
            errors.push('La température doit être inférieure ou égale à 95°C');
          } else {
            temperature = tempVal;
          }
        } else {
          errors.push('La température doit être un nombre valide');
        }
      } else {
        errors.push('La température est obligatoire');
      }

      // Traitement du poids
      if (formData.poids && formData.poids !== 0.1) {
        const poidsVal = parseFloat(formData.poids.toString().replace(',', '.'));
        if (!isNaN(poidsVal) && poidsVal > 0) {
          if (poidsVal < 1) {
            errors.push('Le poids doit être supérieur ou égal à 1 kg');
          } else if (poidsVal > 500) {
            errors.push('Le poids doit être inférieur ou égal à 500 kg');
          } else {
            poids = poidsVal;
          }
        } else {
          errors.push('Le poids doit être un nombre valide');
        }
      } else {
        errors.push('Le poids est obligatoire');
      }

      // Traitement de la taille
      if (formData.taille && formData.taille !== 0.1) {
        const tailleVal = parseFloat(formData.taille.toString().replace(',', '.'));
        if (!isNaN(tailleVal) && tailleVal > 0) {
          if (tailleVal < 50) {
            errors.push('La taille doit être supérieure ou égale à 50 cm');
          } else if (tailleVal > 300) {
            errors.push('La taille doit être inférieure ou égale à 300 cm');
          } else {
            taille = tailleVal;
          }
        } else {
          errors.push('La taille doit être un nombre valide');
        }
      } else {
        errors.push('La taille est obligatoire');
      }
    } catch (error) {
      errors.push('Erreur lors de la validation des valeurs numériques');
    }

    // Validation des prescriptions (optionnelles)
    if (formData.prescriptions[0].medicaments.trim()) {
      // Si des médicaments sont prescrits, valider les champs associés
      if (!formData.prescriptions[0].instructions.trim()) {
        errors.push('Les instructions sont obligatoires si des médicaments sont prescrits');
      }
      if (!formData.prescriptions[0].dureePrescription.trim()) {
        errors.push('La durée de prescription est obligatoire si des médicaments sont prescrits');
      }
    }

    if (errors.length > 0) {
      if (window.showNotification) {
        window.showNotification(errors.join('. '), 'error');
      }
      return;
    }

    // Confirmation avant création
    showConfirmation({
      title: 'Créer la consultation d\'urgence',
      message: 'Êtes-vous sûr de vouloir créer cette consultation d\'urgence ? Cette action ne peut pas être annulée.',
      confirmText: 'Créer',
      cancelText: 'Annuler',
      variant: 'warning',
      onConfirm: async () => {
        try {
          // Créer un objet avec les données validées
          const validatedData = {
            ...formData,
            temperature: temperature,
            poids: poids,
            taille: taille
          };

          // Utiliser l'endpoint d'urgence
          const response = await axiosInstance.post(`/consultations/emergency`, validatedData);

          if (response.status === 200 || response.status === 201) {
            if (window.showNotification) {
              window.showNotification('Consultation d\'urgence créée avec succès !', 'success');
            }

            // Récupérer l'ID de la consultation créée depuis la réponse
            const consultationId = response.data.id || response.data.consultationId;

            if (consultationId) {
              // Récupérer les données complètes de la consultation
              await fetchConsultationData(consultationId);
              // Afficher le popup de confirmation
              setShowSuccessPopup(true);
            } else {
              // Redirection vers la liste des rendez-vous si pas d'ID
              navigate("/medecin/rendezvous");
            }
          }
        } catch (error) {
          console.error('Erreur lors de la création de la consultation d\'urgence:', error);
          if (window.showNotification) {
            window.showNotification(
              error.response?.data?.message || 'Erreur lors de la création de la consultation d\'urgence',
              'error'
            );
          }
        }
      }
    });
  };

  const handleClick = () => {
    // Vérifier s'il y a des données saisies
    const hasData = formData.motifs.trim() ||
      formData.diagnostic.trim() ||
      formData.temperature > 0.1 ||
      formData.poids > 0.1 ||
      formData.taille > 0.1 ||
      formData.prescriptions[0].medicaments.trim() ||
      formData.prescriptions[0].instructions.trim();

    if (hasData) {
      // Confirmation d'abandon si des données ont été saisies
      showConfirmation({
        title: 'Annuler la création',
        message: 'Vous avez saisi des données. Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.',
        confirmText: 'Oui, annuler',
        cancelText: 'Non, continuer',
        variant: 'warning',
        onConfirm: () => {
          if (window.showNotification) {
            window.showNotification('Création de consultation d\'urgence annulée', 'info');
          }
          // Redirige vers la liste des rendez-vous
          navigate("/medecin/rendezvous");
        }
      });
    } else {
      // Pas de données, redirection directe
      if (window.showNotification) {
        window.showNotification('Retour à la liste des rendez-vous', 'info');
      }
      navigate("/medecin/rendezvous");
    }
  };

  return (
    <>
      <SousDiv1Style>
        <Barrehorizontal1 titrepage="Consultation d'urgence" imgprofil1={imgprofil} nomprofil={nomprofil}>
          <Span1 onClick={handleClick}>Liste des rendez vous</Span1>
          <Span2 > {">"} Consultation d'urgence </Span2>
        </Barrehorizontal1>
      </SousDiv1Style>
      
      <Afficheformulaireadd>
        <Form onSubmit={handleSubmit}>
          <FormContainer>
            <UrgencyTitle>🚨 Consultation d'Urgence</UrgencyTitle>
            <UrgencyBadge>⚠️ Cette consultation n'est pas liée à un rendez-vous</UrgencyBadge>
            <TraitHorizontal></TraitHorizontal>

            <div style={{
              backgroundColor: '#fef2f2',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fecaca'
            }}>
              <p style={{
                margin: 0,
                color: '#991b1b',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }}>
                <strong>⚠️ Consultation d'urgence :</strong> Cette consultation est créée pour des cas d'urgence 
                non programmés. Assurez-vous de remplir tous les champs obligatoires.
                <br />
                <strong>Note :</strong> Les champs marqués d'un * sont obligatoires.
                <br />
                <strong>Unités :</strong> Taille en cm, Poids en kg, Température en °C.
              </p>
            </div>

            <FormRow>
              <FormGroup>
                <Label htmlFor="taille">Taille * (en cm)</Label>
                <Input
                  id="taille"
                  name="taille"
                  type='text'
                  value={formData.taille <= 0.1 ? '' : formData.taille}
                  onChange={handleChange}
                  placeholder="Ex: 175 (pour 1m75)"
                  style={{
                    borderColor: formData.taille <= 0.1 ? '#ef4444' : '#d1d5db'
                  }}
                />
                {formData.taille <= 0.1 && (
                  <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    La taille doit être supérieure à 0
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="poids">Poids * (en kg)</Label>
                <Input
                  id="poids"
                  name="poids"
                  type='text'
                  value={formData.poids <= 0.1 ? '' : formData.poids}
                  onChange={handleChange}
                  placeholder="Ex: 70.5"
                  style={{
                    borderColor: formData.poids <= 0.1 ? '#ef4444' : '#d1d5db'
                  }}
                />
                {formData.poids <= 0.1 && (
                  <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    Le poids doit être supérieur à 0
                  </small>
                )}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="temperature">Temperature * (en °C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type='text'
                  value={formData.temperature <= 0.1 ? '' : formData.temperature}
                  onChange={handleChange}
                  placeholder="Ex: 37.2"
                  style={{
                    borderColor: formData.temperature <= 0.1 ? '#ef4444' : '#d1d5db'
                  }}
                />
                {formData.temperature <= 0.1 && (
                  <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    La température doit être supérieure à 0
                  </small>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="tensionArterielle">Tension Arterielle</Label>
                <TextArea
                  id='tensionArterielle'
                  name="tensionArterielle"
                  value={formData.tensionArterielle}
                  onChange={handleChange}
                  placeholder="Ex: 120/80 mmHg"
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="motifs">Motifs *</Label>
                <TextArea
                  id='motifs'
                  name="motifs"
                  value={formData.motifs}
                  onChange={handleChange}
                  placeholder="Ex: Fièvre, maux de tête, fatigue..."
                  style={{
                    borderColor: !formData.motifs.trim() ? '#ef4444' : '#d1d5db'
                  }}
                />
                {!formData.motifs.trim() && (
                  <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    Ce champ est obligatoire
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="diagnostic">Diagnostic *</Label>
                <TextArea
                  id='diagnostic'
                  name="diagnostic"
                  value={formData.diagnostic}
                  onChange={handleChange}
                  placeholder="Ex: Grippe saisonnière, infection respiratoire..."
                  style={{
                    borderColor: !formData.diagnostic.trim() ? '#ef4444' : '#d1d5db'
                  }}
                />
                {!formData.diagnostic.trim() && (
                  <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    Ce champ est obligatoire
                  </small>
                )}
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="compteRendu">Compte rendu</Label>
              <TextArea
                id='compteRendu'
                name="compteRendu"
                value={formData.compteRendu}
                onChange={handleChange}
                placeholder="Ex: Patient présente des symptômes grippaux classiques..."
                style={{
                  width: '100%'
                }}
              />
            </FormGroup>

            <Title>Prescription</Title>
            <TraitHorizontal2></TraitHorizontal2>
            <FormRow>
              <FormGroup>
                <Label htmlFor="typePrescription">Type prescription</Label>
                <TextArea
                  id='typePrescription'
                  name="prescriptions[0].typePrescription"
                  value={formData.prescriptions[0].typePrescription}
                  onChange={handleChange}
                  placeholder="Ex: Antibiotique, antalgique, anti-inflammatoire..."
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="medicaments">Medicaments</Label>
                <TextArea
                  id='medicaments'
                  name="prescriptions[0].medicaments"
                  value={formData.prescriptions[0].medicaments}
                  onChange={handleChange}
                  placeholder="Ex: Amoxicilline 1g, 2x/jour"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="quantite">Quantite</Label>
                <Input
                  id="quantite"
                  name="prescriptions[0].quantite"
                  type='text'
                  value={formData.prescriptions[0].quantite === 9007199254740991 ? '' : formData.prescriptions[0].quantite}
                  onChange={handleChange}
                  placeholder="Ex: 20 comprimés"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="dureePrescription">Duree prescription</Label>
                <TextArea
                  id='dureePrescription'
                  name="prescriptions[0].dureePrescription"
                  value={formData.prescriptions[0].dureePrescription}
                  onChange={handleChange}
                  placeholder="Ex: 7 jours, 2 semaines..."
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="instructions">Instructions</Label>
              <TextArea
                id='instructions'
                name="prescriptions[0].instructions"
                value={formData.prescriptions[0].instructions}
                onChange={handleChange}
                placeholder="Ex: Prendre avant les repas, éviter l'alcool..."
                style={{
                  width: '100%'
                }}
              />
            </FormGroup>
          </FormContainer>
          
          <ButtonRow>
            <button type="button" className='cancel-button' onClick={handleClick}>
              Annuler
            </button>
            <button type="submit" className='submit-button' primary>
              🚨 Créer la consultation d'urgence
            </button>
          </ButtonRow>
        </Form>
      </Afficheformulaireadd>

      {/* Styles CSS pour les animations du modal */}
      <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
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
          `}</style>

      {/* Modal de succès pour afficher les informations de la consultation */}
      <ConsultationSuccessModal
        isOpen={showSuccessPopup}
        onClose={handleCloseSuccessPopup}
        consultationData={consultationData}
        prescriptionData={prescriptionData}
        onGeneratePDF={generatePrescriptionPDF}
        isLoading={isLoading}
        autoGeneratePDF={autoGeneratePDF}
        setAutoGeneratePDF={setAutoGeneratePDF}
      />
    </>
  );
};

export default FormulaireConsultationUrgence;
