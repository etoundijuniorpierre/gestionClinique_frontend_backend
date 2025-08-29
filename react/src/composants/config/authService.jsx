import axiosInstance from './axiosConfig';
import { API_BASE } from './apiconfig';

class AuthService {
  constructor() {
    // S'assurer qu'un seul écouteur est enregistré globalement
    this.initializeTokenExpiredListener();
  }

  // Initialiser l'écouteur d'expiration de token de manière sécurisée
  initializeTokenExpiredListener() {
    if (!window.authServiceTokenExpiredListenerAdded) {
      window.addEventListener('tokenExpired', (event) => {
        console.log('Événement tokenExpired reçu:', event.detail);
        this.handleTokenExpired(event.detail.message, event.detail.reason);
      });
      window.authServiceTokenExpiredListenerAdded = true;
      console.log('Écouteur tokenExpired initialisé');
    }
  }

  // Gérer l'expiration du token
  handleTokenExpired(message, reason = 'UNKNOWN') {
    console.log('Gestion de l\'expiration du token:', { message, reason });
    
    // Nettoyer la session immédiatement
    this.clearLocalSession();
    
    // Notification sécurisée avec fallback
    this.showNotification(message, this.getNotificationType(reason), 5000);
    
    // Rediriger vers la page de connexion
    this.redirectToLogin();
  }

  // Déterminer le type de notification selon la raison
  getNotificationType(reason) {
    switch (reason) {
      case 'TOKEN_EXPIRED':
        return 'warning';
      case 'ACCESS_DENIED':
      case 'INSUFFICIENT_PERMISSIONS':
        return 'error';
      default:
        return 'warning';
    }
  }

  // Afficher une notification avec fallback sécurisé
  showNotification(message, type = 'info', duration = 3000) {
    let notificationMessage = message;
    
    // Adapter le message selon la raison si c'est une expiration de token
    if (message.includes('expiré') || message.includes('expired')) {
      notificationMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
    }
    
    // Utiliser le système de notification global s'il existe, sinon fallback
    if (window.showNotification && typeof window.showNotification === 'function') {
      window.showNotification(notificationMessage, type, duration);
    } else {
      // Fallback : affichage console et/ou alert simple
      console.log(`[${type.toUpperCase()}] ${notificationMessage}`);
      if (type === 'error') {
        // Éviter les alert() en production, mais garder pour le debug
        if (process.env.NODE_ENV === 'development') {
          alert(`Erreur: ${notificationMessage}`);
        }
      }
    }
  }

