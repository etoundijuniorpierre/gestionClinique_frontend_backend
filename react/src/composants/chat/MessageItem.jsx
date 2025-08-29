import React, { useState } from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  position: relative;
  
  ${props => props.isOwnMessage && `
    justify-content: flex-end;
  `}
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
  
  ${props => props.isOwnMessage ? `
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  ` : `
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    color: #1f2937;
    border-bottom-left-radius: 4px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  `}
`;

const MessageContent = styled.div`
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.7;
`;

const MessageTime = styled.span`
  ${props => props.isOwnMessage ? `
    color: rgba(255, 255, 255, 0.8);
  ` : `
    color: #7f8c8d;
  `}
`;

const MessageStatus = styled.span`
  margin-left: 8px;
  ${props => props.isOwnMessage ? `
    color: rgba(255, 255, 255, 0.8);
  ` : `
    color: #7f8c8d;
  `}
`;

const MessageActions = styled.div`
  position: absolute;
  top: 100%;
  right: ${props => props.isOwnMessage ? '0' : 'auto'};
  left: ${props => props.isOwnMessage ? 'auto' : '0'};
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 4px;
  padding: 4px;
  opacity: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  margin-top: 4px;
  
  ${MessageContainer}:hover & {
    opacity: 1;
    transform: translateY(-2px);
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #6b7280;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: #f3f4f6;
    color: #1f2937;
    transform: scale(1.05);
  }
  
  &.delete:hover {
    background: #fef2f2;
    color: #ef4444;
  }
`;

const EditInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  
  &:focus {
    border-color: #3498db;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
`;

const EditButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
  
  &.save {
    background: #27ae60;
    color: white;
    
    &:hover {
      background: #229954;
    }
  }
  
  &.cancel {
    background: #95a5a6;
    color: white;
    
    &:hover {
      background: #7f8c8d;
    }
  }
`;

const formatTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const getMessageStatus = (message) => {
  if (message.lu) {
    return '✓✓'; // Message lu
  } else {
    return '✓'; // Message envoyé
  }
};

const MessageItem = ({
  message,
  currentUser,
  isEditing,
  canEdit,
  canDelete,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete
}) => {
  const [editContent, setEditContent] = useState(message.contenu);
  const isOwnMessage = message.expediteur?.id === currentUser?.id;

  const handleEdit = () => {
    setEditContent(message.contenu);
    onEdit(message.id);
  };

  const handleSave = () => {
    if (editContent.trim() && editContent !== message.contenu) {
      onSaveEdit(message.id, editContent);
    } else {
      onCancelEdit();
    }
  };

  const handleCancel = () => {
    setEditContent(message.contenu);
    onCancelEdit();
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      onDelete(message.id);
    }
  };

  if (isEditing) {
    return (
      <MessageContainer isOwnMessage={isOwnMessage}>
        <div style={{ maxWidth: '70%', width: '100%' }}>
          <EditInput
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Modifier le message..."
            autoFocus
          />
          <EditActions>
            <EditButton className="cancel" onClick={handleCancel}>
              Annuler
            </EditButton>
            <EditButton className="save" onClick={handleSave}>
              Enregistrer
            </EditButton>
          </EditActions>
        </div>
      </MessageContainer>
    );
  }

  return (
    <MessageContainer isOwnMessage={isOwnMessage}>
      <MessageBubble isOwnMessage={isOwnMessage}>
        <MessageContent>
          {message.contenu}
        </MessageContent>
        
        <MessageMeta>
          <MessageTime isOwnMessage={isOwnMessage}>
            {formatTime(message.creationDate || message.createdAt)}
          </MessageTime>
          
          {isOwnMessage && (
            <MessageStatus isOwnMessage={isOwnMessage}>
              {getMessageStatus(message)}
            </MessageStatus>
          )}
        </MessageMeta>
      </MessageBubble>
      
      {(canEdit || canDelete) && (
        <MessageActions isOwnMessage={isOwnMessage}>
          {canEdit && (
            <ActionButton onClick={handleEdit}>
              ✏️
            </ActionButton>
          )}
          {canDelete && (
            <ActionButton className="delete" onClick={handleDelete}>
              🗑️
            </ActionButton>
          )}
        </MessageActions>
      )}
    </MessageContainer>
  );
};

export default MessageItem;
