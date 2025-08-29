import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #adb5bd;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadMoreButton = ({ onClick, loading = false }) => {
  return (
    <Button onClick={onClick} disabled={loading}>
      {loading ? (
        <>
          <Spinner />
          Chargement...
        </>
      ) : (
        <>
          ↕️
          Charger plus de messages
        </>
      )}
    </Button>
  );
};

export default LoadMoreButton;
