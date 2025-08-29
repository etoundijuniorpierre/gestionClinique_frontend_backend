import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../config/axiosConfig';

const HeaderContainer = styled.div`
  height: 60px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #1e3a8a;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
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
  font-size: 16px;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AvatarPhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationName = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
`;

const ConversationMeta = styled.div`
  font-size: 12px;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.9);
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.online ? '#10b981' : '#9ca3af'};
  margin-left: 8px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const GroupInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
`;

const MemberCount = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

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

const getConversationMeta = (conversation, currentUserId) => {
  if (conversation.typeConversation === 'GROUP') {
    const memberCount = conversation.participants?.length || 0;
    return `${memberCount} membre${memberCount > 1 ? 's' : ''}`;
  }
  
  // Pour les conversations directes
  if (conversation.participants) {
    const otherParticipant = conversation.participants.find(
      p => p.id !== currentUserId
    );
    
    if (otherParticipant) {
      const role = otherParticipant.role?.roleType || otherParticipant.role || 'Utilisateur';
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }
  }
  
  return 'Utilisateur';
};

const isUserOnline = (conversation, currentUserId) => {
  if (conversation.typeConversation === 'GROUP') {
    return false; // Pas d'indicateur en ligne pour les groupes
  }
  
  // Pour les conversations directes
  if (conversation.participants) {
    const otherParticipant = conversation.participants.find(
      p => p.id !== currentUserId
    );
    
    // Vérifier le statut de connexion de l'utilisateur
    if (otherParticipant) {
      return otherParticipant.statusConnect === 'CONNECTE';
    }
  }
  
  return false;
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
          return;
        }

        try {
          const response = await axiosInstance.get(`/utilisateurs/${otherParticipant.id}/photo`, {
            responseType: 'blob'
          });

          if (response.status === 200) {
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            setPhotoUrl(url);
          } else {
            setPhotoError(true);
          }
        } catch (error) {
          console.log('Photo non disponible pour l\'utilisateur:', otherParticipant.id, error);
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

const ChatHeader = ({ conversation, currentUser }) => {
  const conversationName = getConversationName(conversation, currentUser?.id);
  const meta = getConversationMeta(conversation, currentUser?.id);
  const isOnline = isUserOnline(conversation, currentUser?.id);
  const isGroup = conversation.typeConversation === 'GROUP';

  return (
    <HeaderContainer>
      <ConversationAvatarWithPhoto conversation={conversation} currentUserId={currentUser?.id} />
      
      <ConversationInfo>
        <ConversationName>
          {conversationName}
        </ConversationName>
        <ConversationMeta>
          {isGroup ? (
            <GroupInfo>
              <span>Groupe</span>
              <MemberCount>
                {conversation.participants?.length || 0}
              </MemberCount>
            </GroupInfo>
          ) : (
            meta
          )}
        </ConversationMeta>
      </ConversationInfo>
      
      {!isGroup && (
        <StatusIndicator online={isOnline} />
      )}
    </HeaderContainer>
  );
};

export default ChatHeader;
