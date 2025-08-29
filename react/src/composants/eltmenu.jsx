import Styled from 'styled-components'
import { useState } from 'react'

const EltmenuStyle= Styled.div`
    width: 100%;
    height: 30px;
    gap: 8px;
    padding: 20px 15px 20px 25px;
    display: flex;
    align-items: center;
    font-family: "Inter", sans-serif;
    font-weight: 300;
    font-size: 1.8em;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 2px 0;
    position: relative;
    overflow: hidden;
    color: #333333;
    
    @media (max-width: 1200px) {
        font-size: 1.6em;
        padding: 18px 12px 18px 20px;
    }
    
    @media (max-width: 768px) {
        font-size: 1.4em;
        padding: 16px 10px 16px 16px;
        height: auto;
        min-height: 30px;
    }
    
    @media (max-width: 480px) {
        font-size: 1.2em;
        padding: 14px 8px 14px 12px;
    }
    
    &:hover:not(.active){
        cursor: pointer;
        background-color: #667eea;
        color: #ffffff;
        transform: translateX(5px);
        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }
    
    &:focus{
        outline: 2px solid #667eea;
        outline-offset: 2px;
    }
    
    &.active {
        background-color: #667eea;
        color: #ffffff;
        font-weight: 500;
        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        transform: translateX(5px);
        cursor: default;
    }
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
        pointer-events: none;
    }
    
    &:hover:not(.active)::before {
        left: 100%;
    }
`

const ImgStyle = Styled.img`
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
    
    @media (max-width: 768px) {
        width: 16px;
        height: 16px;
    }
    
    @media (max-width: 480px) {
        width: 14px;
        height: 14px;
    }
    
    ${EltmenuStyle}:hover:not(.active) & {
        transform: scale(1.1);
        filter: brightness(0) invert(1);
    }
    
    ${EltmenuStyle}.active & {
        transform: scale(1.1);
        filter: brightness(0) invert(1);
    }
`

const MenuText = Styled.span`
    transition: all 0.3s ease;
    margin-left: 8px;
    
    @media (max-width: 768px) {
        margin-left: 6px;
    }
    
    @media (max-width: 480px) {
        margin-left: 4px;
    }
`

const Badge = Styled.span`
    background-color: #ff4757;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    margin-left: auto;
    min-width: 18px;
    text-align: center;
    display: ${props => props.show ? 'block' : 'none'};
`

function Eltmenu({nommenu, img, active = false, badge = null, onClick, ...props}){
    const [isPressed, setIsPressed] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick && onClick();
        }
    };

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    return(
        <EltmenuStyle 
            className={active ? 'active' : ''}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsPressed(false)}
            role="button"
            tabIndex={0}
            aria-label={nommenu}
            {...props}
        >
            {img && <ImgStyle src={img} alt="" />}
            <MenuText>{nommenu}</MenuText>
            {badge && <Badge show={badge > 0}>{badge}</Badge>}
        </EltmenuStyle>
    )
} 

export default Eltmenu
