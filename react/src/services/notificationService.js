// Fonction simple pour formater le temps écoulé
const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days < 7) return `il y a ${days}j`;
  return `il y a ${Math.floor(days / 7)} sem`;
};

class NotificationService {
  constructor() {
    this.notifications = this.loadNotifications();
    this.listeners = [];
    this.unreadCount = 0;
    this.updateUnreadCount();
  }

  // Charger les notifications depuis le localStorage
  loadNotifications() {
    try {
      const stored = localStorage.getItem('chatNotifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      return [];
    }
  }

  // Sauvegarder les notifications dans le localStorage
  saveNotifications() {
    try {
      localStorage.setItem('chatNotifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error);
    }
  }

  // Ajouter une nouvelle notification
  addNotification(message, conversation, sender) {
    console.log('🔔 Ajout d\'une nouvelle notification:', {
      messageId: message.id,
      conversationId: conversation.id,
      senderName: sender.nom,
      messagePreview: message.contenu?.substring(0, 50)
    });



    const notification = {
      id: Date.now() + Math.random(),
      messageId: message.id,
      conversationId: conversation.id,
      conversationName: this.getConversationName(conversation, sender),
      senderName: sender.nom || 'Quelqu\'un',
      messagePreview: message.contenu?.substring(0, 100) || 'Nouveau message',
      timeAgo: formatTimeAgo(new Date(message.creationDate || Date.now())),
      timestamp: new Date().toISOString(),
      read: false,
      type: 'NEW_MESSAGE'
    };

    this.notifications.unshift(notification);
    
    // Garder seulement les 50 dernières notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.saveNotifications();
    this.updateUnreadCount();
    this.notifyListeners();
    
    // Notification native du navigateur si supportée
    this.showNativeNotification(notification);
    
    console.log('✅ Notification ajoutée avec succès, total non lues:', this.unreadCount);
    
    return notification;
  }

  // Obtenir le nom de la conversation
  getConversationName(conversation, sender) {
    if (conversation.type === 'GROUP') {
      return conversation.nom || 'Groupe';
    }
    
    // Pour les conversations privées, afficher le nom de l'autre participant
    const otherParticipant = conversation.participants?.find(p => p.id !== sender.id);
    if (otherParticipant) {
      return `${otherParticipant.nom} ${otherParticipant.prenom || ''}`.trim();
    }
    
    return 'Conversation privée';
  }

  // Marquer une notification comme lue
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.updateUnreadCount();
      this.notifyListeners();
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.updateUnreadCount();
    this.notifyListeners();
  }

  // Supprimer une notification
  dismissNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.updateUnreadCount();
    this.notifyListeners();
  }

  // Supprimer toutes les notifications
  clearAllNotifications() {
    this.notifications = [];
    this.saveNotifications();
    this.updateUnreadCount();
    this.notifyListeners();
  }

  // Obtenir toutes les notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Obtenir les notifications non lues
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read);
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount() {
    return this.unreadCount;
  }

  // Mettre à jour le compteur de notifications non lues
  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  // Notification native du navigateur
  showNativeNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        // TOUJOURS afficher la notification native
        new Notification(`Nouveau message de ${notification.senderName}`, {
          body: `${notification.conversationName}: ${notification.messagePreview}`,
          icon: '/favicon.ico',
          tag: `chat-${notification.conversationId}`,
          requireInteraction: false,
          silent: false,
          badge: '/favicon.ico',
          vibrate: [200, 100, 200]
        });
        
        console.log('🔔 Notification native affichée:', {
          sender: notification.senderName,
          conversation: notification.conversationName
        });
      } catch (error) {
        console.warn('Erreur lors de l\'affichage de la notification native:', error);
      }
    }
  }

  // Demander la permission pour les notifications natives
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Erreur lors de la demande de permission:', error);
        return false;
      }
    }
    return Notification.permission === 'granted';
  }

  // Système d'écouteurs pour les mises à jour
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notifier tous les écouteurs
  notifyListeners() {
    console.log('📢 Notification des écouteurs:', {
      listenersCount: this.listeners.length,
      unreadCount: this.getUnreadCount()
    });
    
    this.listeners.forEach((callback, index) => {
      try {
        callback({
          notifications: this.getNotifications(),
          unreadCount: this.getUnreadCount()
        });
        console.log(`✅ Listener ${index + 1} notifié avec succès`);
      } catch (error) {
        console.error(`❌ Erreur dans le listener ${index + 1}:`, error);
      }
    });
  }

  // Nettoyer les anciennes notifications (plus de 7 jours)
  cleanupOldNotifications() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    this.notifications = this.notifications.filter(n => {
      const notificationDate = new Date(n.timestamp);
      return notificationDate > sevenDaysAgo;
    });
    
    this.saveNotifications();
    this.updateUnreadCount();
    this.notifyListeners();
  }
}

// Instance singleton
const notificationService = new NotificationService();

// Nettoyage automatique toutes les heures
setInterval(() => {
  notificationService.cleanupOldNotifications();
}, 60 * 60 * 1000);

export default notificationService;
