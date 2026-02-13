import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axiosInstance from '../config/axiosConfig';
import { 
  useConversations, 
  connectWebSocket, 
  disconnectWebSocket,
  checkAuthStatus,
  notifyMessageListeners
} from '../../services/messagerieService';
import notificationService from '../../services/notificationService';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import UserList from './UserList';
import CreateGroupModal from './CreateGroupModal';
import ChatTabs from './ChatTabs';
import MessageNotification from './MessageNotification';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png';

// Fallback simple pour les notifications si le hook n'est pas disponible
let useNotificationFallback = () => ({
  showNotification: (message, type = 'info') => {
    console.log(`[Notification] ${type}: ${message}`);
    if (type === 'error') {
      alert(`Erreur: ${message}`);
    }
  }
});

// Essayer d'importer le hook de notification, sinon utiliser le fallback
try {
  const { useNotification } = require('../notification');
  useNotificationFallback = useNotification;
} catch (error) {
  console.warn('Impossible de charger le système de notification, utilisation du fallback:', error);
}

const useNotification = useNotificationFallback;

const ChatContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 92vh;
  background: #f8f9fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

`;

const SousDiv1Style = styled.div`
  width: 99%;
  padding-left: 1%;
  margin-bottom: 16px;
`;

const SousDiv2Style = styled.div`
  width: 100%;
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow: hidden;
`;

const ChatContent = styled.div`
  display: flex;
  flex: 1;
  background: #efefff;
  border-radius: 12px;
  padding: 25px;
  overflow: hidden;
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  
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

const Sidebar = styled.div`
  width: 380px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  margin-right: 16px;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  overflow: hidden;
`;

const Header = styled.div`
  height: 60px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  border-radius: 0;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
`;

const AutoRefreshIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;



const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;

  .plus-icon {
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
    transform: none;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
  }
