/**
 * Service de Logging Professionnel
 * Remplace tous les console.log par un système centralisé et configurable
 * 
 * @author Expert React Senior
 * @version 1.0.0
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

class Logger {
  constructor() {
    // En production, on désactive les logs DEBUG et INFO
    this.currentLevel = import.meta.env.MODE === 'production' 
      ? LOG_LEVELS.ERROR 
      : LOG_LEVELS.DEBUG;
    
    // Préfixe pour identifier facilement les logs de l'application
    this.appPrefix = '[GestionClinique]';
  }

  /**
   * Formate un message de log avec timestamp et contexte
   */
  _formatMessage(level, context, ...args) {
    const timestamp = new Date().toISOString();
    const levelStr = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level);
    const contextStr = context ? `[${context}]` : '';
    
    return [`${this.appPrefix} ${timestamp} ${levelStr} ${contextStr}`, ...args];
  }

  /**
   * Log de niveau DEBUG (développement uniquement)
   * Utilisé pour le débogage détaillé
   */
  debug(context, ...args) {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.log(...this._formatMessage(LOG_LEVELS.DEBUG, context, ...args));
    }
  }

  /**
   * Log de niveau INFO
   * Utilisé pour les informations générales
   */
  info(context, ...args) {
    if (this.currentLevel <= LOG_LEVELS.INFO) {
      console.info(...this._formatMessage(LOG_LEVELS.INFO, context, ...args));
    }
  }

  /**
   * Log de niveau WARN
   * Utilisé pour les avertissements
   */
  warn(context, ...args) {
    if (this.currentLevel <= LOG_LEVELS.WARN) {
      console.warn(...this._formatMessage(LOG_LEVELS.WARN, context, ...args));
    }
  }

  /**
   * Log de niveau ERROR
   * Utilisé pour les erreurs (toujours affiché)
   */
  error(context, ...args) {
    if (this.currentLevel <= LOG_LEVELS.ERROR) {
      console.error(...this._formatMessage(LOG_LEVELS.ERROR, context, ...args));
    }
  }

  /**
   * Log pour les requêtes API
   */
  api(method, url, data = null) {
    this.debug('API', `${method} ${url}`, data);
  }

  /**
   * Log pour les WebSocket
   */
  websocket(event, data = null) {
    this.debug('WebSocket', event, data);
  }

  /**
   * Log pour les notifications
   */
  notification(type, message) {
    this.debug('Notification', `[${type}]`, message);
  }

  /**
   * Log pour l'authentification
   */
  auth(action, details = null) {
    this.info('Auth', action, details);
  }

  /**
   * Change le niveau de log dynamiquement
   */
  setLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
      this.currentLevel = LOG_LEVELS[level];
      this.info('Logger', `Niveau de log changé à: ${level}`);
    }
  }

  /**
   * Groupe de logs (pour les opérations complexes)
   */
  group(label) {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.group(this.appPrefix + ' ' + label);
    }
  }

  groupEnd() {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.groupEnd();
    }
  }

  /**
   * Mesure de performance
   */
  time(label) {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.time(this.appPrefix + ' ' + label);
    }
  }

  timeEnd(label) {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.timeEnd(this.appPrefix + ' ' + label);
    }
  }
}

// Instance singleton
const logger = new Logger();

// Expose le logger globalement en développement pour le débogage
if (import.meta.env.MODE === 'development') {
  window.__logger = logger;
}

export default logger;
export { LOG_LEVELS };
