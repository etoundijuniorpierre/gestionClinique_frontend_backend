import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axiosInstance from '../config/axiosConfig';
import NavigationArrows from './NavigationArrows';

const ConversationListContainer = styled.div`
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

const ConversationItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background-color: #f8fafc;
    transform: translateX(2px);
  }

  ${props => props.selected && `
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-left: 4px solid #1e40af;
    box-shadow: 0 2px 8px rgba(30, 64, 175, 0.1);
  `}
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AvatarPhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConversationMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
`;

const Time = styled.div`
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
`;

const UnreadBadge = styled.div`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #7f8c8d;
  text-align: center;
  padding: 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const formatTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diffInHours < 48) {
    return 'Hier';
  } else {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }
};

const getConversationName = (conversation, currentUserId) => {
  if (conversation.typeConversation === 'GROUP') {
    return conversation.titre || conversation.groupe?.nom || 'Groupe';
  }
  
  // Pour les conversations directes, afficher le nom complet de l'autre participant
  if (conversation.participants) {
    const otherParticipant = conversation.participants.find(
      p => p.id !== currentUserId
    );
    
    if (otherParticipant) {
      const nom = otherParticipant.nom || '';
      const prenom = otherParticipant.prenom || '';
      
      if (nom && prenom) {
        return `${prenom} ${nom}`.trim();
      } else if (nom) {
        return nom;
      } else if (prenom) {
        return prenom;
      }
    }
  }
  
  // Debug: afficher la structure de la conversation
  console.log('🔍 Structure de la conversation pour le nom:', {
    conversationId: conversation.id,
    type: conversation.typeConversation,
    participants: conversation.participants,
    currentUserId
  });
  
  return 'Utilisateur';
};

const getConversationAvatar = (conversation, currentUserId) => {
  if (conversation.typeConversation === 'GROUP') {
    return {
      text: (conversation.titre || conversation.groupe?.nom || 'G').charAt(0).toUpperCase(),
      color: '#e74c3c'
    };
  }
  
  // Pour les conversations directes
  if (conversation.participants) {
    const otherParticipant = conversation.participants.find(
      p => p.id !== currentUserId
    );
    
    if (otherParticipant) {
      const nom = otherParticipant.nom || '';
      const prenom = otherParticipant.prenom || '';
      
      if (nom && prenom) {
        return {
          text: prenom.charAt(0).toUpperCase(),
          color: '#3498db'
        };
      } else if (nom) {
        return {
          text: nom.charAt(0).toUpperCase(),
          color: '#3498db'
        };
      } else if (prenom) {
        return {
          text: prenom.charAt(0).toUpperCase(),
          color: '#3498db'
        };
      }
    }
  }
  
  return {
    text: 'U',
    color: '#9ca3af'
  };
};

const ConversationAvatarWithPhoto = ({ conversation, currentUserId, size = 40 }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    const loadUserPhoto = async () => {
      // Pour les groupes, pas de photo individuelle
      if (conversation.typeConversation === 'GROUP') {
        return;
      }

      // Pour les conversations directes, récupérer la photo de l'autre participant
      if (conversation.participants) {
        const otherParticipant = conversation.participants.find(
          p => p.id !== currentUserId
        );
        
        if (!otherParticipant?.id) {
          console.log('❌ Participant non trouvé pour la conversation:', conversation.id);
          return;
        }

        console.log('🔍 Chargement photo pour utilisateur:', {
          userId: otherParticipant.id,
          nom: otherParticipant.nom,
          prenom: otherParticipant.prenom
        });

        try {
          const response = await axiosInstance.get(`/utilisateurs/${otherParticipant.id}/photo`, {
            responseType: 'blob'
          });

          if (response.status === 200) {
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            setPhotoUrl(url);
            console.log('✅ Photo chargée pour utilisateur:', otherParticipant.id);
          } else {
            console.log('❌ Erreur HTTP pour la photo:', response.status);
            setPhotoError(true);
          }
        } catch (error) {
          console.log('❌ Erreur lors du chargement de la photo:', error);
          setPhotoError(true);
        }
      }
    };

    loadUserPhoto();

    // Cleanup function pour libérer l'URL
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [conversation.id, conversation.participants, conversation.typeConversation, currentUserId]);

  if (conversation.typeConversation === 'GROUP') {
    // Pour les groupes, toujours afficher l'avatar avec initiale
    const avatar = getConversationAvatar(conversation, currentUserId);
    return (
      <Avatar color={avatar.color} size={size}>
        {avatar.text}
      </Avatar>
    );
  }

  if (photoUrl && !photoError) {
    return (
      <AvatarPhoto 
        src={photoUrl} 
        alt={`Photo de ${getConversationName(conversation, currentUserId)}`}
        size={size}
      />
    );
  }

  // Fallback vers l'avatar avec initiale
  const avatar = getConversationAvatar(conversation, currentUserId);
  return (
    <Avatar color={avatar.color} size={size}>
      {avatar.text}
    </Avatar>
  );
};

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onConversationSelect, 
  onRefresh,
  currentUserId 
}) => {
  const containerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const handleConversationClick = (conversation) => {
    onConversationSelect(conversation);
  };

  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
    }
  };

  const scrollUp = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [conversations]);

  if (!conversations || conversations.length === 0) {
    return (
      <ConversationListContainer>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <div>Aucune conversation</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Commencez une nouvelle conversation
          </div>
        </EmptyState>
      </ConversationListContainer>
    );
  }

  return (
    <ConversationListContainer ref={containerRef}>
      <NavigationArrows
        onScrollUp={scrollUp}
        onScrollDown={scrollDown}
        canScrollUp={canScrollUp}
        canScrollDown={canScrollDown}
        showOnHover={true}
      />
      {conversations.map((conversation) => {
        const isSelected = selectedConversation?.id === conversation.id;
        const conversationName = getConversationName(conversation, currentUserId);
        const avatar = getConversationAvatar(conversation, currentUserId);
        const unreadCount = conversation.unreadCount || 0;
        
        return (
          <ConversationItem
            key={conversation.id}
            selected={isSelected}
            onClick={() => handleConversationClick(conversation)}
          >
            <ConversationAvatarWithPhoto conversation={conversation} currentUserId={currentUserId} />
            
            <ConversationInfo>
              <ConversationName>
                {conversationName}
              </ConversationName>
              <LastMessage>
                {conversation.lastMessagePreview || 'Aucun message'}
              </LastMessage>
            </ConversationInfo>
            
            <ConversationMeta>
              <Time>
                {formatTime(conversation.lastMessageAt)}
              </Time>
              {unreadCount > 0 && (
                <UnreadBadge>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </UnreadBadge>
              )}
            </ConversationMeta>
          </ConversationItem>
        );
      })}
    </ConversationListContainer>
  );
};

export default ConversationList;
