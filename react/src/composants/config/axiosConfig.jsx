import axios from 'axios';
import { API_BASE } from './apiconfig';

// Configuration de base d'Axios
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter automatiquement le token aux requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
axiosInstance.interceptors.response.use(
  (response) => {
    // Succès - retourner la réponse
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response.data?.code;
      const errorMessage = error.response.data?.error;
      const responseData = error.response.data;
      
      console.log('Erreur 401 détectée:', { 
        errorCode, 
        errorMessage, 
        responseData,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Vérifier si c'est un problème de token expiré ou invalide
      if (errorCode === 'TOKEN_EXPIRED' || 
          errorCode === 'TOKEN_INVALID' || 
          errorMessage?.includes('expired') ||
          errorMessage?.includes('invalid') ||
          errorMessage?.includes('JWT') ||
          errorMessage?.includes('token')) {
        
        console.log('Token expiré ou invalide détecté, déconnexion automatique...');
        
        // Nettoyer la session et dispatcher un événement pour la déconnexion
        clearSession();
        window.dispatchEvent(new CustomEvent('tokenExpired', { 
          detail: { 
            message: 'Votre session a expiré. Veuillez vous reconnecter.',
            reason: 'TOKEN_EXPIRED'
          } 
        }));
        
      } else if (errorMessage === 'Invalid credentials.' || 
                 responseData === 'Invalid credentials.' ||
                 errorMessage === 'Bad credentials') {
        
        console.log('Problème d\'authentification détecté (Invalid credentials)');
        
        // Pour les erreurs "Invalid credentials", on ne nettoie pas automatiquement
        // car cela peut être dû à un mot de passe incorrect
        // On laisse le composant gérer l'erreur
        
      } else if (errorCode === 'ACCESS_DENIED' || 
                 errorMessage?.includes('access') ||
                 errorMessage?.includes('forbidden')) {
        
        console.log('Accès refusé détecté, déconnexion automatique...');
        
        clearSession();
        window.dispatchEvent(new CustomEvent('tokenExpired', { 
          detail: { 
            message: 'Accès refusé. Veuillez vous reconnecter.',
            reason: 'ACCESS_DENIED'
          } 
        }));
        
      } else {
        // Autres erreurs 401 non gérées - déconnexion préventive
        console.log('Autre erreur 401 détectée, déconnexion préventive...');
        clearSession();
        window.dispatchEvent(new CustomEvent('tokenExpired', { 
          detail: { 
            message: 'Erreur d\'authentification, déconnexion préventive',
            reason: 'UNKNOWN_401'
          } 
        }));
      }
    }
    
    // Gérer les erreurs 403 (Forbidden)
    if (error.response?.status === 403) {
      console.log('Erreur 403 (Forbidden) détectée, vérification des droits...');
      console.log('URL de la requête:', error.config?.url);
      console.log('Méthode de la requête:', error.config?.method);
      console.log('Headers de la requête:', error.config?.headers);
      console.log('Token présent:', !!localStorage.getItem('token'));
      
      // Si c'est un problème de droits, on peut essayer de rafraîchir le token
      // ou déconnecter l'utilisateur selon le contexte
      const errorMessage = error.response.data?.error;
      const errorData = error.response.data;
      
      console.log('Détails de l\'erreur 403:', { errorMessage, errorData });
      
      if (errorMessage?.includes('insufficient') || 
          errorMessage?.includes('permission') ||
          errorMessage?.includes('role')) {
        
        console.log('Droits insuffisants détectés, déconnexion...');
        clearSession();
        window.dispatchEvent(new CustomEvent('tokenExpired', { 
          detail: { 
            message: 'Droits insuffisants. Veuillez vous reconnecter.',
            reason: 'INSUFFICIENT_PERMISSIONS'
          } 
        }));
      } else {
        // Pour les autres erreurs 403, on peut essayer de continuer
        // car cela peut être un problème temporaire ou de configuration
        console.log('Erreur 403 non critique, continuation...');
      }
    }
    
    // Retourner l'erreur pour que le composant puisse la gérer
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Fonction utilitaire pour obtenir le token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Fonction utilitaire pour obtenir les informations de l'utilisateur
export const getUserInfo = () => {
  const userInfo = {
    id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
    photoUrl: localStorage.getItem('photoUrl'),
    role: localStorage.getItem('user')
  };
  
  return Object.values(userInfo).every(value => value !== null) ? userInfo : null;
};

// Fonction utilitaire pour nettoyer la session
export const clearSession = () => {
  // Nettoyer la session directement sans créer de dépendance circulaire
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('username');
  localStorage.removeItem('photoUrl');
  localStorage.removeItem('user');
  console.log('Session nettoyée via clearSession');
};

// Export de l'instance Axios configurée
export default axiosInstance; 
