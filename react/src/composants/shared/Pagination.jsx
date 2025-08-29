import React from 'react';
import Styled from 'styled-components';

const ButtonStyle = Styled.button`
  background-color: ${props => props.$buttonbackgroundColor || 'transparent'};
  color: ${props => props.$buttonColor || 'rgba(65, 65, 255, 1)'};
  border: 1px solid rgba(65, 65, 255, 1);
  padding: 8px 12px;
  margin: 0 2px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.$buttonbackgroundColor ? 'rgba(55, 55, 245, 1)' : 'rgba(65, 65, 255, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationContainer = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
`;

const NavigationButton = Styled.button`
  background-color: transparent;
  color: rgba(65, 65, 255, 1);
  border: 1px solid rgba(65, 65, 255, 1);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: rgba(65, 65, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumbersContainer = Styled.div`
  display: flex;
  gap: 2px;
`;

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onModification,
  itemsPerPage,
  totalItems 
}) => {
  // S'assurer que currentPage est toujours valide
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  // Générer les numéros de page à afficher
  const generatePageNumbers = () => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (validCurrentPage <= 3) {
      return [1, 2, 3, "...", totalPages - 1, totalPages];
    }
    
    if (validCurrentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, 2, "...", validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, "...", totalPages - 1, totalPages];
  };

  const pageNumbers = generatePageNumbers();

  const handlePageClick = (page) => {
    if (page !== "..." && page !== validCurrentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    const newPage = Math.max(1, validCurrentPage - 1);
    onPageChange(newPage);
    if (onModification && newPage > 2 && newPage < totalPages - 2) {
      onModification(newPage);
    }
  };

  const handleNext = () => {
    const newPage = Math.min(totalPages, validCurrentPage + 1);
    onPageChange(newPage);
    if (onModification && newPage > 2 && newPage < totalPages - 2) {
      onModification(newPage);
    }
  };

  return (
    <PaginationContainer>
      {/* Bouton Précédent */}
      <NavigationButton
        onClick={handlePrevious}
        disabled={validCurrentPage <= 1}
      >
        Précédent
      </NavigationButton>

      {/* Numéros de page - seulement s'il y a plusieurs pages */}
      {totalPages > 1 && (
        <PageNumbersContainer>
          {pageNumbers.map((page, idx) => (
            <ButtonStyle
              key={idx}
              onClick={() => handlePageClick(page)}
              $buttonbackgroundColor={page === validCurrentPage ? 'rgba(65, 65, 255, 1)' : ''}
              $buttonColor={page === validCurrentPage ? 'white' : ''}
              disabled={page === "..."}
            >
              {page}
            </ButtonStyle>
          ))}
        </PageNumbersContainer>
      )}

      {/* Bouton Suivant */}
      <NavigationButton
        onClick={handleNext}
        disabled={validCurrentPage >= totalPages}
      >
        Suivant
      </NavigationButton>
    </PaginationContainer>
  );
};

export default Pagination;
