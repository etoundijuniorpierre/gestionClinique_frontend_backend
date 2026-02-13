import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig';
import axiosInstance from '../config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useParams, useNavigate } from 'react-router-dom';
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
    message: '';
    position: absolute;
    inset: 0;
    background-image: url(${fondImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.1; /* ⬅️ Réduit l’opacité de l’image seulement */
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;
const SousDiv1Style = Styled.div`
 width: 99%;
 
`
const Span2 = Styled.span`
    
`
const Span1 = Styled.span`
    cursor: pointer;
`
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

const TraitHorizontal = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(159, 159, 255, 1);
  margin-bottom: 20px;
`
const TraitHorizontal2 = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(217, 217, 217, 1);
  margin-bottom: 20px;
`
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
`
const Label = Styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333333;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: #ff4141;
      font-weight: bold;
      margin-left: 2px;
    }
  `}
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
    border: 1px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  /* Masquer les flèches pour les champs numériques */
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
    border: 1px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
    border: 1px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

//gestion popup
const Popupsuppr = Styled.div`

    display: ${props => props.$Popupsupprdisplay};
    position: fixed;
    top: 20%;
    left: 40%;
    z-index: 10000;
   
`
const Overlay = Styled.div`
  display: ${props => props.$Overlaydisplay};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.8);
  z-index: 998;
`

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
            color: '#333333',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif'
          }}>
            ✅ Consultation créée avec succès !
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
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #0ea5e9'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#0c4a6e', fontSize: '1.3rem' }}>Informations de la consultation</h4>
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
              backgroundColor: prescriptionData ? 'rgba(65, 65, 255, 1)' : '#ccc',
              color: 'white',
              border: '1px solid rgba(65, 65, 255, 1)',
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
                e.target.style.backgroundColor = 'rgba(45, 45, 235, 1)';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (prescriptionData && !isLoading) {
                e.target.style.backgroundColor = 'rgba(65, 65, 255, 1)';
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

const FormulaireConsultation = () => {
  const { showConfirmation } = useConfirmation();

  const idUser = localStorage.getItem('id');
  const [nomprofil, setnomprofil] = useState('')
  // const [idprescription, setidprescription] = useState(null)
  //const [Popup, setPopup] = useState(false)
  const idrendezvous = useParams()
  const idrdv = parseInt(idrendezvous.idrendezvous)

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

  // Récupérer les informations du rendez-vous pour obtenir le service médical
  useEffect(() => {
    const fetchRendezVousInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(`/rendez-vous/${idrdv}`);
        
        if (response.data && response.data.serviceMedical) {
          setServiceMedical(response.data.serviceMedical.nom || response.data.serviceMedical);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du rendez-vous:', error);
      }
    };

    if (idrdv) {
      fetchRendezVousInfo();
    }
  }, [idrdv]);


  const [formData, setFormData] = useState({
    motifs: "",
    tensionArterielle: "",
    temperature: 0.1,
    poids: 0.1,
    taille: 0.1,
    compteRendu: "",
    diagnostic: "",
    rendezVousId: idrdv,
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

  // État pour stocker le service médical
  const [serviceMedical, setServiceMedical] = useState("");

  // États pour le popup de confirmation
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [consultationData, setConsultationData] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoGeneratePDF, setAutoGeneratePDF] = useState(true); // Option pour génération automatique



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


  const token = localStorage.getItem('token');

  // Fonction pour récupérer les données de la consultation créée
  const fetchConsultationData = async (consultationId) => {
    try {
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
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
      // Créer les données complètes pour le PDF en combinant consultation et prescription
      const pdfData = {
        ...prescriptionData,
        // Ajouter les informations de consultation si disponibles
        consultationDescription: consultationData?.compteRendu || consultationData?.diagnostic || '',
        // Ajouter les informations du médecin depuis le profil
        medecinNomComplet: `Dr. ${nomprofil}` || 'Dr. Médecin',
        // Ajouter les informations du patient depuis la consultation
        patientNomComplet: consultationData?.patientNomComplet || 'Patient',
        // Ajouter la date de la consultation
        dateConsultation: consultationData?.dateCreation || new Date().toLocaleDateString('fr-FR'),
        // Ajouter le service médical depuis le localStorage
        serviceMedical: localStorage.getItem('serviceMedical') || '—'
      };
      
      // Générer le PDF côté client
      const pdfBlob = await pdf(<PrescriptionPDF prescription={pdfData} />).toBlob();
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription_${prescriptionData.id || 'consultation'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Vider le service médical du localStorage après la génération
      localStorage.removeItem('serviceMedical');
      
      if (window.showNotification) {
        window.showNotification('PDF de prescription généré avec succès !', 'success');
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
    } else {
      // Si pas de génération automatique, vider quand même le localStorage
      localStorage.removeItem('serviceMedical');
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

    // Simplified validation: Only Motifs and Diagnostic are strictly mandatory
    // Temperature, Poids, Taille are now optional but validated if provided
    try {
      // Traitement de la température (si renseignée)
      if (formData.temperature && formData.temperature !== 0.1 && formData.temperature !== "0.1") {
        const tempVal = parseFloat(formData.temperature.toString().replace(',', '.'));
        if (!isNaN(tempVal)) {
          if (tempVal < 30 || tempVal > 95) {
            errors.push('La température doit être comprise entre 30°C et 95°C');
          } else {
            temperature = tempVal;
          }
        }
      }

      // Traitement du poids (si renseigné)
      if (formData.poids && formData.poids !== 0.1 && formData.poids !== "0.1") {
        const poidsVal = parseFloat(formData.poids.toString().replace(',', '.'));
        if (!isNaN(poidsVal)) {
          if (poidsVal < 1 || poidsVal > 500) {
            errors.push('Le poids doit être compris entre 1 kg et 500 kg');
          } else {
            poids = poidsVal;
          }
        }
      }

      // Traitement de la taille (si renseignée)
      if (formData.taille && formData.taille !== 0.1 && formData.taille !== "0.1") {
        const tailleVal = parseFloat(formData.taille.toString().replace(',', '.'));
        if (!isNaN(tailleVal)) {
          if (tailleVal < 50 || tailleVal > 300) {
            errors.push('La taille doit être comprise entre 50 cm et 300 cm');
          } else {
            taille = tailleVal;
          }
        }
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
      title: 'Créer la consultation',
      message: 'Êtes-vous sûr de vouloir créer cette consultation ? Cette action ne peut pas être annulée.',
      confirmText: 'Créer',
      cancelText: 'Annuler',
      variant: 'info',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');

          // Créer un objet avec les données validées
          const validatedData = {
            ...formData,
            temperature: temperature,
            poids: poids,
            taille: taille
          };

          const response = await axiosInstance.post(`/consultations/start/${idrdv}`, validatedData);

          if (response.status === 200 || response.status === 201) {
            if (window.showNotification) {
              window.showNotification('Consultation créée avec succès !', 'success');
            }

            // Stocker le service médical dans le localStorage pour la prescription
            if (serviceMedical) {
              localStorage.setItem('serviceMedical', serviceMedical);
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
          console.error('Erreur lors de la création de la consultation:', error);
          if (window.showNotification) {
            window.showNotification(
              error.response?.data?.message || 'Erreur lors de la création de la consultation',
              'error'
            );
          }
        }
      }
    });
  };


  /* const handleChange = e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };*/

  let navigate = useNavigate();

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
            window.showNotification('Création de consultation annulée', 'info');
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

      {/*<Overlay onClick={() => setPopup(false)} $Overlaydisplay = { Popup ? 'block' : 'none'}/>
            <Popupsuppr $Popupsupprdisplay = {Popup ? 'block' : 'none'}>
                {<FormulairePrescription id={idprescription}/>}                
            </Popupsuppr>*/}
      <SousDiv1Style>
        <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgprofil} nomprofil={nomprofil}>
          <Span1 onClick={handleClick}>Liste des rendez vous</Span1>
          <Span2 > {">"} Créer une consultation </Span2>
        </Barrehorizontal1>
      </SousDiv1Style>
      <Afficheformulaireadd>
        <Form onSubmit={handleSubmit}>
          <FormContainer>
            <Title>Créer une consultation</Title>
            <TraitHorizontal></TraitHorizontal>

            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{
                margin: 0,
                color: '#374151',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }}>
                <strong>Note :</strong> Les champs marqués d'un * sont obligatoires.
                Assurez-vous de remplir au minimum les motifs de consultation et le diagnostic.
                <br />
                <strong>Unités :</strong> Taille en cm, Poids en kg, Température en °C. (Ces champs sont désormais optionnels)
              </p>
            </div>


            <FormRow>

              <FormGroup>
                <Label htmlFor="taille">Taille (en cm)</Label>
                <Input
                  id="taille"
                  name="taille"
                  type='text'
                  value={formData.taille <= 0.1 ? '' : formData.taille}
                  onChange={handleChange}
                  placeholder="Ex: 175 (pour 1m75)"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="poids">Poids (en kg)</Label>
                <Input
                  id="poids"
                  name="poids"
                  type='text'
                  value={formData.poids <= 0.1 ? '' : formData.poids}
                  onChange={handleChange}
                  placeholder="Ex: 70.5"
                />
              </FormGroup>




            </FormRow>


            <FormRow>
              <FormGroup>
                <Label htmlFor="temperature">Temperature (en °C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type='text'
                  value={formData.temperature <= 0.1 ? '' : formData.temperature}
                  onChange={handleChange}
                  placeholder="Ex: 37.2"
                />
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
                <Label required htmlFor="motifs">Motifs</Label>
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
                <Label required htmlFor="diagnostic">Diagnostic</Label>
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
              Créer la consultation
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

export default FormulaireConsultation;
