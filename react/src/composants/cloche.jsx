import Styled from 'styled-components'
import cloche from '../assets/Bell.png'

const ClocheContainer = Styled.div`
    position: relative;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: scale(1.1);
    }
`;

const ImgprofilStyle = Styled.img`
    width: 40px;
    height: 40px;
    border-radius: 0 !important;
`;

const NotificationBadge = Styled.div`
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border-radius: 12px;
    min-width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 3px 8px rgba(239, 68, 68, 0.4);
    border: 2px solid white;
    animation: ${props => props.count > 0 ? 'notificationPulse 2s infinite' : 'none'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    @keyframes notificationPulse {
        0% { 
            transform: scale(1);
            box-shadow: 0 3px 8px rgba(239, 68, 68, 0.4);
        }
        50% { 
            transform: scale(1.15);
            box-shadow: 0 5px 15px rgba(239, 68, 68, 0.6);
        }
        100% { 
            transform: scale(1);
            box-shadow: 0 3px 8px rgba(239, 68, 68, 0.4);
        }
    }
    
    /* Animation d'entrée */
    animation: ${props => props.count > 0 ? 'badgeAppear 0.3s ease-out, notificationPulse 2s infinite 0.3s' : 'none'};
    
    @keyframes badgeAppear {
        0% { 
            transform: scale(0);
            opacity: 0;
        }
        100% { 
            transform: scale(1);
            opacity: 1;
        }
    }
    
    /* Hover effect */
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
    }
`;


function Cloche({ notificationCount = 0 }){
    return(
        <ClocheContainer>
            <ImgprofilStyle src={cloche} alt="Notifications" />
            {notificationCount > 0 && (
                <NotificationBadge count={notificationCount}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                </NotificationBadge>
            )}
        </ClocheContainer>
    )
}

export default Cloche
