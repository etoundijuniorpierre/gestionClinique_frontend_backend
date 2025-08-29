import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useMessages, conversationService, addMessageListener } from '../../services/messagerieService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import NavigationArrows from './NavigationArrows';

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

const ChatWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative;
  
  /* Masquer toutes les scrollbars */
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  
  &::-webkit-scrollbar-track {
    display: none !important;
  }
  
  &::-webkit-scrollbar-thumb {
    display: none !important;
  }
  
  &::-webkit-scrollbar-corner {
    display: none !important;
  }
  
  /* Firefox */
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
`;

const InputContainer = styled.div`
  border-top: 1px solid #e0e0e0;
  padding: 20px;
  background: white;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const DisplayRefreshIndicator = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(59, 130, 246, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 400;
  z-index: 1;
  opacity: ${props => props.isRefreshing ? 0.8 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
  user-select: none;
  
  &::before {
    content: '🔄';
    margin-right: 2px;
    animation: ${props => props.isRefreshing ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #e74c3c;
  background: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  margin: 20px;
`;

const ChatWindow = ({ conversation, currentUser, onConversationUpdate }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDisplayRefreshing, setIsDisplayRefreshing] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const { showNotification } = useNotification();
  
  const {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    updateMessage,
    deleteMessage
  } = useMessages(conversation.id);

  useEffect(() => {
    if (conversation.id) {
      setCurrentPage(0);
      setHasMoreMessages(true);
      fetchMessages(0, false); // Chargement initial, pas d'actualisation d'affichage
      
      // Marquer la conversation comme lue
      markConversationAsRead();
    }
  }, [conversation.id]);

  // Effet pour écouter les messages WebSocket en temps réel
  useEffect(() => {
    if (!conversation.id) return;

    console.log('🎧 Ajout de l\'écouteur de messages pour la conversation:', conversation.id);
    
    const handleRealTimeMessage = (message, action) => {
      console.log('📨 Message temps réel reçu pour la conversation:', conversation.id, action, message);
      
      if (action === 'ADD') {
        // Vérifier si le message existe déjà pour éviter les doublons
        const messageExists = messages.some(msg => msg.id === message.id);
        if (!messageExists) {
          console.log('➕ Ajout du nouveau message à la conversation (pas de doublon)');
          fetchMessages(0, true); // Actualisation d'affichage pour inclure le nouveau
        } else {
          console.log('⚠️ Message déjà présent, pas de mise à jour nécessaire');
        }
      } else if (action === 'UPDATE') {
        // Mettre à jour le message existant
        console.log('✏️ Mise à jour du message');
        fetchMessages(0, true); // Actualisation d'affichage pour refléter les changements
      } else if (action === 'DELETE') {
        // Supprimer le message
        console.log('🗑️ Suppression du message');
        fetchMessages(0, true); // Actualisation d'affichage pour refléter la suppression
      }
    };

    // S'abonner aux messages de cette conversation
    const unsubscribe = addMessageListener(conversation.id, handleRealTimeMessage);

    // Nettoyer l'abonnement quand le composant se démonte ou change de conversation
    return () => {
      console.log('🎧 Suppression de l\'écouteur de messages pour la conversation:', conversation.id);
      unsubscribe();
    };
  }, [conversation.id, fetchMessages, messages]);

  // Effet pour actualiser uniquement l'affichage des messages toutes les 1 seconde
  useEffect(() => {
    if (!conversation.id) return;

    console.log('🔄 Démarrage de l\'actualisation d\'affichage (1s) pour la conversation:', conversation.id);
    
    const displayRefreshInterval = setInterval(() => {
      // Vérifier si la conversation est visible et active
      const isConversationActive = !document.hidden && 
        document.hasFocus() && 
        !isLoadingMore &&
        !isDisplayRefreshing; // Éviter les actualisations simultanées
      
      // Vérifier si l'utilisateur est en train de saisir
      const isUserTyping = document.activeElement && 
        (document.activeElement.tagName === 'TEXTAREA' || 
         document.activeElement.tagName === 'INPUT' ||
         document.activeElement.contentEditable === 'true');
      
      if (isConversationActive && !isUserTyping) {
        setIsDisplayRefreshing(true);
        
        // Actualiser uniquement l'affichage sans impacter la saisie
        fetchMessages(0, true).then(() => {
          setIsDisplayRefreshing(false);
        }).catch(() => {
          setIsDisplayRefreshing(false);
        });
        
        console.log('🔄 Actualisation d\'affichage (1s) pour la conversation:', conversation.id);
      } else if (isUserTyping) {
        console.log('⏸️ Actualisation d\'affichage mise en pause (utilisateur en train de saisir)');
      } else {
        console.log('⏸️ Actualisation d\'affichage mise en pause (conversation inactive)');
      }
    }, 1000); // 1 seconde

    // Nettoyer l'intervalle
    return () => {
      clearInterval(displayRefreshInterval);
      console.log('🧹 Intervalle d\'actualisation d\'affichage nettoyé');
    };
  }, [conversation.id, fetchMessages, isLoadingMore, isDisplayRefreshing]);

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const markConversationAsRead = async () => {
    try {
      await conversationService.markConversationAsRead(conversation.id);
      // Rafraîchir la liste des conversations pour mettre à jour les compteurs
      if (onConversationUpdate) {
        onConversationUpdate();
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    try {
      await sendMessage(content);
      // Marquer comme lu après envoi
      markConversationAsRead();
    } catch (error) {
      showNotification('Erreur lors de l\'envoi du message', 'error');
    }
  };

  const handleUpdateMessage = async (messageId, newContent) => {
    try {
      await updateMessage(messageId, newContent);
      showNotification('Message modifié avec succès', 'success');
    } catch (error) {
      showNotification('Erreur lors de la modification du message', 'error');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      showNotification('Message supprimé avec succès', 'success');
    } catch (error) {
      showNotification('Erreur lors de la suppression du message', 'error');
    }
  };

  const handleLoadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await fetchMessages(nextPage);
      
      // Vérifier s'il y a plus de messages
      if (result && result.content && result.content.length > 0) {
        setCurrentPage(nextPage);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      showNotification('Erreur lors du chargement des messages', 'error');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const canEditMessage = (message) => {
    return message.expediteur?.id === currentUser?.id;
  };

  const canDeleteMessage = (message) => {
    return message.expediteur?.id === currentUser?.id;
  };

  const checkScrollPosition = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
    }
  };

  const scrollUp = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      
      // Positionner la scrollbar en bas par défaut
      container.scrollTop = container.scrollHeight;
      
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [messages]);

  // Effet pour maintenir la scrollbar en bas quand de nouveaux messages arrivent
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && messages.length > 0) {
      // Attendre un peu pour que le DOM soit mis à jour
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  }, [messages.length]);

  if (error) {
    return (
      <ChatWindowContainer>
        <ChatHeader conversation={conversation} currentUser={currentUser} />
        <ErrorMessage>
          Erreur lors du chargement des messages: {error}
        </ErrorMessage>
      </ChatWindowContainer>
    );
  }

  return (
    <ChatWindowContainer>
      <ChatHeader conversation={conversation} currentUser={currentUser} />
      
      <MessagesContainer ref={messagesContainerRef}>
        <DisplayRefreshIndicator isRefreshing={isDisplayRefreshing}>
          Actualisation...
        </DisplayRefreshIndicator>
        
        <NavigationArrows
          onScrollUp={scrollUp}
          onScrollDown={scrollDown}
          canScrollUp={canScrollUp}
          canScrollDown={canScrollDown}
          showOnHover={true}
        />
        {loading && messages.length === 0 && (
          <LoadingOverlay>
            <div>Chargement des messages...</div>
          </LoadingOverlay>
        )}
        
        <MessageList
          messages={messages}
          currentUser={currentUser}
          onLoadMore={handleLoadMoreMessages}
          hasMore={hasMoreMessages}
          isLoadingMore={isLoadingMore}
          canEdit={canEditMessage}
          canDelete={canDeleteMessage}
          onUpdateMessage={handleUpdateMessage}
          onDeleteMessage={handleDeleteMessage}
        />
        
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={loading}
          placeholder="Tapez votre message..."
        />
      </InputContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
