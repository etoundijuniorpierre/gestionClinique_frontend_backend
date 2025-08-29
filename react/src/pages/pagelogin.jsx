import '../styles/pagelogin.css'
import '../styles/buttons.css'
import { useState, useEffect } from 'react';
import axiosInstance from '../composants/config/axiosConfig'
import { API_BASE } from '../composants/config/apiconfig';
import { useNavigate } from 'react-router-dom';
import imageclinique from '../assets/img_clinique.jpg'
import logoclinique from '../assets/logo.png'
import icon from '../assets/Icon.png'

function PageLogin() {
  let navigate = useNavigate()
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Par défaut masqué
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  
  // Validation email en temps réel
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  }, [email]);

  // Validation mot de passe en temps réel
  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }
  }, [password]);

  // Vérifier si l'utilisateur était déjà connecté
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setemail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Afficher popup après 5 tentatives échouées
  useEffect(() => {
    if (loginAttempts >= 5) {
      setPopupMessage('Trop de tentatives de connexion échouées. Veuillez contacter l\'administrateur.');
      setShowPopup(true);
    }
  }, [loginAttempts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation finale
    if (!emailValid || !passwordValid) {
      setError('Veuillez corriger les erreurs avant de continuer');
      return;
    }

    // Bloquer si trop de tentatives
    if (loginAttempts >= 5) {
      setError('Trop de tentatives échouées. Contactez l\'administrateur.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post(`/login`, {
        email,
        password,
      });

      const { id, token, username, photoUrl, authorities } = response.data;
      
      // Réinitialiser les tentatives de connexion
      setLoginAttempts(0);
      
      // Sauvegarder les informations de connexion
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('username', username);
      localStorage.setItem('photoUrl', photoUrl);
      localStorage.setItem('user', JSON.stringify(authorities[0].authority));

      // Gérer "Se souvenir de moi"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }


      try {
        setTimeout(async () => {
          try {
            // Vérifier que le token est bien présent
            const token = localStorage.getItem('token');
            if (token) {
              try {
                await axiosInstance.post(`/rendezvous/cancel-old`);
                console.log('Vieux rendez-vous annulés avec succès');
              } catch (cancelError) {
                if (cancelError.response?.status === 403) {
                  console.warn('Droits insuffisants pour annuler les vieux rendez-vous ou endpoint non disponible');
                } else if (cancelError.response?.status === 404) {
                  console.warn('Endpoint pour annuler les vieux rendez-vous non disponible sur le backend');
                } else if (cancelError.response?.status === 500) {
                  console.warn('Erreur serveur lors de l\'annulation des vieux rendez-vous');
                } else if (cancelError.code === 'NETWORK_ERROR') {
                  console.warn('Erreur réseau lors de l\'annulation des vieux rendez-vous');
                } else {
                  console.warn('Erreur lors de l\'annulation des vieux rendez-vous:', cancelError.message || 'Erreur inconnue');
                }
              }
            } else {
              console.warn('Token non trouvé, impossible d\'annuler les vieux rendez-vous');
            }
          } catch (cancelError) {
            console.error('Erreur inattendue lors de l\'annulation des vieux rendez-vous:', cancelError);
            // Ne pas bloquer la connexion si cet appel échoue
            // Log plus détaillé pour le debugging
            if (cancelError.response) {
              console.error('Status:', cancelError.response.status);
              console.error('Data:', cancelError.response.data);
              console.error('Headers:', cancelError.response.headers);
            }
          }
        }, 100); // Attendre 100ms pour s'assurer que le token est bien enregistré
      } catch (outerError) {
        // Si même le setTimeout échoue, on log mais on ne bloque pas la connexion
        console.error('Erreur critique lors de la configuration de l\'annulation des vieux rendez-vous:', outerError);
      }

      // Notification de succès
      if (window.showNotification) {
        window.showNotification('Connexion réussie !', 'success', 3000);
      }

      setSuccess(true);

      // Redirection conditionnelle
      setTimeout(() => {
        if (authorities[0].authority === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else if (authorities[0].authority === 'ROLE_MEDECIN') {
          navigate('/medecin');
        } else if (authorities[0].authority === 'ROLE_SECRETAIRE') {
          navigate('/secretaire');
        } else {
          navigate('/');
        }
      }, 1000);

    } catch (error) {
      console.error('Erreur de connexion :', error);
      
      // Incrémenter les tentatives de connexion
      setLoginAttempts(prev => prev + 1);
      
      if (error.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (error.response?.status === 404) {
        setError('Utilisateur non trouvé');
      } else if (error.response?.status === 403) {
        setError('Compte désactivé. Contactez l\'administrateur.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Erreur de connexion réseau. Vérifiez votre connexion internet.');
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  const handleForgotPassword = () => {
    setPopupMessage('Pour réinitialiser votre mot de passe, contactez l\'administrateur.');
    setShowPopup(true);
  };

  const handleContactAdmin = () => {
    setPopupMessage('Pour toute assistance, contactez l\'administrateur.');
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  return (
    <>
      <div className='accueil'>
        <div className='image-container'>
          <img src={imageclinique} className='img_cli_acc' alt="Clinique" />
        </div>
        <form className='formulaire' onSubmit={handleSubmit}>
          <img src={logoclinique} alt="Logo" />
          <div className='formulaire_1'>
            
            <p className='text'>
              <span>Bonjour ! </span><br />
              Connectez-vous pour commencer à travailler.
            </p>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className='login-label'>
                Email
                {!emailValid && email && (
                  <span className="validation-error"> *</span>
                )}
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={(e) => setemail(e.target.value)} 
                placeholder='Entrez votre email' 
                required 
                className={`login-input ${!emailValid && email ? 'error' : ''}`}
                disabled={isLoading}
                onKeyPress={handleKeyPress}
              />
              {!emailValid && email && (
                <span className="validation-message">Format d'email invalide</span>
              )}
            </div>
    
            <div className="form-group">
              <label htmlFor="password" className='login-label'>
                Mot de passe
                {!passwordValid && password && (
                  <span className="validation-error"> *</span>
                )}
              </label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  value={password} 
                  onChange={(e) => setpassword(e.target.value)} 
                  placeholder='Entrez votre mot de passe' 
                  required 
                  className={`login-input password-input ${!passwordValid && password ? 'error' : ''}`}
                  disabled={isLoading}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {!passwordValid && password && (
                <span className="validation-message">Le mot de passe doit contenir au moins 6 caractères</span>
              )}
            </div>

            {loginAttempts > 0 && (
              <div className="attempt-counter">
                Tentatives de connexion : {loginAttempts}/5
                {loginAttempts >= 3 && (
                  <div className="warning-text">
                    ⚠️ Trop de tentatives échouées
                  </div>
                )}
              </div>
            )}

            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Se souvenir de moi</span>
              </label>
              <button 
                type="button" 
                className="forgot-password-btn"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>
            
            <button 
              type="submit" 
              className={`modern-login-button ${isLoading ? 'loading' : ''} ${success ? 'success' : ''}`} 
              disabled={isLoading || !emailValid || !passwordValid || loginAttempts >= 5}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Connexion...
                </>
              ) : success ? (
                <>
                  ✅ Connexion réussie
                  <img src={icon} className='icon' alt="Connexion" />
                </>
              ) : (
                <>
                  Se connecter 
                  <img src={icon} className='icon' alt="Connexion" />
                </>
              )}
            </button>

            <div className="login-footer">
              <p>Nouveau sur la plateforme ?</p>
              <button 
                type="button" 
                className="contact-admin-btn"
                onClick={handleContactAdmin}
                disabled={isLoading}
              >
                Contactez l'administrateur
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>📞 Contact Administrateur</h3>
              <button className="popup-close" onClick={closePopup}>×</button>
            </div>
            <div className="popup-body">
              <p>{popupMessage}</p>
              <div className="admin-contact">
                <p><strong>Téléphone :</strong> +237 677 850 000</p>
                <p><strong>Email :</strong> admin@gmail.com</p>
                <p><strong>Horaires :</strong> Lundi - Dimanche, 8h - 18h</p>
              </div>
            </div>
            <div className="popup-footer">
              <button className="popup-btn" onClick={closePopup}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PageLogin;
