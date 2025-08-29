import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../config/axiosConfig';
import { userService, conversationService } from '../../services/messagerieService';
import { useNotification } from '../notification';

const UserListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #3498db;
  }
  
  &::placeholder {
    color: #95a5a6;
  }
`;

const UsersContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const UserItem = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || '#3498db'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
`;

const UserAvatarPhoto = styled.img`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  text-transform: capitalize;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #7f8c8d;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #7f8c8d;
  text-align: center;
`;

const getUserName = (user) => {
  // Si user est un objet avec nom et prenom
  if (user && typeof user === 'object') {
    const nom = user.nom || '';
    const prenom = user.prenom || '';
    
    if (nom && prenom) {
      return `${prenom} ${nom}`.trim();
    } else if (nom) {
      return nom;
    } else if (prenom) {
      return prenom;
    }
  }
  
  // Si user est juste le nom (string)
  if (typeof user === 'string' && user.trim()) {
    return user.trim();
  }
  
  // Si user est un objet avec nom
  if (user && typeof user === 'object' && user.nom) {
    return user.nom;
  }
  
  return 'Utilisateur';
};

const getUserInitial = (user) => {
  const userName = getUserName(user);
  if (userName && userName !== 'Utilisateur') {
    return userName.charAt(0).toUpperCase();
  }
  return 'U';
};

const getRoleDisplayName = (role) => {
  // Vérifier si role est un objet et extraire la valeur appropriée
  if (typeof role === 'object' && role !== null) {
    if (role.roleType) {
      role = role.roleType;
    } else if (role.id) {
      role = role.id;
    } else {
      console.warn('Structure de rôle inattendue:', role);
      return 'Utilisateur';
    }
  }
  
  // Vérifier que role est une chaîne
  if (typeof role !== 'string') {
    console.warn('Type de rôle inattendu:', typeof role, role);
    return 'Utilisateur';
  }
  
  const roles = {
    'ADMIN': 'Administrateur',
    'MEDECIN': 'Médecin',
    'SECRETAIRE': 'Secrétaire',
  };
  return roles[role] || role;
};

const getAvatarColor = (role) => {
  // Extraire le rôle si c'est un objet
  let roleValue = role;
  if (typeof role === 'object' && role !== null) {
    roleValue = role.roleType || role.id;
  }
  
  const colors = {
    'ADMIN': '#e74c3c',
    'MEDECIN': '#3498db',
    'SECRETAIRE': '#f39c12',
    'USER': '#95a5a6'
  };
  return colors[roleValue] || '#95a5a6';
};

const UserAvatarWithPhoto = ({ user, size = 40 }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    const loadUserPhoto = async () => {
      try {
        const response = await axiosInstance.get(`/utilisateurs/${user.id}/photo`, {
          responseType: 'blob'
        });

        if (response.status === 200) {
          const blob = response.data;
          const url = URL.createObjectURL(blob);
          setPhotoUrl(url);
        } else {
          setPhotoError(true);
        }
      } catch (error) {
        console.log('Photo non disponible pour l\'utilisateur:', user.id, error);
        setPhotoError(true);
      }
    };

    loadUserPhoto();

    // Cleanup function pour libérer l'URL
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [user.id]);

  if (photoUrl && !photoError) {
    return (
      <UserAvatarPhoto 
        src={photoUrl} 
        alt={`Photo de ${getUserName(user)}`}
        size={size}
      />
    );
  }

  return (
    <UserAvatar color={getAvatarColor(user.role)} size={size}>
      {getUserInitial(user)}
    </UserAvatar>
  );
};

const UserList = ({ onUserSelect, onBack, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filtrer les utilisateurs basé sur le terme de recherche
    const filtered = users.filter(user => {
      // Exclure l'utilisateur actuel
      if (user.id === currentUserId) return false;
      
      // Vérifier la recherche par nom
      const userName = getUserName(user);
      if (searchTerm && !userName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm, currentUserId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      console.log('📋 Données utilisateurs reçues:', data);
      
      // Vérifier la structure des données
      if (Array.isArray(data)) {
        data.forEach((user, index) => {
          console.log(`👤 Utilisateur ${index}:`, {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            role: user.role,
            typeNom: typeof user.nom,
            typePrenom: typeof user.prenom,
            typeRole: typeof user.role,
            proprietesDisponibles: Object.keys(user)
          });
        });
        
        // Vérifier le premier utilisateur en détail
        if (data.length > 0) {
          const firstUser = data[0];
          console.log('🔍 Premier utilisateur détaillé:', firstUser);
          console.log('📝 Propriétés disponibles:', Object.keys(firstUser));
          console.log('👤 Nom complet:', `${firstUser.prenom || ''} ${firstUser.nom || ''}`.trim());
        }
      }
      
      setUsers(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      showNotification('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    try {
      console.log('👤 Sélection de l\'utilisateur:', user);
      
      // Créer une nouvelle conversation avec cet utilisateur
      const conversation = await conversationService.startConversation(user.id);
      console.log('💬 Nouvelle conversation créée:', conversation);
      
      onUserSelect(conversation);
    } catch (error) {
      console.error('❌ Erreur lors de la création de la conversation:', error);
      showNotification(error.message || 'Erreur lors de la création de la conversation', 'error');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <UserListContainer>
        <Header>
          <BackButton onClick={onBack}>←</BackButton>
          <HeaderTitle>Nouvelle conversation</HeaderTitle>
        </Header>
        <LoadingState>Chargement des utilisateurs...</LoadingState>
      </UserListContainer>
    );
  }

  return (
    <UserListContainer>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <HeaderTitle>Nouvelle conversation</HeaderTitle>
      </Header>
      
      <div style={{ padding: '15px 20px' }}>
        <SearchInput
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <UsersContainer>
        {filteredUsers.length === 0 ? (
          <EmptyState>
            <div>🔍</div>
            <div>
              {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
            </div>
          </EmptyState>
        ) : (
          filteredUsers.map((user) => (
            <UserItem
              key={user.id}
              onClick={() => handleUserSelect(user)}
            >
              <UserAvatarWithPhoto user={user} />
              
              <UserInfo>
                <UserName>{getUserName(user)}</UserName>
                <UserRole>{getRoleDisplayName(user.role)}</UserRole>
              </UserInfo>
            </UserItem>
          ))
        )}
      </UsersContainer>
    </UserListContainer>
  );
};

export default UserList;
