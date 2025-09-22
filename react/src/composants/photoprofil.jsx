import { useState, useRef, useEffect } from 'react';
import Styled from 'styled-components';

const ProfileContainer = Styled.div`
  position: relative;
  display: inline-block;
`;

const ImgprofilStyle = Styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    cursor: pointer;
    transition: transform 0.2s ease;
    border: 2px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-color: #4141ff;
  }
`;

const DropdownMenu = Styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  margin-top: 8px;
`;

const MenuItem = Styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const MenuIcon = Styled.span`
  font-size: 18px;
  color: #666;
`;

const MenuText = Styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 500;
`;

const FileInput = Styled.input`
  display: none;
`;

// Styles pour les modals
const ModalOverlay = Styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000000000;
  animation: fadeIn 0.3s ease-out;
  padding: 20px;
  box-sizing: border-box;
  
  /* Garantir le centrage parfait sur tous les écrans */
  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(4px);
  }
`;

const ModalContent = Styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
  position: relative;
  
  /* Amélioration du centrage vertical */
  margin: auto;
  
  /* Responsive design amélioré */
  @media (max-width: 480px) {
    width: 95%;
    max-width: none;
    margin: 10px;
  }
  
  /* Scrollbar personnalisée */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const ModalHeader = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = Styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = Styled.button`
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

const ModalBody = Styled.div`
  padding: 24px;
`;

const FormGroup = Styled.div`
  margin-bottom: 20px;
`;

const Label = Styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const Input = Styled.input`
  width: 100%;
  padding: 12px 16px;
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

const ErrorMessage = Styled.div`
  color: #ff4757;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SuccessMessage = Styled.div`
  color: #2ed573;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ButtonGroup = Styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = Styled.button`
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

const FilePreview = Styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;
  text-align: center;
  
  &.has-file {
    border-color: #4141ff;
    background-color: #f0f0ff;
  }
`;

const PreviewImage = Styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const FileInfo = Styled.div`
  font-size: 14px;
  color: #666;
`;

const LoadingSpinner = Styled.div`
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

