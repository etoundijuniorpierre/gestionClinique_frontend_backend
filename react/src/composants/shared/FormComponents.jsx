import styled from 'styled-components';

/**
 * Composant Label avec indicateur de champ obligatoire
 * Utilisation : <FormLabel required>Nom</FormLabel>
 */
const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: #ff4141;
      font-weight: bold;
    }
  `}
`;

export const FormLabel = ({ children, required, htmlFor, ...props }) => {
  return (
    <StyledLabel htmlFor={htmlFor} required={required} {...props}>
      {children}
    </StyledLabel>
  );
};

/**
 * Composant Input avec indication visuelle pour les champs obligatoires
 */
const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.required && !props.value ? '#ffcccc' : '#ddd'};
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4141ff;
  }
  
  &.error {
    border-color: #ff4141;
  }
`;

export const FormInput = ({ required, ...props }) => {
  return <StyledInput required={required} {...props} />;
};

/**
 * Composant Select avec indication visuelle pour les champs obligatoires
 */
const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.required && !props.value ? '#ffcccc' : '#ddd'};
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4141ff;
  }
  
  &.error {
    border-color: #ff4141;
  }
`;

export const FormSelect = ({ required, ...props }) => {
  return <StyledSelect required={required} {...props} />;
};

/**
 * Composant Textarea avec indication visuelle pour les champs obligatoires
 */
const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.required && !props.value ? '#ffcccc' : '#ddd'};
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #4141ff;
  }
  
  &.error {
    border-color: #ff4141;
  }
`;

export const FormTextarea = ({ required, ...props }) => {
  return <StyledTextarea required={required} {...props} />;
};

export default {
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea
};
