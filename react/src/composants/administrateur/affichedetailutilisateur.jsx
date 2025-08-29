import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig';
import axiosInstance from '../../composants/config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png';
import { useConfirmation } from '../ConfirmationProvider';

const SousDiv1Style = Styled.div`
 width: 99%;
 padding-left: 1%;
`
const Span2= Styled.span`
  
`
const Span1= Styled.span`
    cursor: pointer;
`
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
    opacity: 0.1; /* ⬅️ Réduit l’opacité de l’image seulement */
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
  font-size: 18px;
  font-weight: 500;
  color: rgba(159, 159, 255, 1);
  padding: 8px 16px;
  font-family: Roboto;
  cursor: pointer;
  border: 2px solid rgba(159, 159, 255, 1);
  border-radius: 20px;
  transition: all 0.3s ease;
  background: transparent;
  
  &:hover {
    background: rgba(159, 159, 255, 1);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(159, 159, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EditButtonsContainer = Styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

// Styles pour le modal de mot de passe (inspiré de photoprofil)
const PasswordModalOverlay = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
`;

const PasswordModalContent = Styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
`;

const PasswordModalHeader = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const PasswordModalTitle = Styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const PasswordCloseButton = Styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    color: #666;
  }
`;

const PasswordModalBody = Styled.div`
  padding: 24px;
`;

const PasswordFormGroup = Styled.div`
  margin-bottom: 20px;
`;

const PasswordLabel = Styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const PasswordInput = Styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 50px; /* Espace pour l'icône */
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #4141ff;
    box-shadow: 0 0 0 3px rgba(65, 65, 255, 0.1);
  }
  
  &.error {
    border-color: #ff4757;
  }
`;

const PasswordInputWrapper = Styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggleButton = Styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4141ff;
  }
  
  &:focus {
    outline: none;
    color: #4141ff;
  }
`;

const PasswordErrorMessage = Styled.div`
  color: #ff4757;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PasswordButtonGroup = Styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const PasswordButton = Styled.button`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background-color: #4141ff;
    color: white;
    
    &:hover {
      background-color: #4a4aff;
    }
    
    &:disabled {
      background-color: #888;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background-color: #f5f5f5;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #e8e8e8;
    }
  }
`;

const PasswordLoadingSpinner = Styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Injecter les keyframes dans le DOM
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

const TraitHorizontal = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(159, 159, 255, 1);
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

const ButtonRow = Styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

const Button = Styled.button`
  padding: 12px 20px;
  border-radius: 20px;
  border: 1px solid rgba(159, 159, 255, 1);
  background: ${props => props.primary ? 'rgba(159, 159, 255, 1)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'rgba(159, 159, 255, 1)'};
  font-weight: 500;
  font-size: 20px;
  font-familly: Roboto;
  width:375px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${props => props.primary ? 'rgba(239, 239, 255, 1)' : '#f2f2ff'};
    color: ${props => props.primary ? 'rgba(159, 159, 255, 1)' : 'rgba(159, 159, 255, 1)'};
  }
