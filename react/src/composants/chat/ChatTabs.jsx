import React from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  background: white;
  border-radius: 0 !important;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid #e5e7eb;
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

const Tab = styled.button`
  flex: 1;
  padding: 12px 20px;
  background: ${props => props.active ? '#f8f9fa' : '#f8f9fa'};
  color: ${props => props.active ? '#1e40af' : '#666'};
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-bottom: 2px solid ${props => props.active ? '#1e40af' : 'transparent'};
  
  &:hover {
    background: #f1f3f4;
    color: ${props => props.active ? '#1e3a8a' : '#374151'};
    transform: none;
  }
  
  &:focus {
    outline: none;
    background: #f1f3f4;
    color: ${props => props.active ? '#1e3a8a' : '#374151'};
    box-shadow: inset 0 0 0 2px rgba(30, 64, 175, 0.1);
  }
  
  &:active {
    background: #e5e7eb;
    transform: none;
  }
  
  &:first-child {
    border-radius: 0 !important;
  }
  
  &:last-child {
    border-radius: 0 !important;
  }
  
  .tab-icon {
    font-size: 14px;
    opacity: 0.8;
  }
  
  .tab-count {
    background: ${props => props.active ? '#1e40af' : '#d1d5db'};
    color: ${props => props.active ? 'white' : '#6b7280'};
    padding: 2px 6px;
    border-radius: 0 !important;
    font-size: 11px;
    font-weight: 500;
    min-width: 18px;
    text-align: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
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
  }
`;

const SlideIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: ${props => props.activeTab === 'private' ? '0%' : '50%'};
  width: 50%;
  height: 2px;
  background: #1e40af;
  transition: left 0.2s ease;
  border-radius: 0 !important;
  box-shadow: 0 1px 2px rgba(30, 64, 175, 0.3);
  
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

const ChatTabs = ({ activeTab, onTabChange, privateCount = 0, groupCount = 0 }) => {
  return (
    <TabsContainer>
      <Tab 
        active={activeTab === 'private'} 
        onClick={() => onTabChange('private')}
      >
        <span className="tab-icon">💬</span>
        <span>Mes messages</span>
        {privateCount > 0 && (
          <span className="tab-count">{privateCount}</span>
        )}
      </Tab>
      
      <Tab 
        active={activeTab === 'group'} 
        onClick={() => onTabChange('group')}
      >
        <span className="tab-icon">👥</span>
        <span>Mes groupes</span>
        {groupCount > 0 && (
          <span className="tab-count">{groupCount}</span>
        )}
      </Tab>
      
      <SlideIndicator activeTab={activeTab} />
    </TabsContainer>
  );
};

export default ChatTabs;