`;

const ChatContainer = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('private');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { conversations, loading, error, fetchConversations, updateConversationOrder } = useConversations();
  const { showNotification } = useNotification();
  const wsConnected = useRef(false);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Vérifier l'état de l'authentification
        const authStatus = checkAuthStatus();
        console.log('🔍 État d\'authentification:', authStatus);
        
        if (!authStatus.isAuthenticated) {
          showNotification('Veuillez vous connecter pour accéder au chat', 'error');
          return;
        }
        
        // Récupérer les informations de l'utilisateur connecté
        const userId = localStorage.getItem('id');
        
        // Récupérer le rôle depuis la clé 'user' (comme dans le login)
        let userRole = 'USER';
        try {
          const userRoleRaw = localStorage.getItem('user');
          if (userRoleRaw) {
            userRole = JSON.parse(userRoleRaw);
          }
        } catch (error) {
          console.warn('Erreur lors du parsing du rôle:', error);
        }
        
        // Récupérer les informations complètes de l'utilisateur via API
        try {
          const response = await axiosInstance.get(`/utilisateurs/${userId}`);
          if (response.data) {
            setCurrentUser({
              id: parseInt(userId),
              nom: response.data.nom || 'Utilisateur',
              role: userRole
            });
          } else {
            // Fallback si l'API échoue
            setCurrentUser({
              id: parseInt(userId),
              nom: 'Utilisateur',
              role: userRole
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
          // Fallback en cas d'erreur
          setCurrentUser({
            id: parseInt(userId),
            nom: 'Utilisateur',
            role: userRole
          });
        }

        // Charger les conversations
        await fetchConversations();

        // Initialiser le service de notifications
        await notificationService.requestNotificationPermission();
        
        // Écouter les changements de notifications
        const removeNotificationListener = notificationService.addListener(({ notifications, unreadCount }) => {
          setNotifications(notifications);
          setUnreadCount(unreadCount);
        });

        // Connecter au WebSocket
        if (userId && !wsConnected.current) {
          connectWebSocket(
            parseInt(userId),
            handleWebSocketMessage,
            () => {
              wsConnected.current = true;
              console.log('✅ WebSocket connecté avec succès');
            }
          );
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation du chat:', error);
        showNotification(error.message, 'error');
      }
    };

    initializeChat();

    // Nettoyage et reconnexion automatique
    return () => {
      if (wsConnected.current) {
        disconnectWebSocket();
        wsConnected.current = false;
      }
    };
  }, []);

  // Effet pour gérer la reconnexion WebSocket
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser?.id && !wsConnected.current) {
        console.log('🔄 Reconnexion WebSocket après retour sur l\'onglet');
        connectWebSocket(
          currentUser.id,
          handleWebSocketMessage,
          () => {
            wsConnected.current = true;
            console.log('✅ WebSocket reconnecté');
          }
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentUser?.id]);

  const handleWebSocketMessage = (message) => {
    console.log('📨 Message WebSocket reçu:', message);
    
    // Rafraîchir les conversations si un nouveau message arrive
    if (message.type === 'NEW_MESSAGE' || message.type === 'MESSAGE_UPDATED' || message.type === 'MESSAGE_DELETED') {
      console.log('🔄 Mise à jour des conversations suite à:', message.type);
      
      if (message.type === 'NEW_MESSAGE' && message.message) {
        const conversationId = message.message.conversationId;
        
        if (conversationId) {
          // Mettre à jour l'ordre des conversations pour ce message
          updateConversationOrder(conversationId);
          
          // Notifier les écouteurs de messages en temps réel
          notifyMessageListeners(conversationId, message.message, 'ADD');
          
          // Forcer la mise à jour de la liste des conversations
          console.log('🔄 Forçage de la mise à jour des conversations');
          fetchConversations();
          
          // Si c'est la conversation actuellement sélectionnée, rafraîchir aussi
          if (selectedConversation && conversationId === selectedConversation.id) {
            console.log('🔄 Rafraîchissement de la conversation active');
            // Le ChatWindow se chargera de la mise à jour via son écouteur WebSocket
          }
        }
        
        // Créer une notification pour TOUS les nouveaux messages (sans contrainte)
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation && message.message.expediteur) {
          console.log('🔔 Création de notification pour nouveau message:', {
            conversationId,
            sender: message.message.expediteur.nom,
            messagePreview: message.message.contenu?.substring(0, 50)
          });
          
          // TOUJOURS créer la notification dans le service
          notificationService.addNotification(
            message.message,
            conversation,
            message.message.expediteur
          );
          
          // TOUJOURS afficher une notification toast
          showNotification(
            `Nouveau message de ${message.message.expediteur?.nom || 'Quelqu\'un'}`,
            'info'
          );
        }
      } else if (message.type === 'MESSAGE_UPDATED' && message.message) {
        // Notifier la mise à jour du message
        const conversationId = message.message.conversationId;
        if (conversationId) {
          notifyMessageListeners(conversationId, message.message, 'UPDATE');
        }
      } else if (message.type === 'MESSAGE_DELETED' && message.message) {
        // Notifier la suppression du message
        const conversationId = message.message.conversationId;
        if (conversationId) {
          notifyMessageListeners(conversationId, message.message, 'DELETE');
        }
      }
    } else {
      // Pour les autres types de messages, rafraîchir complètement
      fetchConversations();
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setShowUserList(false);
  };

  const handleNewConversation = () => {
    setShowUserList(true);
    setSelectedConversation(null);
  };

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  const handleConversationCreated = (newConversation) => {
    console.log('🆕 Nouvelle conversation créée:', newConversation);
    
    // Rafraîchir la liste des conversations pour inclure la nouvelle
    fetchConversations();
    
    // Sélectionner la nouvelle conversation
    setSelectedConversation(newConversation);
    setShowUserList(false);
    setShowCreateGroup(false);
    
    // Afficher une notification de succès
    showNotification('Nouvelle conversation créée avec succès', 'success');
  };

  // Filtrer les conversations par type
  const privateConversations = conversations.filter(conv => 
    // Seulement les conversations privées (2 participants maximum et pas de type GROUP)
    conv.participants.length === 2 && conv.type !== 'GROUP'
  );
  
  const groupConversations = conversations.filter(conv => 
    // Seulement les conversations de groupe (plus de 2 participants OU type GROUP)
    conv.participants.length > 2 || conv.type === 'GROUP'
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedConversation(null); // Réinitialiser la conversation sélectionnée
    setShowUserList(false);
  };

  // Gestion des notifications
  const handleMarkNotificationAsRead = (notificationId) => {
    notificationService.markAsRead(notificationId);
  };

  const handleOpenChatFromNotification = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      setActiveTab(conversation.type === 'GROUP' ? 'group' : 'private');
    }
  };

  const handleDismissNotification = (notificationId) => {
    notificationService.dismissNotification(notificationId);
  };

  const handleBackToConversations = () => {
    setShowUserList(false);
    setSelectedConversation(null);
  };

  if (loading && conversations.length === 0) {
    return (
      <ChatContainerWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <div>Chargement des conversations...</div>
        </div>
      </ChatContainerWrapper>
    );
  }

  if (error) {
    return (
      <ChatContainerWrapper>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '100%',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            color: '#e74c3c', 
            fontSize: '18px', 
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            Erreur de connexion au chat
          </div>
          <div style={{ 
            color: '#7f8c8d', 
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
          
          {/* Affichage des informations d'authentification */}
          <div style={{ 
            fontSize: '12px', 
            color: '#95a5a6',
            maxWidth: '500px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>🔍 Diagnostic d'authentification :</p>
            <div style={{ textAlign: 'left' }}>
              <p><strong>Token :</strong> {localStorage.getItem('jwtToken') || localStorage.getItem('token') || localStorage.getItem('accessToken') ? '✅ Présent' : '❌ Manquant'}</p>
              <p><strong>ID utilisateur :</strong> {localStorage.getItem('id') || '❌ Manquant'}</p>
              <p><strong>Rôle :</strong> {localStorage.getItem('role') || '❌ Manquant'}</p>
              <p><strong>Rôles autorisés :</strong> ADMIN, MEDECIN, SECRETAIRE</p>
            </div>
          </div>
          
          <div style={{ 
            fontSize: '12px', 
            color: '#95a5a6',
            maxWidth: '400px'
          }}>
            <p>Vérifiez que :</p>
            <ul style={{ textAlign: 'left', margin: '10px 0' }}>
              <li>Vous êtes bien connecté à l'application</li>
              <li>Votre compte a un rôle autorisé (ADMIN, MEDECIN, SECRETAIRE)</li>
              <li>Le serveur backend est démarré sur le port 2025</li>
              <li>Votre session n'a pas expiré</li>
            </ul>
          </div>
          <ActionButton 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px' }}
          >
            Réessayer
          </ActionButton>
        </div>
      </ChatContainerWrapper>
    );
  }

  return (
    <ChatContainerWrapper>
      <SousDiv1Style>
        <Barrehorizontal1 
          titrepage="Chat" 
          imgprofil1={imgprofil} 
          nomprofil={currentUser?.nom || 'Utilisateur'}
          notificationCount={unreadCount}
          userRole={currentUser?.role}
        >
          <span>Messagerie</span>
        </Barrehorizontal1>
      </SousDiv1Style>

      <SousDiv2Style>
        <ChatContent>
          <Sidebar>
            <Header>
              <HeaderTitle>
                Messages
              </HeaderTitle>
              <HeaderActions>
                <ActionButton onClick={handleNewConversation}>
                  <span className="plus-icon">+</span>
                  <span>Nouveau</span>
                </ActionButton>
                <ActionButton onClick={handleCreateGroup}>
                  <span className="plus-icon">+</span>
                  <span>Groupe</span>
                </ActionButton>
              </HeaderActions>
            </Header>
            
            <ChatTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              privateCount={privateConversations.length}
              groupCount={groupConversations.length}
            />
            
            <TabContent>
              {showUserList ? (
                <UserList 
                  onUserSelect={handleConversationCreated}
                  onBack={handleBackToConversations}
                  currentUserId={currentUser?.id}
                />
              ) : (
                <ConversationList
                  conversations={activeTab === 'private' ? privateConversations : groupConversations}
                  selectedConversation={selectedConversation}
                  onConversationSelect={handleConversationSelect}
                  onRefresh={fetchConversations}
                  currentUserId={currentUser?.id}
                />
              )}
            </TabContent>
          </Sidebar>

          <MainContent>
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                currentUser={currentUser}
                onConversationUpdate={fetchConversations}
              />
            ) : (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                color: '#666',
                fontSize: '18px'
              }}>
                Sélectionnez une conversation pour commencer
              </div>
            )}
          </MainContent>
        </ChatContent>

        {showCreateGroup && (
          <CreateGroupModal
            onClose={() => setShowCreateGroup(false)}
            onGroupCreated={handleConversationCreated}
            currentUserId={currentUser?.id}
          />
        )}
      </SousDiv2Style>

      <MessageNotification
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onOpenChat={handleOpenChatFromNotification}
        onDismiss={handleDismissNotification}
      />
    </ChatContainerWrapper>
  );
};

export default ChatContainer;