  // Déconnexion via l'endpoint /logout du backend
  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.clearLocalSession();
        return { success: true, message: 'Déconnexion déjà effectuée' };
      }

      // Appel /logout (CustomLogoutHandler met à jour StatusConnect)
      await axiosInstance.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      this.clearLocalSession();
      return { success: true, message: 'Déconnexion réussie' };

    } catch (error) {
      console.error('Erreur lors de la déconnexion backend:', error);
      
      // Analyser le type d'erreur pour déterminer la stratégie
      if (error.response?.status === 401) {
        // Token expiré ou invalide - c'est normal lors de la déconnexion
        console.log('Token expiré détecté lors de la déconnexion, nettoyage de session...');
        this.clearLocalSession();
        return { success: true, message: 'Session expirée, déconnexion effectuée' };
      }
      
      if (error.response?.status === 403) {
        // Accès interdit - l'utilisateur n'a plus les droits
        console.log('Accès interdit détecté, nettoyage de session...');
        this.clearLocalSession();
        return { success: true, message: 'Accès révoqué, déconnexion effectuée' };
      }
      
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        // Erreur réseau - on ne peut pas contacter le backend
        console.log('Erreur réseau lors de la déconnexion, déconnexion forcée...');
        this.clearLocalSession();
        return { success: true, message: 'Déconnexion forcée (erreur réseau)' };
      }
      
      // Autres erreurs - on nettoie quand même la session
      console.log('Autre erreur détectée, nettoyage de session...');
      this.clearLocalSession();
      return { success: false, message: 'Erreur lors de la déconnexion, session fermée' };
    }
  }

  // Déconnexion forcée (quand le backend n'est pas accessible)
  forceLogout() {
    console.log('Déconnexion forcée côté frontend...');
    this.clearLocalSession();
    return { success: true, message: 'Déconnexion forcée effectuée' };
  }

  // Nettoyer la session locale
  clearLocalSession() {
    // Sauvegarder l'email mémorisé si présent et valide
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    
    // Nettoyer la session directement
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('photoUrl');
    localStorage.removeItem('user');
    
    // Remettre l'email mémorisé seulement s'il est valide
    if (rememberedEmail && rememberedEmail !== 'null' && rememberedEmail !== 'undefined') {
      localStorage.setItem('rememberedEmail', rememberedEmail);
    }
    
    console.log('Session locale nettoyée');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Vérifier si l'utilisateur est complètement authentifié
  isUserFullyAuthenticated() {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('user');
    
    // Vérifier que tous les éléments d'authentification sont présents
    const hasAllFields = !!(token && id && username && role);
    
    if (!hasAllFields) {
      return false;
    }
    
    // Vérifier la validité du token JWT si possible
    return this.isTokenValid(token);
  }

  // Vérifier la validité du token JWT
  isTokenValid(token) {
    try {
      // Décoder le JWT pour vérifier l'expiration
      const payload = this.decodeJWT(token);
      if (!payload) {
        return false;
      }
      
      // Vérifier l'expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token JWT expiré');
        // Déclencher l'événement d'expiration
        this.handleTokenExpired('Token JWT expiré', 'TOKEN_EXPIRED');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la validation du token JWT:', error);
      return false;
    }
  }

  // Décoder un JWT de manière sécurisée
  decodeJWT(token) {
    try {
      // Décodage simple base64 (sans dépendance externe)
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        return null;
      }
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage JWT:', error);
      return null;
    }
  }

  // Attendre que l'authentification soit complètement établie
  async waitForAuthentication(timeout = 5000, checkInterval = 100) {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const checkAuth = () => {
        // Vérifier si l'authentification est complète
        if (this.isUserFullyAuthenticated()) {
          console.log('Authentification complète détectée');
          resolve(true);
          return;
        }
        
        // Vérifier le timeout
        if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout: Authentification non établie dans le délai imparti'));
          return;
        }
        
        // Continuer à vérifier
        setTimeout(checkAuth, checkInterval);
      };
      
      // Démarrer la vérification
      checkAuth();
    });
  }

  // Gérer les appels API avec retry automatique
  async apiCallWithRetry(apiCall, maxRetries = 3, retryDelay = 2000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Vérifier l'authentification avant l'appel
        if (!this.isUserFullyAuthenticated()) {
          await this.waitForAuthentication();
        }
        
        // Effectuer l'appel API
        const result = await apiCall();
        return result;
        
      } catch (error) {
        lastError = error;
        
        // Si c'est une erreur 401 (token expiré), déclencher la gestion d'expiration
        if (error.response?.status === 401) {
          console.log('Token expiré détecté lors de l\'appel API, gestion automatique...');
          this.handleTokenExpired('Token expiré lors de l\'appel API', 'TOKEN_EXPIRED');
          throw error; // Arrêter les tentatives
        }
        
        // Si c'est une erreur 403 et qu'on peut retenter
        if (error.response?.status === 403 && attempt < maxRetries) {
          console.log(`Tentative ${attempt} échouée avec erreur 403, nouvelle tentative dans ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
        // Si ce n'est pas une erreur 403 ou qu'on a épuisé les tentatives
        break;
      }
    }
    
    // Si on arrive ici, toutes les tentatives ont échoué
    throw lastError;
  }

  // Obtenir les informations de l'utilisateur
  getUserInfo() {
    const userInfo = {
      id: localStorage.getItem('id'),
      username: localStorage.getItem('username'),
      photoUrl: localStorage.getItem('photoUrl'),
      role: localStorage.getItem('user')
    };
    
    return Object.values(userInfo).every(value => value !== null) ? userInfo : null;
  }

  // Rediriger vers la page de connexion de manière sécurisée
  redirectToLogin() {
    try {
      const currentPath = window.location.pathname;
      
      // Éviter les redirections en boucle
      if (currentPath === '/login' || currentPath === '/') {
        console.log('Déjà sur la page de connexion, pas de redirection nécessaire');
        return;
      }
      
      console.log('Redirection vers la page de connexion depuis:', currentPath);
      
      // Utiliser window.location.href pour éviter les conflits avec React Router
      // React Router gérera automatiquement la redirection
      window.location.href = '/';
      
    } catch (error) {
      console.error('Erreur lors de la redirection:', error);
      // Dernier recours
      try {
        window.location.replace('/');
      } catch (finalError) {
        console.error('Erreur critique lors de la redirection finale:', finalError);
      }
    }
  }

  // Déconnexion avec redirection
  async logoutAndRedirect() {
    const result = await this.logout();
    
    if (result.success) {
      // Notification de succès
      this.showNotification(result.message, 'success', 3000);
      
      // Redirection vers la page de connexion
      this.redirectToLogin();
    }
    
    return result;
  }
}

// Instance singleton du service
const authService = new AuthService();

// Exporter les méthodes spécifiques
export const waitForAuthentication = (...args) => authService.waitForAuthentication(...args);
export const isUserFullyAuthenticated = (...args) => authService.isUserFullyAuthenticated(...args);
export const apiCallWithRetry = (...args) => authService.apiCallWithRetry(...args);

export default authService; 
