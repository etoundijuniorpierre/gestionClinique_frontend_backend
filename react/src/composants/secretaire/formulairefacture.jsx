// src/components/forms/FormulaireFacture.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import '../../styles/add-buttons.css'
import { handleApiError } from '../../utils/errorHandler';

// IMPORTS pour la génération PDF
import { pdf } from '@react-pdf/renderer';
import ReceiptPDF from '../../composants/generateurpdffacture'; // chemin selon ta structure
import logoPath from '../../assets/logo.png'; // met ton logo ici (optionnel, local)


const Affichedetailuser = Styled.div`
  display: flex; 
  justifyContent: center; 
  alignItems: center; 
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 20px;`;

const FormContainer = Styled.div`
  position: relative;
  overflow: hidden;
  padding: 10px 30px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  backdrop-filter: blur(10px);
  &::before {
    message: '';
    position: absolute;
    inset: 0;
    background-image: url(${fondImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.05;
    z-index: 0;
  }
  > * { position: relative; z-index: 1; }
`;
const Title = Styled.div`
  display: flex; 
  justifyContent: space-between;
`;
const Title1 = Styled.h2`margin-bottom: 0px; font-size: 28px; font-weight: 600; color: #1e40af; padding-bottom: 15px; font-family: 'Inter', sans-serif;`;
const Title2 = Styled.h2`margin-bottom: 0px; font-size: 24px; font-weight: 500; color: #1e40af; padding-bottom: 10px; font-family: 'Inter', sans-serif; cursor: pointer;`;
const TraitHorizontal = Styled.div`width: 100%; height: 4px; border-radius: 2px; background: linear-gradient(90deg, #1e40af, #3b82f6); margin-bottom: 25px; box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);`;
const FormRow = Styled.div`display: flex; gap: 10px; margin-bottom: 15px;`;
const FormGroup = Styled.div`flex: 1; display: flex; flex-direction: column;`;
const FormGroupvisible = Styled.div`flex: 1; display: ${props => props.$formgroupdisplay || "none"}; flex-direction: column;`;
const Form = Styled.form`margin: 0; padding-left:0; width: 766px;`;
const Label = Styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  color: #374151;
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
  padding: 12px 16px; 
  border: 2px solid #e5e7eb; 
  border-radius: 10px; 
  width: 100%; 
  color: #1f2937; 
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  background: #ffffff;
  
  &:focus{ 
    border: 2px solid #1e40af; 
    outline: none;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;
const Select = Styled.select`
  min-width: 100%; 
  padding: 12px 16px; 
  border: 2px solid #e5e7eb; 
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  background: #ffffff;
  color: #1f2937;
  transition: all 0.3s ease;
  
  &:focus {
    border: 2px solid #1e40af;
    outline: none;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;
const ButtonRow = Styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  padding-bottom: 15px;
`;

const Overlay = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Popup = Styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  text-align: center;
  min-width: 300px;
`;

const Loader = Styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  text-align: center;
  min-width: 300px;
`;

const ButtonGroup = Styled.div`
  display: flex;
  gap: 15px;
  justifyContent: center;
  margin-top: 20px;
`;

const PopupButton = Styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.confirm {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.cancel {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

// Button styling is now handled by add-buttons.css

// === fin styled-components ===

const FormulaireFacture = ({ id, onClick1 }) => {
  const navigate = useNavigate();
  const [facture, setfacture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    console.log('FormulaireFacture monté avec ID:', id);
    
    const fetchfactures = async () => {
      const token = localStorage.getItem('token');
      try {
        console.log('Tentative de récupération de la facture avec ID:', id);
        const response = await axiosInstance.get(`/factures/recherche/${id}`);
        setfacture(response.data);
        console.log('Facture récupérée avec succès:', response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
      }
    };
    if (id) fetchfactures();
  }, [id]);



   const handleChange = e => {
    const { name, value } = e.target;
    setfacture(prev => ({ ...prev, [name]: value }));
  };

  const handleAnnuler = () => {
    console.log('Bouton Annuler cliqué - Début de la fonction handleAnnuler');
    
    try {
      // Réinitialiser les états
      setLoading(false);
      setShowValidationPopup(false);
      setShowLoader(false);
      
      console.log('États réinitialisés avec succès');
      
      // Afficher une notification de succès
      if (window.showNotification) {
        window.showNotification("Annulation effectuée", "success");
        console.log('Notification affichée');
      } else {
        console.log('Fonction showNotification non disponible');
      }
      
      // Rediriger vers la liste des factures
      console.log('Tentative de navigation vers /secretaire/facture');
      navigate("/secretaire/facture");
      console.log('Navigation effectuée avec succès');
      
      // Gérer le focus après la navigation
      setTimeout(() => {
        const firstFocusableElement = document.querySelector('button, input, select, a, [tabindex]:not([tabindex="-1"])');
        if (firstFocusableElement) {
          firstFocusableElement.focus();
          console.log('Focus géré avec succès');
        } else {
          console.log('Aucun élément focusable trouvé');
        }
      }, 100);
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      // En cas d'erreur, essayer quand même de naviguer
      console.log('Tentative de navigation de secours');
      navigate("/secretaire/facture");
    }
  };

  const handleGenererFacture = () => {
    setShowValidationPopup(true);
  };

  const handleValidationConfirm = async () => {
    setShowValidationPopup(false);
    setShowLoader(true);
    
    try {
      // Appeler la fonction de génération PDF existante
      await handleSubmit(new Event('submit'));
      
      // Afficher une notification de succès
      if (window.showNotification) {
        window.showNotification("Facture générée avec succès", "success");
      }
      // Rediriger vers la liste des rendez-vous
      navigate("/secretaire/rendezvous");
      // Gérer le focus après la navigation
      setTimeout(() => {
        const firstFocusableElement = document.querySelector('button, input, select, a, [tabindex]:not([tabindex="-1"])');
        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      }, 100);
    } catch (error) {
      handleApiError(error, "Erreur lors de la génération de la facture");
    } finally {
      setShowLoader(false);
    }
  };

  const handleValidationCancel = () => {
    setShowValidationPopup(false);
    // Rediriger vers la liste des factures
    navigate("/secretaire/facture");
    // Gérer le focus après la navigation
    setTimeout(() => {
      const firstFocusableElement = document.querySelector('button, input, select, a, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }, 100);
  };

  // helper: convert an image URL to data url (to avoid CORS issues with react-pdf)
  const imageUrlToDataUrl = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Impossible de convertir l'image en dataURL:", err);
      return null;
    }
  };

  // === SUBMIT: PATCH payer + generer PDF ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      // 1) patch paiement (si tu veux d'abord marquer payé)
      await axiosInstance.patch(`/factures/payer/${id}/${facture.modePaiement}`, {});

      // 2) préparer les données pour le PDF
      const amountFormatted = typeof facture.montant === 'number'
        ? `XAF${facture.montant.toFixed(2)}`
        : `XAF${parseFloat(facture.montant).toFixed(2)}`;

      const dateStr = facture.dateEmission?.split?.("T")?.[0] || "";

      // 3) récupérer logo en dataURL pour éviter CORS (optionnel)
      let logoDataUrl = null;
      try {
        // si logoPath est local dans /src/assets/logo.png, ce fetch fonctionne dans dev build
        logoDataUrl = await imageUrlToDataUrl(logoPath);
      } catch (err) {
        console.warn("logo non converti, génération sans logo :", err);
      }

      // 4) créer le Document react-pdf
      const doc = (
        <ReceiptPDF
          patientName={facture.patientNomComplet}
          amount={amountFormatted}
          date={dateStr}
          paymentMethod={facture.modePaiement}
          serviceMedicalName={facture.serviceMedicalNom}
          factureId={facture.id || facture.factureNumero || id}
          logo={logoDataUrl} // peut être null
        />
      );

      // 5) générer blob PDF et forcer le téléchargement
      const asBlob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(asBlob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (facture.patientNomComplet || 'facture').replace(/\s+/g, "_");
      a.download = `facture_${safeName}_${dateStr || ''}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // 6) Ne pas fermer le popup automatiquement, laisser handleValidationConfirm gérer le flow
      // onClick1();

    } catch (error) {
      console.error('Erreur lors de la soumission / génération PDF :', error);
      throw error; // Propager l'erreur pour la gestion dans handleValidationConfirm
    } finally {
      setLoading(false);
    }
  };

  if (!facture) {
    console.log('Facture non chargée, affichage du loader');
    return (
      <Affichedetailuser>
        <FormContainer>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            fontSize: '18px',
            color: '#1e40af'
          }}>
            Chargement de la facture...
          </div>
        </FormContainer>
      </Affichedetailuser>
    );
  }

  return (
    <Affichedetailuser>
      <Form onSubmit={handleSubmit}>
        <FormContainer>
          <Title>
            <Title1>🏥 Détail de la Facture</Title1>
          </Title>

          <TraitHorizontal />
          <FormRow>
            <FormGroup>
              <Label htmlFor="nom">👤 Nom du Patient</Label>
              <Input id="nom" value={facture.patientNomComplet} readOnly />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="date">📅 Date de création</Label>
              <Input id="date" value={facture.dateEmission.split("T")[0]} readOnly />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="heure">Heure de création</Label>
              <Input id="heure" value={facture.dateEmission.split("T")[1].split(".")[0]} readOnly />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="servicemedicalnom">Service medical</Label>
              <Input id="servicemedicalnom" name="serviceMedicalNom" value={facture.serviceMedicalNom} readOnly />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="montant">💰 Montant (XAF)</Label>
              <Input id="montant" name="montant" value={facture.montant} readOnly />
            </FormGroup>
            <FormGroup>
              <Label required htmlFor="modepaiement">💳 Mode de Paiement</Label>
              <Select id="modepaiement" name="modePaiement" value={facture.modePaiement} onChange={handleChange}>
                <option value="ESPECES">💵 Espèces</option>
                <option value="CARTE_BANCAIRE">💳 Carte Bancaire</option>
                <option value="VIREMENT">🏦 Virement</option>
                <option value="CHEQUE">📄 Chèque</option>
                <option value="MOBILE_MONEY">📱 Mobile Money</option>
              </Select>
            </FormGroup>
          </FormRow>
        </FormContainer>

        <ButtonRow>
          <button type="button" className="cancel-button" onClick={handleAnnuler}>
            Annuler
          </button>
          <button type="button" className="submit-button" onClick={handleGenererFacture} disabled={loading}>
            {loading ? "Génération..." : "Payer et générer la facture"}
          </button>
        </ButtonRow>
      </Form>
      
      {/* Popup de validation */}
      {showValidationPopup && (
        <Overlay>
          <Popup>
            <h3 style={{ color: '#1e40af', marginBottom: '15px' }}>Confirmation</h3>
            <p style={{ marginBottom: '20px' }}>Voulez-vous payer et générer cette facture ?</p>
            <ButtonGroup>
              <PopupButton className="confirm" onClick={handleValidationConfirm}>
                Oui
              </PopupButton>
              <PopupButton className="cancel" onClick={handleValidationCancel}>
                Non
              </PopupButton>
            </ButtonGroup>
          </Popup>
        </Overlay>
      )}

      {/* Loader de génération */}
      {showLoader && (
        <>
          <Overlay />
          <Loader>
            <h3 style={{ color: '#1e40af', marginBottom: '15px' }}>Génération en cours</h3>
            <p style={{ marginBottom: '20px' }}>Génération de la facture...</p>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #e5e7eb', 
              borderTop: '4px solid #1e40af', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </Loader>
        </>
      )}
    </Affichedetailuser>
  );
};

export default FormulaireFacture;