`;

const DetailsUtilisateur = () => {

  const idUser = localStorage.getItem('id');
  const [nomprofil, setnomprofil]= useState('');
  const { showConfirmation } = useConfirmation();

    useEffect(() => {
           const nomutilisateur =  async ()=> {
                try {
                const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
                console.log('Token utilisé:', localStorage.getItem('token'));
              if (response) {
                 setnomprofil(response.data.nom)
                } else {
                setErreur('Données introuvables');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
            }
            nomutilisateur()
    }, [idUser]);
  const [isVisiblerole, setisVisiblerole] = useState(false)
  /*if(user.rôle === "Médecin"){
    
  }*/
  const { id } = useParams();
  const [utilisateur, setUtilisateur] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [isloading, setisloading] = useState(true);

  
 useEffect(()=>{
         
         const fetchUtilisateurs = async () => {
            try {
                const response = await axiosInstance.get(`/utilisateurs/${id}`);
                console.log('Token utilisé:', localStorage.getItem('token'));
              
               const user = response.data
               setUtilisateur(response.data);
              if (user.role.roleType === "MEDECIN") {
                 setisVisiblerole(true);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchUtilisateurs();
        },[id]);


       
  
  
  let navigate = useNavigate();
  const handleClick = () => {
    // Redirige vers /utilisateur
    navigate("/admin/utilisateur");
  };
  let navigate1 = useNavigate();
   const handleEditClick = (utilisateur) => {
    navigate1(`/admin/utilisateur/edit/${utilisateur.id}`);
  };
  
  // État pour le modal de mot de passe
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ 
    newPassword: '', 
    confirmPassword: '', 
    showNewPassword: false, 
    showConfirmPassword: false 
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const handleEditPasswordClick = (utilisateur) => {
    setShowPasswordModal(true);
  };
  
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({ 
      newPassword: '', 
      confirmPassword: '', 
      showNewPassword: false, 
      showConfirmPassword: false 
    });
    setPasswordErrors({});
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    const newPassword = passwordData.newPassword;
    const confirmPassword = passwordData.confirmPassword;
    
    // Validation
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }
    
    // Demander confirmation avant de modifier le mot de passe
    showConfirmation({
      title: 'Modifier le mot de passe',
      message: `Êtes-vous sûr de vouloir modifier le mot de passe de ${utilisateur.nom} ${utilisateur.prenom} ?`,
      onConfirm: async () => {
        setIsPasswordLoading(true);
        setPasswordErrors({});
        
        try {
          // Appel API pour changer le mot de passe de l'utilisateur sélectionné
          const response = await axiosInstance.put(`/utilisateurs/${utilisateur.id}/password`, {
            newPassword: newPassword,
            confirmPassword: confirmPassword
          });
          
          if (response.status === 200) {
            if (window.showNotification) {
              window.showNotification('Mot de passe modifié avec succès !', 'success');
            }
            closePasswordModal();
          }
          
        } catch (error) {
          console.error('Erreur lors du changement de mot de passe:', error);
          let errorMessage = 'Erreur lors du changement de mot de passe. Veuillez réessayer.';
          
          if (error.response?.status === 401) {
            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          } else if (error.response?.status === 403) {
            errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data?.message || 'Données invalides.';
          }
          
          setPasswordErrors({ general: errorMessage });
          
          if (window.showNotification) {
            window.showNotification(errorMessage, 'error');
          }
        } finally {
          setIsPasswordLoading(false);
        }
      },
      confirmText: 'Modifier',
      cancelText: 'Annuler',
      variant: 'info'
    });
  };
  if (!utilisateur) {
  return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  }
  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
  return (
    <>
      <SousDiv1Style>
          <Barrehorizontal1 titrepage="Gestion des utilisateurs" imgprofil1={imgprofil} nomprofil={nomprofil}> 
              <Span1 onClick={handleClick}>Liste des utilisateurs</Span1>
              <Span2 > {">"} Détail de l'utilisateur</Span2>
          </Barrehorizontal1>
      </SousDiv1Style>
      <Affichedetailuser>
          <Form>
            <FormContainer>
            <Title>
                <Title1>Détail utilisateur</Title1>
                <EditButtonsContainer>
                  <Title2 onClick={() => handleEditClick(utilisateur)}>Edit utilisateur</Title2>
                  <Title2 onClick={() => handleEditPasswordClick(utilisateur)}>Edit password</Title2>
                </EditButtonsContainer>
            </Title>
            
            <TraitHorizontal></TraitHorizontal>
            <FormRow>
              <FormGroup>
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" value={utilisateur.nom} readOnly/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" name="prenom" value={utilisateur.prenom} readOnly/>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" name="adresse" value={utilisateur.adresse} readOnly/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={utilisateur.email} readOnly/>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" name="genre" value={utilisateur.genre}  readOnly>
              </Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input id="dateNaissance" name="dateNaissance" type="date" value={utilisateur.dateNaissance} readOnly/>
              </FormGroup>
            </FormRow>
             <FormRow>
              <FormGroup>
                <Label htmlFor="password">password</Label>
                <Input id="password" name="password"  value={utilisateur.password} readOnly />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telephone">telephone</Label>
                <Input id="telephone" name="telephone" value={utilisateur.telephone} readOnly />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <Label htmlFor="role">Rôle</Label>
                <Input id="role" name="role" value={utilisateur.role.roleType} readOnly/>
                </FormGroup>
                <FormGroupvisible $formgroupdisplay={isVisiblerole ? "flex" : "none"}>
                  <Label htmlFor="servicemedical">Service médical</Label>
                  <Input id="servicemedical" name="servicemedical" value={utilisateur.serviceMedicalName} readOnly />
                  
              </FormGroupvisible>
            </FormRow>
            </FormContainer>
          </Form>
      </Affichedetailuser>
      
      {/* Modal de changement de mot de passe */}
      {showPasswordModal && (
        <PasswordModalOverlay onClick={closePasswordModal}>
          <PasswordModalContent onClick={(e) => e.stopPropagation()}>
            <PasswordModalHeader>
              <PasswordModalTitle>🔒 Modifier le mot de passe</PasswordModalTitle>
              <PasswordCloseButton onClick={closePasswordModal}>×</PasswordCloseButton>
            </PasswordModalHeader>
            
            <PasswordModalBody>
              <form onSubmit={handlePasswordChange}>
                <PasswordFormGroup>
                  <PasswordLabel htmlFor="newPassword">Nouveau mot de passe</PasswordLabel>
                  <PasswordInputWrapper>
                    <PasswordInput
                      type={passwordData.showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Entrez le nouveau mot de passe"
                      className={passwordErrors.newPassword ? 'error' : ''}
                    />
                    <PasswordToggleButton onClick={() => setPasswordData(prev => ({ ...prev, showNewPassword: !prev.showNewPassword }))}>
                      {passwordData.showNewPassword ? '🙈' : '👁️'}
                    </PasswordToggleButton>
                  </PasswordInputWrapper>
                  {passwordErrors.newPassword && (
                    <PasswordErrorMessage>⚠️ {passwordErrors.newPassword}</PasswordErrorMessage>
                  )}
                </PasswordFormGroup>
                
                <PasswordFormGroup>
                  <PasswordLabel htmlFor="confirmPassword">Confirmer le nouveau mot de passe</PasswordLabel>
                  <PasswordInputWrapper>
                    <PasswordInput
                      type={passwordData.showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirmez le nouveau mot de passe"
                      className={passwordErrors.confirmPassword ? 'error' : ''}
                    />
                    <PasswordToggleButton onClick={() => setPasswordData(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}>
                      {passwordData.showConfirmPassword ? '🙈' : '👁️'}
                    </PasswordToggleButton>
                  </PasswordInputWrapper>
                  {passwordErrors.confirmPassword && (
                    <PasswordErrorMessage>⚠️ {passwordErrors.confirmPassword}</PasswordErrorMessage>
                  )}
                </PasswordFormGroup>
                
                {passwordErrors.general && (
                  <PasswordErrorMessage>⚠️ {passwordErrors.general}</PasswordErrorMessage>
                )}
                
                <PasswordButtonGroup>
                  <PasswordButton 
                    type="button" 
                    className="secondary"
                    onClick={closePasswordModal}
                  >
                    Annuler
                  </PasswordButton>
                  <PasswordButton 
                    type="submit"
                    className="primary"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? (
                      <>
                        <PasswordLoadingSpinner />
                        Modification...
                      </>
                    ) : (
                      'Modifier le mot de passe'
                    )}
                  </PasswordButton>
                </PasswordButtonGroup>
              </form>
            </PasswordModalBody>
          </PasswordModalContent>
        </PasswordModalOverlay>
      )}
    </>
  );
};

export default DetailsUtilisateur;
