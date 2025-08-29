import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.4;
  
  &:focus {
    border-color: #3498db;
  }
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #95a5a6;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #3498db;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  
  &:hover:not(:disabled) {
    background: #2980b9;
    transform: scale(1.05);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SendIcon = styled.span`
  font-size: 16px;
  transform: rotate(-45deg);
`;

const MessageInput = ({ onSendMessage, disabled = false, placeholder = "Tapez votre message..." }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px';
      }
    }
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      // Ici vous pourriez envoyer un événement "typing" via WebSocket
    }
  };

  const handleTypingStop = () => {
    if (isTyping) {
      setIsTyping(false);
      // Ici vous pourriez envoyer un événement "stop typing" via WebSocket
    }
  };

  const isSendDisabled = !message.trim() || disabled;

  return (
    <InputContainer>
      <TextArea
        ref={textareaRef}
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleTypingStart}
        onBlur={handleTypingStop}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
      />
      
      <SendButton
        onClick={handleSend}
        disabled={isSendDisabled}
        title="Envoyer (Entrée)"
      >
        <SendIcon>➤</SendIcon>
      </SendButton>
    </InputContainer>
  );
};

export default MessageInput;
