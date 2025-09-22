import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../composants/config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import '../../styles/add-buttons.css'
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';


const SousDiv1Style = Styled.div`
 width: 99%;

`
const Span2= Styled.span`
    display: ${props => props.$Spandisplay2};
`
const Span1= Styled.span`
    cursor: pointer;
`
const Span3 = Styled.span`
    display: ${props => props.$Spandisplay3};
`
const Afficheformulaireadd = Styled.div`
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
    opacity: 0.1; /* ⬅️ Réduit l’opacité de l’image seulement */
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
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
const FormGroupvisible = Styled.div`
  flex: 1;
  display: ${props => props.$formgroupdisplay || "none"};
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

const ButtonRow = Styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

const FormulaireUtilisateur = () => {
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

  
  // Mapping des rôles avec leurs IDs
  const roleMapping = {
    "ADMIN": { id: 1, roleType: "ADMIN" },
    "MEDECIN": { id: 2, roleType: "MEDECIN" },
    "SECRETAIRE": { id: 3, roleType: "SECRETAIRE" }
  };

  const [formData, setFormData] = useState({
   
  nom: "",
  prenom: "",
  email: "",
  dateNaissance: "",
  telephone: "",
  adresse: "",
  genre: "m",
  password: "",
  serviceMedicalName: "",
  actif: true,
  role: ""

  });
  const [isVisible, setisVisible] = useState(false)
  const [telephoneError, setTelephoneError] = useState("")
  const [telephoneValid, setTelephoneValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
    
  

  const handleChange = e => {
    const { name, value } = e.target;
    
    // Gestion spéciale pour le téléphone
    if (name === "telephone") {
      // Garder uniquement les chiffres et limiter à 9
      const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      // Validation en temps réel
      validateTelephone(digitsOnly);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Fonction de validation en temps réel du téléphone
  const validateTelephone = (telephone) => {
    const phoneNumber = telephone.replace(/[^\d]/g, '');
    if (phoneNumber.length !== 9) {
      setTelephoneError('Le numéro doit contenir exactement 9 chiffres');
      setTelephoneValid(false);
      return;
    }
    setTelephoneError('');
    setTelephoneValid(true);
  };
 const handleChangerole = e => {
    const { name, value } = e.target;
    value === "MEDECIN" ? setisVisible(true) : setisVisible(false)
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.password) {
      window.showNotification('Le champ "Mot de passe" est obligatoire', 'error');
      return;
    }
    if (!formData.role) {
      window.showNotification('Veuillez sélectionner un rôle', 'error');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      window.showNotification('Veuillez entrer une adresse email valide', 'error');
      return;
    }

    // Validation du mot de passe
    if (formData.password.length < 6) {
      window.showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    // Validation du téléphone
    if (!telephoneValid) {
      window.showNotification('Veuillez corriger le numéro de téléphone', 'error');
      return;
    }

    // Préparation des données avec le bon format de rôle
    const selectedRole = roleMapping[formData.role];
    if (!selectedRole) {
      window.showNotification('Rôle invalide sélectionné', 'error');
      return;
    }

    const dataToSend = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      dateNaissance: formData.dateNaissance,
      telephone: formData.telephone,
      adresse: formData.adresse,
      genre: formData.genre,
      password: formData.password,
      actif: formData.actif,
      role: {
        id: selectedRole.id
      }
    };

    // Ajouter le service médical si c'est un médecin
    if (formData.role === "MEDECIN" && formData.serviceMedicalName) {
      dataToSend.serviceMedicalName = formData.serviceMedicalName;
    }

    startLoading('createUser');
    try {
      const response = await axiosInstance.post(`/utilisateurs`, dataToSend);
      console.log(response.data);
      
      window.showNotification('Utilisateur créé avec succès', 'success');
      navigate("/admin/utilisateur");

    } catch (error) {
      console.error('Erreur de connexion :', error);
      
      // Messages d'erreur plus spécifiques
      if (error.response) {
        if (error.response.status === 409) {
          window.showNotification('Un utilisateur avec cet email existe déjà', 'error');
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
        window.showNotification('Erreur lors de la création de l\'utilisateur', 'error');
      }
    } finally{
      stopLoading('createUser');
    };
  };




  const handleClick = () => {
    showConfirmation({
      title: "Retour à la liste",
      message: "Voulez-vous vraiment quitter sans sauvegarder ?",
      onConfirm: () => navigate("/admin/utilisateur"),
      confirmText: "Quitter",
      cancelText: "Rester",
      variant: "danger"
    });
  };
  return (<>
              <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des utilisateurs" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1 onClick={handleClick}>Liste des utilisateurs</Span1>
                    <Span2 > {">"} Ajouter un utilisateur</Span2>
                </Barrehorizontal1>
            </SousDiv1Style>
      <Afficheformulaireadd>
      <Form onSubmit={handleSubmit}>
        <FormContainer>
        <Title>Créer un utilisateur</Title>
        <TraitHorizontal></TraitHorizontal>
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
              <option value="FEMME">Femme</option>
              <option value="HOMME">Homme</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="dateNaissance">Date de naissance</Label>
            <Input id="dateNaissance" name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} />
          </FormGroup>
        </FormRow>
         <FormRow>
          <FormGroup>
            <Label htmlFor="password">Mot de passe</Label>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Entrez le mot de passe" />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666'
                }}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </FormGroup>
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
              className={telephoneError ? 'input-error' : telephoneValid ? 'input-valid' : ''}
            />
            {telephoneError && <span className="error-message">{telephoneError}</span>}
            {telephoneValid && <span className="success-message">✓ Numéro valide</span>}
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label htmlFor="role">Rôle</Label>
            <Select id="role" name="role" value={formData.role} onChange={handleChangerole}>
              <option value="">Sélectionnez un rôle</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MEDECIN">MEDECIN</option>
              <option value="SECRETAIRE">SECRETAIRE</option>
            </Select>
            </FormGroup>
            <FormGroupvisible $formgroupdisplay={isVisible ? "flex" : "none"}>
              <Label htmlFor="servicemedical">Service médical</Label>
              <Select id="servicemedical" name="serviceMedicalName" value={formData.serviceMedicalName} onChange={handleChange} >
                 <option value="CARDIOLOGIE">CARDIOLOGIE</option>
                 <option value="MEDECINE_GENERALE">MEDECINE_GENERALE</option>
                 <option value="PEDIATRIE">PEDIATRIE</option>
                 <option value="GYNECOLOGIE">GYNECOLOGIE</option>
                 <option value="DERMATOLOGIE">DERMATOLOGIE</option>
                 <option value="OPHTAMOLOGIE">OPHTAMOLOGIE</option>
                 <option value="ORTHOPEDIE">ORTHOPEDIE</option>
                 <option value="RADIOLOGIE">RADIOLOGIE</option>
                 <option value="LABORATOIRE_ANALYSES">LABORATOIRE_ANALYSES</option>
                 <option value="URGENCES">URGENCES</option>
                 <option value="KINESITHERAPIE">KINESITHERAPIE</option>
                
              </Select>
          </FormGroupvisible>
        </FormRow>
        </FormContainer>
        <ButtonRow>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={() => {
              showConfirmation({
                title: "Annuler",
                message: "Voulez-vous vraiment annuler la création et retourner à la liste des utilisateurs ?",
                onConfirm: () => navigate("/admin/utilisateur"),
                confirmText: "Annuler",
                cancelText: "Continuer"
              });
            }}
            disabled={isLoading('createUser')}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading('createUser')}
          >
            {isLoading('createUser') ? 'Création...' : 'Ajouter'}
          </button>
        </ButtonRow>
      </Form>
      </Afficheformulaireadd>
    </>
  );
};

export default FormulaireUtilisateur;
