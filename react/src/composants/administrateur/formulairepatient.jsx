import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axiosInstance from '../../composants/config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import '../../styles/add-buttons.css'
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';



const FormContainer = Styled.div`
  position: relative;
  overflow: hidden;
  background-color: rgba(239, 239, 255, 1);;
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
const Span2= Styled.span`
    
`
const Span1= Styled.span`
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
`;

const Select = Styled.select`
  min-width: 351px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
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
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
`;

const ButtonRow = Styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

const FormulairePatient = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { showConfirmation } = useConfirmation();
  const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')

    useEffect(() => {
           const nomutilisateur =  async ()=> {
                try {
                const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
                console.log('Token utilisé:', localStorage.getItem('token'));
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

  
  const [formData, setFormData] = useState({
  nom: "",
  prenom: "",
  email: "",
  dateNaissance: "",
  telephone: "",
  adresse: "",
  genre: "",
  dossierMedical: {
    groupeSanguin: "",
    antecedentsMedicaux: "",
    allergies: "",
    traitementsEnCours: "",
    observations: "",
    }

  });
  
  

const handleChange = e => {
  const { name, value } = e.target;

  if (name.startsWith("dossierMedical.")) {
    const field = name.split(".")[1];
    setFormData(prev => ({
      ...prev,
      dossierMedical: {
        ...prev.dossierMedical,
        [field]: value
      }
    }));
  } else if (name === "telephone") {
    // Garder uniquement les chiffres et limiter à 9
    const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
    setFormData(prev => ({ ...prev, [name]: digitsOnly }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};
  
  const token = localStorage.getItem('token');

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validation spécifique des champs requis
    if (!formData.nom.trim()) {
      window.showNotification('Le champ "Nom" est obligatoire', 'error');
      return;
    }
    if (!formData.prenom.trim()) {
      window.showNotification('Le champ "Prénom" est obligatoire', 'error');
      return;
    }
    if (!formData.email.trim()) {
      window.showNotification('Le champ "Email" est obligatoire', 'error');
      return;
    }
    if (!formData.telephone.trim()) {
      window.showNotification('Le champ "Téléphone" est obligatoire', 'error');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      window.showNotification('Veuillez entrer une adresse email valide', 'error');
      return;
    }

    // Validation du téléphone (exactement 9 chiffres)
    const phoneNumber = formData.telephone.replace(/[^\d]/g, '');
    if (phoneNumber.length !== 9) {
      window.showNotification('Le numéro de téléphone doit contenir exactement 9 chiffres', 'error');
      return;
    }

    startLoading('createPatient');
    try {
          const response = await axiosInstance.post(`/patients`, formData)
    console.log(response.data);
    window.showNotification('Patient créé avec succès', 'success');
    navigate("/admin/patient");
    } catch (error) {
      console.error('Erreur de connexion :', error);
      
      // Messages d'erreur plus spécifiques
      if (error.response) {
        if (error.response.status === 409) {
          window.showNotification('Un patient avec cet email existe déjà', 'error');
        } else if (error.response.status === 400) {
          window.showNotification('Données invalides. Vérifiez les informations saisies', 'error');
        } else if (error.response.status === 401) {
          window.showNotification('Session expirée. Veuillez vous reconnecter', 'error');
        } else {
          window.showNotification(`Erreur serveur: ${error.response.data?.message || 'Erreur lors de la création'}`, 'error');
        }
      } else if (error.request) {
        window.showNotification('Erreur de connexion au serveur. Vérifiez votre connexion internet', 'error');
      } else {
        window.showNotification('Erreur lors de la création du patient', 'error');
      }
    } finally{
      stopLoading('createPatient');
    };
  };

  
  
  

 /* const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };*/
  

 

  
  


  const handleClick = () => {
    showConfirmation({
      title: "Retour à la liste",
      message: "Voulez-vous vraiment quitter sans sauvegarder ?",
      onConfirm: () => navigate("/admin/patient"),
      confirmText: "Quitter",
      cancelText: "Rester",
      variant: "danger"
    });
  };
  return (
    
      <>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1 onClick={handleClick}>Liste des patients</Span1>
                    <Span2 > {">"} Ajouter un patient</Span2>
                </Barrehorizontal1>
            </SousDiv1Style>
            <Afficheformulaireadd>
              <Form onSubmit={handleSubmit}>
                <FormContainer>
                <Title>Créer un patient</Title>
                <TraitHorizontal></TraitHorizontal>
                <Title>Informations générales</Title>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input id="adresse" name="adresse" value={formData.adresse} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="genre">Genre</Label>
                    <Select id="genre" name="genre" value={formData.genre} onChange={handleChange}>
                      <option value="Femme">Femme</option>
                      <option value="Homme">Homme</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="dateNaissance">Date de naissance</Label>
                    <Input id="dateNaissance" name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  
                  <FormGroup>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input 
                      id="telephone" 
                      name="telephone" 
                      type="tel"
                      value={formData.telephone} 
                      onChange={handleChange}
                      placeholder="XXXXXXXXX"
                      title="9 chiffres"
                      maxLength={9}
                    />
                  </FormGroup>
                </FormRow>
                <TraitHorizontal2></TraitHorizontal2>
                <Title>Dossier médical</Title>
                <FormRow>
                    <FormGroup>
                      <Label htmlFor="groupeSanguin">Groupe sanguin et Rhésus</Label>
                      <Select id='groupeSanguin' name="dossierMedical.groupeSanguin" value={formData.dossierMedical.groupeSanguin} onChange={handleChange}>
                        <option value="">-- Choisir --</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="alergies">Alergies</Label>
                      <Input id='alergies'  name="dossierMedical.allergies" value={formData.dossierMedical.allergies} onChange={handleChange} />
                    </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="traitements">Traitements en cours</Label>
                  <TextArea id='traitements' name="dossierMedical.traitementsEnCours" value={formData.dossierMedical.traitementsEnCours} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor='antecedents'>Antécédents médicaux</Label>
                  <TextArea id='antecedents' name="dossierMedical.antecedentsMedicaux" value={formData.dossierMedical.antecedentsMedicaux} onChange={handleChange} />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label htmlFor='observation'>observation</Label>
                  <TextArea id='observation' name="dossierMedical.observations" value={formData.dossierMedical.observations} onChange={handleChange} />
                </FormGroup>
              </FormRow>
                
            </FormContainer>
                <ButtonRow>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => {
                      showConfirmation({
                        title: "Annuler",
                        message: "Voulez-vous vraiment annuler la création et retourner à la liste des patients ?",
                        onConfirm: () => navigate("/admin/patient"),
                        confirmText: "Annuler",
                        cancelText: "Continuer"
                      });
                    }}
                    disabled={isLoading('createPatient')}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading('createPatient')}
                  >
                    {isLoading('createPatient') ? 'Création...' : 'Ajouter'}
                  </button>
                </ButtonRow>
            </Form>
            </Afficheformulaireadd>
    </>
  );
};

export default FormulairePatient;
