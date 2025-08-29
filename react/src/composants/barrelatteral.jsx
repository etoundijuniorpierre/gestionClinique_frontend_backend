import Styled from 'styled-components'
import { API_BASE } from '../composants/config/apiconfig'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import logout from '../assets/arrow_back.svg'
import axiosInstance from './config/axiosConfig'
import Eltmenu from './eltmenu'

const MenuStyle = Styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: 0px;
    flex: 1;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
        width: 0px;
        background: transparent;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: transparent;
    }
    
    @media (max-width: 768px) {
        gap: 12px;
        padding: 0 16px;
    }
    
    @media (max-width: 480px) {
        gap: 8px;
        padding: 0 12px;
    }
`
const Image = Styled.img`
    width: 70%;
    
    @media (max-width: 768px) {
        width: 60%;
    }
    
    @media (max-width: 480px) {
        width: 50%;
    }
`

const Imgsvg = Styled.img`
    width: 25px;  
    height: 25px; 
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    filter: brightness(0) invert(1);
    font-weight: 900; 
`

const BarrelatteralStyle = Styled.div`
    position: relative;
    background-color: #EFEFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20vw;
    height: 100vh;
    gap: 41px;
    padding-top: 32px;
    padding-bottom: 32px;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    border-right: 1px solid #e9ecef;
    overflow: hidden;
    
    @media (max-width: 1200px) {
        width: 25vw;
        gap: 32px;
        padding-top: 24px;
        padding-bottom: 24px;
    }
    
    @media (max-width: 768px) {
        width: 100vw;
        height: auto;
        min-height: 200px;
        gap: 24px;
        padding-top: 16px;
        padding-bottom: 16px;
    }
    
    @media (max-width: 480px) {
        gap: 16px;
        padding-top: 12px;
        padding-bottom: 12px;
    }
`

const Button = Styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    position: absolute;
    bottom: 25px;
    left: 15px;
    right: 15px;
    width: calc(20vw - 30px);
    gap: 12px;
    padding: 18px;
    text-align: center;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: white;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 
        0 8px 32px rgba(102, 126, 234, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    overflow: hidden;
    
    @media (max-width: 1200px) {
        width: calc(25vw - 30px);
        padding: 16px 24px;
        font-size: 14px;
    }
    
    @media (max-width: 768px) {
        position: relative;
        width: calc(100vw - 32px);
        margin: 16px;
        bottom: auto;
        left: auto;
        right: auto;
        padding: 16px 20px;
        font-size: 14px;
    }
    
    @media (max-width: 480px) {
        width: calc(100vw - 24px);
        margin: 12px;
        padding: 12px 16px;
        font-size: 13px;
    }
    
    &::before {
        message: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
    }
    
    &:hover {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-6px) scale(1.05);
        box-shadow: 
            0 20px 40px rgba(239, 68, 68, 0.4),
            0 8px 16px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        
        &::before {
            left: 100%;
        }
        
        ${Imgsvg} {
            transform: translateX(8px) rotate(-15deg) scale(1.2);
            filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
    }
    
    &:active {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
            0 12px 24px rgba(239, 68, 68, 0.3),
            0 4px 8px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    &:focus {
        outline: none;
        box-shadow: 
            0 0 0 4px rgba(239, 68, 68, 0.2),
            0 8px 32px rgba(102, 126, 234, 0.3),
            0 2px 8px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
`

const LogoutText = Styled.p`
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: white;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
`

const LogoutContainer = Styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    z-index: 2;
    
    &::after {
        message: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.6s ease;
        z-index: 1;
    }
    
    ${Button}:hover &::after {
        width: 200px;
        height: 200px;
    }
`

const PulseEffect = Styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.6s ease;
    pointer-events: none;
    z-index: 1;
    
    ${Button}:hover & {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0;
    }
`

function Barrelatteral({ children }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn("Aucun token trouvé");
                navigate("/");
                return;
            }

            // Appel de l'endpoint /logout géré par CustomLogoutHandler
            await axiosInstance.post(`/logout`);

            // Nettoyage session locale
            localStorage.clear();
            navigate("/");

        } catch (error) {
            console.error("Erreur pendant le logout :", error);
            // Même si erreur backend, on nettoie côté frontend
            localStorage.clear();
            navigate("/");
        }
    };

    return (
        <BarrelatteralStyle>
            <Image src={logo} />
            <MenuStyle>{children}</MenuStyle>
            <Button onClick={handleLogout}>
                <PulseEffect />
                <LogoutContainer>
                    <Imgsvg src={logout} />
                    <LogoutText>Déconnexion</LogoutText>
                </LogoutContainer>
            </Button>
        </BarrelatteralStyle>
    );
}

export default Barrelatteral