// Améliorer les animations pour un meilleur centrage
const keyframes = `
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      backdrop-filter: blur(0px);
    }
    to { 
      opacity: 1; 
      backdrop-filter: blur(4px);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

function Photoprofil({ imgprofil, onPhotoUpload, onChangePassword, userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openPhotoModal = () => {
    setShowPhotoModal(true);
    setSelectedFile(null);
    setErrors({});
    setSuccess('');
    setIsMenuOpen(false);
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setErrors({});
    setSuccess('');
    setIsMenuOpen(false);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedFile(null);
    setErrors({});
    setSuccess('');
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setErrors({});
    setSuccess('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validation du fichier
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      
      if (file.size > maxSize) {
        setErrors({ file: 'Le fichier est trop volumineux (max 5MB)' });
        if (window.showNotification) {
          window.showNotification('Le fichier est trop volumineux (max 5MB)', 'error');
        }
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({ file: 'Format de fichier non supporté (JPG, PNG, GIF uniquement)' });
        if (window.showNotification) {
          window.showNotification('Format de fichier non supporté (JPG, PNG, GIF uniquement)', 'error');
        }
        return;
      }
      
      setSelectedFile(file);
      setErrors({});
      
      if (window.showNotification) {
        window.showNotification('Photo sélectionnée avec succès !', 'success');
      }
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      setErrors({ file: 'Veuillez sélectionner un fichier' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (window.showNotification) {
        window.showNotification('Upload de la photo en cours...', 'info');
      }
      
      // Appel API pour uploader la photo
      if (onPhotoUpload) {
        await onPhotoUpload(selectedFile);
      }
      
      setSuccess('Photo uploadée avec succès !');
      
      if (window.showNotification) {
        window.showNotification('Photo de profil mise à jour avec succès !', 'success');
      }
      
      setTimeout(() => {
        closePhotoModal();
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setErrors({ upload: 'Erreur lors de l\'upload. Veuillez réessayer.' });
      
      if (window.showNotification) {
        window.showNotification('Erreur lors de l\'upload de la photo', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validation
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Le nouveau mot de passe doit contenir au moins 8 caractères';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Notifications d'erreur
      Object.values(newErrors).forEach(error => {
        if (window.showNotification) {
          window.showNotification(error, 'error');
        }
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (window.showNotification) {
        window.showNotification('Modification du mot de passe en cours...', 'info');
      }
      
      if (onChangePassword) {
        await onChangePassword({ newPassword, confirmPassword });
      }
      
      setSuccess('Mot de passe modifié avec succès !');
      
      if (window.showNotification) {
        window.showNotification('Mot de passe modifié avec succès !', 'success');
      }
      
      setTimeout(() => {
        closePasswordModal();
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setErrors({ general: 'Erreur lors du changement de mot de passe. Veuillez réessayer.' });
      
      if (window.showNotification) {
        window.showNotification('Erreur lors du changement de mot de passe', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ProfileContainer ref={dropdownRef}>
        <ImgprofilStyle 
          src={imgprofil} 
          alt="Photo de profil"
          onClick={toggleMenu}
        />
        
                    <DropdownMenu $isOpen={isMenuOpen}>
          <MenuItem onClick={openPhotoModal}>
            <MenuIcon>📷</MenuIcon>
            <MenuText>Changer la photo</MenuText>
          </MenuItem>
          
          <MenuItem onClick={openPasswordModal}>
            <MenuIcon>🔒</MenuIcon>
            <MenuText>Modifier le mot de passe</MenuText>
          </MenuItem>
        </DropdownMenu>
        
        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
      </ProfileContainer>

      {/* Modal d'upload de photo */}
      {showPhotoModal && (
        <ModalOverlay onClick={closePhotoModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>📷 Changer la photo de profil</ModalTitle>
              <CloseButton onClick={closePhotoModal}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label htmlFor="photoFile">Sélectionner une image</Label>
                <Input
                  type="file"
                  id="photoFile"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                {errors.file && (
                  <ErrorMessage>⚠️ {errors.file}</ErrorMessage>
                )}
              </FormGroup>
              
              {selectedFile && (
                <FilePreview className="has-file">
                  <PreviewImage 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Aperçu"
                  />
                  <FileInfo>
                    <strong>{selectedFile.name}</strong><br />
                    Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </FileInfo>
                </FilePreview>
              )}
              
              {errors.upload && (
                <ErrorMessage>⚠️ {errors.upload}</ErrorMessage>
              )}
              
              {success && (
                <SuccessMessage>✅ {success}</SuccessMessage>
              )}
              
              <ButtonGroup>
                <Button 
                  className="primary" 
                  onClick={handlePhotoUpload}
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Upload en cours...
                    </>
                  ) : (
                    'Uploader la photo'
                  )}
                </Button>
                <Button className="secondary" onClick={closePhotoModal}>
                  Annuler
                </Button>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de changement de mot de passe */}
      {showPasswordModal && (
        <ModalOverlay onClick={closePasswordModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>🔒 Modifier le mot de passe</ModalTitle>
              <CloseButton onClick={closePasswordModal}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handlePasswordChange}>
                <FormGroup>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      placeholder="Entrez le nouveau mot de passe"
                      className={errors.newPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(prev => !prev)}
                      aria-label={showNewPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      {showNewPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <ErrorMessage>⚠️ {errors.newPassword}</ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirmez le nouveau mot de passe"
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <ErrorMessage>⚠️ {errors.confirmPassword}</ErrorMessage>
                  )}
                </FormGroup>
                
                {errors.general && (
                  <ErrorMessage>⚠️ {errors.general}</ErrorMessage>
                )}
                
                {success && (
                  <SuccessMessage>✅ {success}</SuccessMessage>
                )}
                
                <ButtonGroup>
                  <Button 
                    type="submit" 
                    className="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Modification en cours...
                      </>
                    ) : (
                      'Modifier le mot de passe'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    className="secondary" 
                    onClick={closePasswordModal}
                  >
                    Annuler
                  </Button>
                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

export default Photoprofil;
