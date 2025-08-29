import { API_BASE_URL } from './apiconfig';

// Configuration des endpoints de messagerie
const MESSAGERIE_ENDPOINTS = {
  GROUPES: `${API_BASE_URL}/messagerie/groupes`,
  MESSAGES: `${API_BASE_URL}/messagerie`,
  WEBSOCKET: `${API_BASE_URL.replace('http', 'ws')}/ws`
};

// Service pour la gestion des groupes
export const GroupeService = {
  // Créer un nouveau groupe
  async creerGroupe(groupeData) {
    try {
      const response = await fetch(MESSAGERIE_ENDPOINTS.GROUPES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // À adapter selon votre système d'auth
        },
        body: JSON.stringify(groupeData)
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création du groupe: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur GroupeService.creerGroupe:', error);
      throw error;
    }
  },

  // Récupérer tous les groupes de l'utilisateur
  async getGroupesUtilisateur(userId) {
    try {
      const response = await fetch(`${MESSAGERIE_ENDPOINTS.GROUPES}/utilisateur/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des groupes: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur GroupeService.getGroupesUtilisateur:', error);
      throw error;
    }
  }
};

// Service pour la gestion des messages
export const MessageService = {
  // Envoyer un message (via WebSocket)
  async envoyerMessage(messageData) {
    try {
      // Pour l'instant, on simule l'envoi via WebSocket
      // En production, vous devrez implémenter la connexion WebSocket
      console.log('Envoi du message via WebSocket:', messageData);
      
      // Simulation de l'envoi réussi
      return {
        success: true,
        messageId: Date.now(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur MessageService.envoyerMessage:', error);
      throw error;
    }
  },

  // Récupérer un message par ID
  async getMessageById(messageId) {
    try {
      const response = await fetch(`${MESSAGERIE_ENDPOINTS.MESSAGES}/chat.${messageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur MessageService.getMessageById:', error);
      throw error;
    }
  },

  // Mettre à jour un message
  async updateMessage(messageId, updateData) {
    try {
      // Pour l'instant, on simule la mise à jour via WebSocket
      console.log('Mise à jour du message via WebSocket:', { messageId, updateData });
      
      // Simulation de la mise à jour réussie
      return {
        success: true,
        messageId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur MessageService.updateMessage:', error);
      throw error;
    }
  },

  // Supprimer un message
  async deleteMessage(messageId) {
    try {
      // Pour l'instant, on simule la suppression via WebSocket
      console.log('Suppression du message via WebSocket:', messageId);
      
      // Simulation de la suppression réussie
      return {
        success: true,
        messageId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur MessageService.deleteMessage:', error);
      throw error;
      throw error;
    }
  },

  // Récupérer l'historique des messages pour un contact ou groupe
  async getHistoriqueMessages(contactId = null, groupeId = null) {
    try {
      let endpoint = MESSAGERIE_ENDPOINTS.MESSAGES;
      
      if (contactId) {
        endpoint += `/contact/${contactId}`;
      } else if (groupeId) {
        endpoint += `/groupe/${groupeId}`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'historique: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur MessageService.getHistoriqueMessages:', error);
      throw error;
    }
  }
};

// Service pour la gestion des utilisateurs
export const UtilisateurService = {
  // Récupérer tous les utilisateurs pour la création de groupes
  async getAllUtilisateurs() {
    try {
      const response = await fetch(`${API_BASE_URL}/utilisateurs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des utilisateurs: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur UtilisateurService.getAllUtilisateurs:', error);
      throw error;
    }
  }
};

// Configuration WebSocket (à implémenter selon vos besoins)
export const WebSocketConfig = {
  // URL de connexion WebSocket
  url: MESSAGERIE_ENDPOINTS.WEBSOCKET,
  
  // Configuration des topics et queues
  topics: {
    GROUP: '/topic/group.',
    USER: '/queue/user.'
  },
  
  // Configuration des endpoints de mapping
  mappings: {
    SEND_MESSAGE: '/app/chat.sendMessage',
    UPDATE_MESSAGE: '/app/chat.updateMessage',
    DELETE_MESSAGE: '/app/chat.deleteMessage'
  }
};

export default {
  GroupeService,
  MessageService,
  UtilisateurService,
  WebSocketConfig
}; 