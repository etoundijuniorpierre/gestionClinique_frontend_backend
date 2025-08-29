import React from 'react';
import styled from 'styled-components';

const NavigationContainer = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ArrowButton = styled.button`
  width: 24px;
  height: 24px;
  background: rgba(30, 64, 175, 0.9);
  color: white;
  border: none;
  border-radius: 0 !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(30, 64, 175, 1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    background: rgba(156, 163, 175, 0.5);
    cursor: not-allowed;
    transform: none;
  }
  
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

const NavigationArrows = ({ 
  onScrollUp, 
  onScrollDown, 
  canScrollUp = false, 
  canScrollDown = false,
  showOnHover = true 
}) => {
  return (
    <NavigationContainer style={{ opacity: showOnHover ? 0 : 1 }}>
      <ArrowButton 
        onClick={onScrollUp} 
        disabled={!canScrollUp}
        title="Monter"
      >
        ↑
      </ArrowButton>
      <ArrowButton 
        onClick={onScrollDown} 
        disabled={!canScrollDown}
        title="Descendre"
      >
        ↓
      </ArrowButton>
    </NavigationContainer>
  );
};

export default NavigationArrows;
