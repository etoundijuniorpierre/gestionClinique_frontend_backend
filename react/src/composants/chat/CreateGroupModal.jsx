import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axiosInstance from '../config/axiosConfig';
import { userService, groupService } from '../../services/messagerieService';

// Fallback simple pour les notifications si le hook n'est pas disponible
let useNotificationFallback = () => ({
  showNotification: (message, type = 'info') => {
    console.log(`[Notification] ${type}: ${message}`);
    if (type === 'error') {
      alert(`Erreur: ${message}`);
    }
  }
});

// Essayer d'importer le hook de notification, sinon utiliser le fallback
try {
  const { useNotification } = require('../notification');
  useNotificationFallback = useNotification;
} catch (error) {
  console.warn('Impossible de charger le système de notification, utilisation du fallback:', error);
}

const useNotification = useNotificationFallback;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    border-color: #3498db;
  }
`;

const MembersSection = styled.div`
  margin-top: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background: white;
  min-width: 150px;
  
  &:focus {
    border-color: #3498db;
  }
`;

const MultiSelectContainer = styled.div`
  position: relative;
  min-width: 200px;
`;

const MultiSelectButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    border-color: #3498db;
  }
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const MultiSelectDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
`;

const MultiSelectOption = styled.label`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f8f9fa;
  }
  
  input[type="checkbox"] {
    margin-right: 8px;
  }
`;

const SelectedItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
`;

const SelectedTag = styled.span`
  background: #3498db;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  margin-left: 4px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const UserSelectionControls = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const SelectionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #3498db;
    color: #3498db;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.select-all {
    background: #3498db;
    color: white;
    border-color: #3498db;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &.deselect-all {
    background: #e74c3c;
    color: white;
    border-color: #e74c3c;
    
    &:hover {
      background: #c0392b;
    }
  }
`;

const SelectFilteredButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #27ae60;
  border-radius: 6px;
  background: #27ae60;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #229954;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterLabel = styled.label`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  display: block;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClearFiltersButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #f8f9fa;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }
`;

const MembersInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
`;

const MembersCount = styled.span`
  font-weight: 500;
  color: #3498db;
`;

const MembersList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
  
  ${props => props.selected && `
    background: #e3f2fd;
    border: 1px solid #2196f3;
  `}
`;

const Checkbox = styled.input`
  margin: 0;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color || '#3498db'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
`;

const UserAvatarPhoto = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #7f8c8d;
`;

const UserService = styled.div`
  font-size: 11px;
  color: #3498db;
  font-style: italic;
`;

const ModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.cancel {
    background: #6b7280;
    color: white;
    
    &:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }
  }
  
  &.create {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #7f8c8d;
`;

const getAvatarColor = (role) => {
  // Gérer le cas où role est un objet {id, roleType}
  let roleValue = role;
  if (role && typeof role === 'object' && role.roleType) {
    roleValue = role.roleType;
  } else if (role && typeof role === 'string') {
    roleValue = role;
  }
  
  const colors = {
    'ADMIN': '#ef4444',
    'MEDECIN': '#3b82f6',
    'SECRETAIRE': '#f59e0b',
    'USER': '#9ca3af'
  };
  return colors[roleValue] || '#9ca3af';
};

const getRoleDisplayName = (role) => {
  // Gérer le cas où role est un objet {id, roleType}
  let roleValue = role;
  if (role && typeof role === 'object' && role.roleType) {
    roleValue = role.roleType;
  } else if (role && typeof role === 'string') {
    roleValue = role;
  }
  
  const roles = {
    'ADMIN': 'Administrateur',
    'MEDECIN': 'Médecin',
    'SECRETAIRE': 'Secrétaire',
    'USER': 'Utilisateur'
  };
  return roles[roleValue] || roleValue || 'Utilisateur';
};

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
  
  // Fallback
  return 'Utilisateur';
};

const getUserInitial = (user) => {
  // Si user est un objet avec nom et prenom
  if (user && typeof user === 'object') {
    const nom = user.nom || '';
    const prenom = user.prenom || '';
    
    if (prenom) {
      return prenom.charAt(0).toUpperCase();
    } else if (nom) {
      return nom.charAt(0).toUpperCase();
    }
  }
  
  // Fallback
  return 'U';
};

const getServiceDisplayName = (serviceName) => {
  const serviceNames = {
    'CARDIOLOGIE': 'Cardiologie',
    'MEDECINE_GENERALE': 'Médecine Générale',
    'PEDIATRIE': 'Pédiatrie',
    'GYNECOLOGIE': 'Gynécologie',
    'DERMATOLOGIE': 'Dermatologie',
    'OPHTAMOLOGIE': 'Ophtalmologie',
    'ORTHOPEDIE': 'Orthopédie',
    'RADIOLOGIE': 'Radiologie',
    'LABORATOIRE_ANALYSES': 'Laboratoire d\'Analyses',
    'URGENCES': 'Urgences',
    'KINESITHERAPIE': 'Kinésithérapie'
  };
  
  return serviceNames[serviceName] || serviceName;
};

const MultiSelect = ({ 
  options, 
  selectedValues, 
  onSelectionChange, 
  placeholder, 
  getDisplayName = (value) => value,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionChange = (value) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const removeItem = (value) => {
    const newSelection = selectedValues.filter(v => v !== value);
    onSelectionChange(newSelection);
  };

  const getButtonText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      return getDisplayName(selectedValues[0]);
    }
    return `${selectedValues.length} sélectionné${selectedValues.length > 1 ? 's' : ''}`;
  };

  return (
    <MultiSelectContainer ref={containerRef}>
      <MultiSelectButton 
        type="button" 
        onClick={handleToggle}
        disabled={disabled}
      >
        <span>{getButtonText()}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </MultiSelectButton>
      
      {isOpen && (
        <MultiSelectDropdown>
          {options.map(option => (
            <MultiSelectOption key={option}>
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleOptionChange(option)}
                disabled={disabled}
              />
              {getDisplayName(option)}
            </MultiSelectOption>
          ))}
        </MultiSelectDropdown>
      )}
      
      {selectedValues.length > 0 && (
        <SelectedItems>
          {selectedValues.map(value => (
            <SelectedTag key={value}>
              {getDisplayName(value)}
              <RemoveButton onClick={() => removeItem(value)}>
                ×
              </RemoveButton>
            </SelectedTag>
          ))}
        </SelectedItems>
      )}
    </MultiSelectContainer>
  );
};

const UserAvatarWithPhoto = ({ user, size = 32 }) => {
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

const CreateGroupModal = ({ onClose, onGroupCreated, currentUserId }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      
      // Debug: afficher la structure des données utilisateur
      console.log('🔍 Structure des données utilisateur dans CreateGroupModal:', data.slice(0, 3).map(user => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        roleType: user.roleType,
        serviceMedicalName: user.serviceMedicalName
      })));
      
      // Filtrer l'utilisateur actuel
      const filteredUsers = data.filter(user => user.id !== currentUserId);
      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
      
      // Extraire les services uniques
      const uniqueServices = [...new Set(filteredUsers
        .map(user => user.serviceMedicalName)
        .filter(service => service && service.trim())
      )].sort();
      setServices(uniqueServices);
      
      // Extraire les rôles uniques
      const uniqueRoles = [...new Set(filteredUsers
        .map(user => {
          if (user.role && typeof user.role === 'object' && user.role.roleType) {
            return user.role.roleType;
          } else if (typeof user.role === 'string') {
            return user.role;
          }
          return null;
        })
        .filter(role => role)
      )].sort();
      setRoles(uniqueRoles);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      showNotification('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMembers(filteredUsers.map(user => user.id));
  };

  const handleDeselectAll = () => {
    setSelectedMembers([]);
  };

  const handleSelectFiltered = () => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    setSelectedMembers(prev => {
      const newSelection = [...prev];
      filteredUserIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      return newSelection;
    });
  };

  const handleDeselectFiltered = () => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    setSelectedMembers(prev => prev.filter(id => !filteredUserIds.includes(id)));
  };

  // Calculer les statistiques de sélection
  const getSelectionStats = () => {
    const selectedInView = filteredUsers.filter(user => selectedMembers.includes(user.id)).length;
    const totalInView = filteredUsers.length;
    const totalSelected = selectedMembers.length;
    
    return {
      selectedInView,
      totalInView,
      totalSelected,
      allInViewSelected: selectedInView === totalInView && totalInView > 0,
      someInViewSelected: selectedInView > 0 && selectedInView < totalInView
    };
  };

  const applyFilters = () => {
    let filtered = users;

    // Filtre par services médicaux (multiple)
    if (selectedServices.length > 0) {
      filtered = filtered.filter(user => 
        selectedServices.includes(user.serviceMedicalName)
      );
    }

    // Filtre par rôles (multiple)
    if (selectedRoles.length > 0) {
      filtered = filtered.filter(user => {
        let userRole;
        if (user.role && typeof user.role === 'object' && user.role.roleType) {
          userRole = user.role.roleType;
        } else if (typeof user.role === 'string') {
          userRole = user.role;
        } else {
          return false;
        }
        return selectedRoles.includes(userRole);
      });
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setSelectedServices([]);
    setSelectedRoles([]);
    setFilteredUsers(users);
  };

  const handleServicesChange = (newServices) => {
    setSelectedServices(newServices);
  };

  const handleRolesChange = (newRoles) => {
    setSelectedRoles(newRoles);
  };

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [selectedServices, selectedRoles, users]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      showNotification('Le nom du groupe est requis', 'error');
      return;
    }

    if (selectedMembers.length === 0) {
      showNotification('Sélectionnez au moins un membre', 'error');
      return;
    }

    try {
      setCreating(true);
      const groupData = {
        nom: groupName.trim(),
        description: groupDescription.trim(),
        idCreateur: currentUserId,
        idsMembres: selectedMembers
      };

      const newGroup = await groupService.createGroup(groupData);
      onGroupCreated(newGroup);
      showNotification('Groupe créé avec succès', 'success');
    } catch (error) {
      showNotification('Erreur lors de la création du groupe', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      onClose();
    }
  };

  const isFormValid = groupName.trim() && selectedMembers.length > 0;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Créer un nouveau groupe</ModalTitle>
          <CloseButton onClick={handleClose} disabled={creating}>
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Nom du groupe *</Label>
            <Input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Entrez le nom du groupe"
              disabled={creating}
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Description du groupe (optionnel)"
              disabled={creating}
            />
          </FormGroup>

          <MembersSection>
            <Label>Sélectionner les membres *</Label>
            
            {!loading && (
              <FiltersContainer>
                <FilterGroup>
                  <FilterLabel>Services médicaux</FilterLabel>
                  <MultiSelect
                    options={services}
                    selectedValues={selectedServices}
                    onSelectionChange={handleServicesChange}
                    placeholder="Sélectionner des services"
                    getDisplayName={getServiceDisplayName}
                    disabled={creating}
                  />
                </FilterGroup>
                
                <FilterGroup>
                  <FilterLabel>Rôles</FilterLabel>
                  <MultiSelect
                    options={roles}
                    selectedValues={selectedRoles}
                    onSelectionChange={handleRolesChange}
                    placeholder="Sélectionner des rôles"
                    getDisplayName={getRoleDisplayName}
                    disabled={creating}
                  />
                </FilterGroup>
                
                {(selectedServices.length > 0 || selectedRoles.length > 0) && (
                  <FilterGroup>
                    <FilterLabel>&nbsp;</FilterLabel>
                    <ClearFiltersButton 
                      onClick={clearFilters}
                      disabled={creating}
                    >
                      Effacer les filtres
                    </ClearFiltersButton>
                  </FilterGroup>
                )}
              </FiltersContainer>
            )}
            
            {loading ? (
              <LoadingState>Chargement des utilisateurs...</LoadingState>
            ) : (
              <>
                {(() => {
                  const stats = getSelectionStats();
                  return (
                    <>
                      <MembersInfo>
                        <span>
                          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} disponible{filteredUsers.length > 1 ? 's' : ''}
                          {selectedServices.length > 0 && (
                            ` dans ${selectedServices.length > 1 ? 'les services ' : 'le service '}${selectedServices.map(s => getServiceDisplayName(s)).join(', ')}`
                          )}
                          {selectedRoles.length > 0 && (
                            ` avec ${selectedRoles.length > 1 ? 'les rôles ' : 'le rôle '}${selectedRoles.map(r => getRoleDisplayName(r)).join(', ')}`
                          )}
                        </span>
                        <MembersCount>
                          {stats.totalSelected} sélectionné{stats.totalSelected > 1 ? 's' : ''}
                          {stats.totalInView > 0 && (
                            <span style={{ fontSize: '10px', opacity: 0.7 }}>
                              {' '}({stats.selectedInView}/{stats.totalInView} dans la vue)
                            </span>
                          )}
                        </MembersCount>
                      </MembersInfo>
                      
                      <UserSelectionControls>
                        <SelectionButton
                          onClick={handleSelectAll}
                          disabled={creating || filteredUsers.length === 0}
                          className="select-all"
                        >
                          Tout sélectionner
                        </SelectionButton>
                        
                        <SelectionButton
                          onClick={handleDeselectAll}
                          disabled={creating || selectedMembers.length === 0}
                          className="deselect-all"
                        >
                          Tout désélectionner
                        </SelectionButton>
                        
                        <SelectFilteredButton
                          onClick={handleSelectFiltered}
                          disabled={creating || filteredUsers.length === 0 || stats.allInViewSelected}
                        >
                          {stats.allInViewSelected ? 'Tous sélectionnés' : `Sélectionner filtrés (${stats.totalInView})`}
                        </SelectFilteredButton>
                        
                        <SelectionButton
                          onClick={handleDeselectFiltered}
                          disabled={creating || filteredUsers.length === 0 || stats.selectedInView === 0}
                        >
                          Désélectionner filtrés ({stats.selectedInView})
                        </SelectionButton>
                      </UserSelectionControls>
                    </>
                  );
                })()}
                <MembersList>
                {filteredUsers.map((user) => (
                  <MemberItem
                    key={user.id}
                    selected={selectedMembers.includes(user.id)}
                    onClick={() => handleMemberToggle(user.id)}
                  >
                    <Checkbox
                      type="checkbox"
                      checked={selectedMembers.includes(user.id)}
                      onChange={() => handleMemberToggle(user.id)}
                      disabled={creating}
                    />
                    <UserAvatarWithPhoto user={user} />
                    <UserInfo>
                      <UserName>{getUserName(user)}</UserName>
                      <UserRole>{getRoleDisplayName(user.role)}</UserRole>
                      {user.serviceMedicalName && (
                        <UserService>{getServiceDisplayName(user.serviceMedicalName)}</UserService>
                      )}
                    </UserInfo>
                  </MemberItem>
                ))}
                </MembersList>
              </>
            )}
          </MembersSection>
        </ModalBody>

        <ModalFooter>
          <Button className="cancel" onClick={handleClose} disabled={creating}>
            Annuler
          </Button>
          <Button
            className="create"
            onClick={handleCreateGroup}
            disabled={!isFormValid || creating}
          >
            {creating ? 'Création...' : 'Créer le groupe'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateGroupModal;
 