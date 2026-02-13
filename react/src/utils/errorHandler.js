/**
 * Utilitaire centralisé pour la gestion des erreurs backend
 */

// Dictionnaire de traduction des messages anglais -> français
const translations = {
  "A user with this username already exists": "Un utilisateur avec ce nom d'utilisateur existe déjà",
  "A user with this email address already exists": "Un utilisateur avec cet email existe déjà",
  "Invalid credentials": "Identifiants invalides",
  "Access denied": "Accès refusé",
  "Resource not found": "Ressource non trouvée",
  "Le nom d'utilisateur ne peut pas être vide": "Le nom d'utilisateur ne peut pas être vide",
  "Le mot de passe ne peut pas être vide": "Le mot de passe ne peut pas être vide",
  "Le mot de passe doit contenir au moins 8 caractères": "Le mot de passe doit contenir au moins 8 caractères",
};

/**
 * Traduit un message anglais en français si une traduction existe
 * @param {string} message - Le message à traduire
 * @returns {string} - Le message traduit ou le message original
 */
export const translateMessage = (message) => {
  if (!message) return null;
  
  // Chercher une correspondance partielle dans le dictionnaire
  for (const [english, french] of Object.entries(translations)) {
    if (message.includes(english)) {
      return french;
    }
  }
  
  return message;
};

/**
 * Messages par défaut selon le code HTTP
 */
const defaultMessages = {
  400: "Données invalides. Vérifiez les informations saisies",
  401: "Session expirée. Veuillez vous reconnecter",
  403: "Vous n'avez pas la permission d'effectuer cette action",
  404: "Ressource non trouvée",
  409: "Conflit de données. L'élément existe peut-être déjà",
  500: "Erreur serveur. Veuillez réessayer plus tard",
};

/**
 * Gère une erreur Axios et affiche une notification appropriée
 * @param {Error} error - L'erreur Axios
 * @param {string} fallbackMessage - Message par défaut si aucun message n'est disponible
 */
export const handleApiError = (error, fallbackMessage = "Une erreur est survenue") => {
  console.error('Erreur API:', error);

  if (error.response) {
    const { status, data } = error.response;
    const backendMessage = data?.message;
    
    // Traduire le message du backend s'il existe
    const translatedMessage = translateMessage(backendMessage);
    
    // Utiliser le message traduit, ou le message par défaut pour ce code HTTP, ou le fallback
    const displayMessage = translatedMessage || defaultMessages[status] || fallbackMessage;
    
    window.showNotification(displayMessage, 'error');
  } else if (error.request) {
    window.showNotification('Erreur de connexion au serveur. Vérifiez votre connexion internet', 'error');
  } else {
    window.showNotification(fallbackMessage, 'error');
  }
};

export default handleApiError;
