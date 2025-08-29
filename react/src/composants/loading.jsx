import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingSpinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid #f3f3f3;
  border-top: 3px solid ${props => props.color || '#3498db'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color || '#3498db'};
  animation: ${pulse} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay || '0s'};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.padding || '20px'};
  min-height: ${props => props.minHeight || '200px'};
`;

const LoadingText = styled.p`
  margin-top: 12px;
  color: #666;
  font-size: 14px;
  text-align: center;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
`;

export const Spinner = ({ size, color, text }) => (
  <LoadingContainer>
    <LoadingSpinner size={size} color={color} />
    {text && <LoadingText>{text}</LoadingText>}
  </LoadingContainer>
);

export const Dots = ({ color, text }) => (
  <LoadingContainer>
    <LoadingDots>
      <Dot color={color} delay="0s" />
      <Dot color={color} delay="0.2s" />
      <Dot color={color} delay="0.4s" />
    </LoadingDots>
    {text && <LoadingText>{text}</LoadingText>}
  </LoadingContainer>
);

export const FullScreenLoader = ({ text = "Chargement..." }) => (
  <LoadingOverlay>
    <LoadingCard>
      <LoadingSpinner size="50px" color="#3498db" />
      <LoadingText>{text}</LoadingText>
    </LoadingCard>
  </LoadingOverlay>
);

export const InlineLoader = ({ text }) => (
  <LoadingContainer padding="10px" minHeight="auto">
    <LoadingSpinner size="20px" color="#666" />
    {text && <LoadingText>{text}</LoadingText>}
  </LoadingContainer>
);

const Loading = ({ type = 'spinner', ...props }) => {
  switch (type) {
    case 'dots':
      return <Dots {...props} />;
    case 'fullscreen':
      return <FullScreenLoader {...props} />;
    case 'inline':
      return <InlineLoader {...props} />;
    default:
      return <Spinner {...props} />;
  }
};

export default Loading; 
