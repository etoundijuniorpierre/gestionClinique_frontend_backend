import Styled from 'styled-components'
import '../styles/buttons.css'

const BouttonStyle = Styled.button`
  height: 56px;
  border-radius: 28px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;

  &::before {
    message: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 0 20px rgba(30, 64, 175, 0.3);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  }

  &:focus {
    outline: none;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(30, 64, 175, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
`

function Boutton({ nomboutton, onClick, variant = "primary", size = "normal", disabled = false, loading = false, className = "" }){
    const getButtonClasses = () => {
        let classes = `modern-button-${variant}`;
        
        if (size !== "normal") {
            classes += ` modern-button-${size}`;
        }
        
        if (loading) {
            classes += " modern-button-loading";
        }
        
        if (className) {
            classes += ` ${className}`;
        }
        
        return classes;
    };

    return(
        <>
        <BouttonStyle 
            onClick={onClick} 
            disabled={disabled || loading}
            className={getButtonClasses()}
        >
            {loading ? (
                <>
                    <div className="spinner"></div>
                    Chargement...
                </>
            ) : (
                nomboutton
            )}
        </BouttonStyle>
        </>
    )
}

export default Boutton
