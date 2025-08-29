import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import { useNavigate, useParams } from 'react-router-dom';
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
const Span3= Styled.span`
  
`
 
const Span2= Styled.span`
  cursor: pointer;
`
const Span1= Styled.span`
    cursor: pointer;
`
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
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;
const Modifieruser = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
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
const FormGroupvisible = Styled.div`
  flex: 1;
  display: ${props => props.$formgroupdisplay || "none"};
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

// Button styling is now handled by add-buttons.css

const ModifierPatient = () => {
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
  
  const [formData, setFormData] = useState(null);
  const [erreur, setErreur] = useState(null);
 
    const { id } = useParams();
      
  
  
  
   useEffect(()=>{
         startLoading('fetchPatient');
         const fetchPatients = async () => {
            try {
                const response = await axiosInstance.get(`/patients/${id}`);
                //console.log(response.data);
               setFormData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
                window.showNotification('Erreur lors du chargement du patient', 'error');
            } finally {
                stopLoading('fetchPatient');
            }
    
        };
            fetchPatients();
        },[id]);


    const handleSubmit = async(e) => {
      e.preventDefault();
      
      showConfirmation({
        title: "Confirmer la modification",
        message: `Voulez-vous vraiment modifier les informations du patient ${formData.nom} ${formData.prenom} ?`,
        onConfirm: async () => {
          startLoading('updatePatient');
          
          try {
            const response = await axiosInstance.put(`/patients/${id}`, formData);
            
            window.showNotification('Patient modifié avec succès', 'success');
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
              } else if (error.response.status === 404) {
                window.showNotification('Patient introuvable', 'error');
              } else {
                window.showNotification(`Erreur serveur: ${error.response.data?.message || 'Erreur lors de la modification'}`, 'error');
              }
            } else if (error.request) {
              window.showNotification('Erreur de connexion au serveur. Vérifiez votre connexion internet', 'error');
            } else {
              window.showNotification('Erreur lors de la modification du patient', 'error');
            }
          } finally{
            stopLoading('updatePatient');
          }
        },
        confirmText: "Modifier",
        cancelText: "Annuler"
      });
    };    
  
  
  
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'telephone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  
};
  



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
  
  const handleClick1 = () => {
    showConfirmation({
      title: "Voir les détails",
      message: "Voulez-vous voir les détails du patient ?",
      onConfirm: () => navigate(`/admin/patient/viewpatient/${id}`),
      confirmText: "Voir",
      cancelText: "Annuler"
    });
  };
  if (isLoading('fetchPatient')) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Chargement du patient...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Veuillez patienter</div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px', color: '#666' }}>Aucune donnée disponible</div>
        </div>
      </div>
    );
  }

  if (erreur) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px', color: 'red' }}>Erreur</div>
        <div style={{ fontSize: '14px', color: '#666' }}>{erreur}</div>
      </div>
    </div>
  );
  return (
    <>
      <SousDiv1Style>
          <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgprofil} nomprofil={nomprofil}> 
              <Span1 onClick={handleClick}>Liste des patients</Span1>
              <Span2 onClick={handleClick1}> {">"} Détail du patient</Span2>
              <Span3 > {">"} Modifier des informations</Span3>
          </Barrehorizontal1>
      </SousDiv1Style>
      <Modifieruser>
          <Form onSubmit={handleSubmit}>
            <FormContainer>
              <Title>
                <Title1>Modifier les informations du patient</Title1>
                <Title2>Edit</Title2>
            </Title>
            <Title></Title>
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
                    <Label htmlFor="telephone">telephone</Label>
                    <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="XXXXXXXXX" title="9 chiffres" maxLength={9} />
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
                        message: "Voulez-vous vraiment annuler les modifications et retourner à la liste des patients ?",
                        onConfirm: () => navigate("/admin/patient"),
                        confirmText: "Annuler",
                        cancelText: "Continuer"
                      });
                    }}
                    disabled={isLoading('updatePatient')}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading('updatePatient')}
                  >
                    {isLoading('updatePatient') ? 'Modification...' : 'Modifier'}
                  </button>
                </ButtonRow>
          </Form>
      </Modifieruser>
    </>
  );
};

export default ModifierPatient ;
