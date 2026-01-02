import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.button`
  background: ${props => props.$isDark ? 'var(--neutral-800)' : 'var(--neutral-100)'};
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-full);
  width: 60px;
  height: 32px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);

  &:hover {
    border-color: var(--primary-400);
    box-shadow: var(--shadow-md);
  }
`;

const ToggleCircle = styled.div`
  width: 24px;
  height: 24px;
  background: ${props => props.$isDark ? 'var(--primary-400)' : 'var(--warning-500)'};
  border-radius: var(--radius-full);
  position: absolute;
  left: ${props => props.$isDark ? '30px' : '4px'};
  transition: var(--transition-bounce);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = !isDark ? 'dark' : 'light';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);

        if (window.showNotification) {
            window.showNotification(`Mode ${nextTheme === 'dark' ? 'sombre' : 'clair'} activé`, 'info');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>
                {isDark ? 'Sombre' : 'Clair'}
            </span>
            <ToggleContainer onClick={toggleTheme} $isDark={isDark} title="Changer le thème">
                <ToggleCircle $isDark={isDark}>
                    {isDark ? '🌙' : '☀️'}
                </ToggleCircle>
            </ToggleContainer>
        </div>
    );
};

export default ThemeToggle;
