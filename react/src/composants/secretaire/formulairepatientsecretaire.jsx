import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axiosInstance from '../config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import '../../styles/add-buttons.css'
import '../../styles/formulairepatientsecretaire.css'



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
const Span2= Styled.span`
    
`
const Span1= Styled.span`
    cursor: pointer;
`
const Afficheformulaireadd = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
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
  color: rgba(51, 51, 51, 1);
`;

const Input = Styled.input`
  padding: 10px;
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 8px;
  width: 351px;
  color: rgba(30, 30, 30, 1);
  &:focus{
    border: 1px solid rgba(217, 217, 217, 1);
  }
`;

const Select = Styled.select`
  min-width: 351px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
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
  margin: 20px;
`;

const FormulairePatientSecretaire = () => {

  const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
           const nomutilisateur =  async ()=> {
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
  
  // Fonction de validation
  const validateForm = () => {
    const newErrors = {};

    // Validation des champs obligatoires
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est obligatoire";
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est obligatoire";
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.dateNaissance) {
      newErrors.dateNaissance = "La date de naissance est obligatoire";
    } else {
      const birthDate = new Date(formData.dateNaissance);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 120) {
        newErrors.dateNaissance = "La date de naissance n'est pas valide";
      }
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est obligatoire";
    } else if (!/^\d{9}$/.test(formData.telephone.replace(/\D/g, ''))) {
      newErrors.telephone = "Le numéro doit contenir exactement 9 chiffres";
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est obligatoire";
    }

    if (!formData.genre) {
      newErrors.genre = "Le genre est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    if (name.startsWith("dossierMedical.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        dossierMedical: {
          ...prev.dossierMedical,
          [field]: value
        }
      }));
    } else if (name === 'telephone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
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
    
    // Validation du formulaire
    if (!validateForm()) {
      if (window.showNotification) {
        window.showNotification("Veuillez corriger les erreurs dans le formulaire", "error");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(`/patients`, formData);

      console.log(response.data);
      
      // Notification de succès
      if (window.showNotification) {
        window.showNotification("Patient ajouté avec succès !", "success");
      }

      // Réinitialiser le formulaire
      setFormData({
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

      // Rediriger vers la liste des patients après un délai
      setTimeout(() => {
        navigate("/secretaire/patient");
      }, 2000);

    } catch (error) {
      console.error('Erreur de connexion :', error);
      
      // Notification d'erreur
      let errorMessage = "Erreur lors de l'ajout du patient";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Données invalides. Veuillez vérifier les informations saisies.";
        } else if (error.response.status === 401) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
        } else if (error.response.status === 409) {
          errorMessage = "Un patient avec cet email existe déjà.";
        } else if (error.response.status >= 500) {
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
        }
      } else if (error.request) {
        errorMessage = "Erreur de connexion au serveur. Vérifiez votre connexion internet.";
      }
      
      if (window.showNotification) {
        window.showNotification(errorMessage, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  
  
  

 /* const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };*/
  
  const handleAnnuler = () => {
    // Afficher une notification de succès
    if (window.showNotification) {
      window.showNotification("Annulation de la création du patient", "info");
    }
    // Rediriger vers la liste des patients
    navigate("/secretaire/patient");
  };

 

  
  
  let navigate = useNavigate();

  const handleClick = () => {
    // Redirige vers /utilisateur
    navigate("/secretaire/patient");
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
                    <Label htmlFor="nom">Nom <span className="required-field">*</span></Label>
                    <Input 
                      id="nom" 
                      name="nom" 
                      value={formData.nom} 
                      onChange={handleChange}
                      className={errors.nom ? 'error' : ''}
                    />
                    {errors.nom && <span className="error-message">{errors.nom}</span>}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="prenom">Prénom <span className="required-field">*</span></Label>
                    <Input 
                      id="prenom" 
                      name="prenom" 
                      value={formData.prenom} 
                      onChange={handleChange}
                      className={errors.prenom ? 'error' : ''}
                    />
                    {errors.prenom && <span className="error-message">{errors.prenom}</span>}
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="adresse">Adresse <span className="required-field">*</span></Label>
                    <Input 
                      id="adresse" 
                      name="adresse" 
                      value={formData.adresse} 
                      onChange={handleChange}
                      className={errors.adresse ? 'error' : ''}
                    />
                    {errors.adresse && <span className="error-message">{errors.adresse}</span>}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">Email <span className="required-field">*</span></Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="genre">Genre <span className="required-field">*</span></Label>
                    <Select 
                      id="genre" 
                      name="genre" 
                      value={formData.genre} 
                      onChange={handleChange}
                      className={errors.genre ? 'error' : ''}
                    >
                      <option value="Femme">Femme</option>
                      <option value="Homme">Homme</option>
                    </Select>
                    {errors.genre && <span className="error-message">{errors.genre}</span>}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="dateNaissance">Date de naissance <span className="required-field">*</span></Label>
                    <Input 
                      id="dateNaissance" 
                      name="dateNaissance" 
                      type="date" 
                      value={formData.dateNaissance} 
                      onChange={handleChange}
                      className={errors.dateNaissance ? 'error' : ''}
                    />
                    {errors.dateNaissance && <span className="error-message">{errors.dateNaissance}</span>}
                  </FormGroup>
                </FormRow>
                <FormRow>
                  
                  <FormGroup>
                    <Label htmlFor="telephone">Téléphone <span className="required-field">*</span></Label>
                    <Input 
                      id="telephone" 
                      name="telephone" 
                      value={formData.telephone} 
                      onChange={handleChange}
                      placeholder="XXXXXXXXX"
                      title="9 chiffres"
                      maxLength={9}
                      className={errors.telephone ? 'error' : ''}
                    />
                    {errors.telephone && <span className="error-message">{errors.telephone}</span>}
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
                      <Label htmlFor="alergies">Allergies</Label>
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
                  <Label htmlFor='observation'>Observations</Label>
                  <TextArea id='observation' name="dossierMedical.observations" value={formData.dossierMedical.observations} onChange={handleChange} />
                </FormGroup>
              </FormRow>
                
            </FormContainer>
                <ButtonRow>
                  <button type="button" className="cancel-button" onClick={handleAnnuler}>
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Ajout en cours...' : 'Ajouter un patient'}
                  </button>
                </ButtonRow>
            </Form>
            </Afficheformulaireadd>
    </>
  );
};

export default FormulairePatientSecretaire;
