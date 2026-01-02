/**
 * Centralized Mock Data Factory for React Tests
 * Single source of truth for all test data
 * Follows DRY principle - declare once, use everywhere
 */

// ==================== USERS ====================

export const mockUsers = {
  admin: {
    id: 1,
    nom: 'Admin',
    prenom: 'System',
    email: 'admin@gmail.com',
    role: 'ROLE_ADMIN',
    telephone: '699000001',
    genre: 'M',
    adresse: 'Centre-ville, Yaoundé'
  },
  
  medecin: {
    id: 2,
    nom: 'Mbappé',
    prenom: 'Amina',
    email: 'medecin@gmail.com',
    role: 'ROLE_MEDECIN',
    telephone: '699000002',
    genre: 'F',
    adresse: 'Bastos, Yaoundé',
    specialite: 'Médecine Générale'
  },
  
  secretaire: {
    id: 3,
    nom: 'Kamga',
    prenom: 'Marie',
    email: 'secretaire@gmail.com',
    role: 'ROLE_SECRETAIRE',
    telephone: '699000003',
    genre: 'F',
    adresse: 'Mvan, Yaoundé'
  }
}

// ==================== PATIENTS ====================

export const mockPatients = {
  patient1: {
    id: 1,
    nom: 'Nguemo',
    prenom: 'Jean',
    email: 'jean.nguemo@email.com',
    telephone: '677000001',
    dateNaissance: '1990-05-15',
    age: 33,
    genre: 'M',
    adresse: 'Bastos, Yaoundé',
    groupeSanguin: 'O+'
  },
  
  patient2: {
    id: 2,
    nom: 'Nkolo',
    prenom: 'Aïcha',
    email: 'aicha.nkolo@email.com',
    telephone: '677000002',
    dateNaissance: '1985-08-20',
    age: 38,
    genre: 'F',
    adresse: 'Essos, Yaoundé',
    groupeSanguin: 'A+'
  }
}

export const createMockPatient = (id = 1, overrides = {}) => ({
  id,
  nom: `Patient${id}`,
  prenom: `Test${id}`,
  email: `patient${id}@email.com`,
  telephone: `67700000${id}`,
  dateNaissance: '1990-01-01',
  age: 33,
  genre: id % 2 === 0 ? 'F' : 'M',
  adresse: 'Yaoundé',
  groupeSanguin: 'O+',
  ...overrides
})

export const createMockPatientList = (count = 5) => 
  Array.from({ length: count }, (_, i) => createMockPatient(i + 1))

// ==================== RENDEZ-VOUS ====================

export const mockRendezVous = {
  rdv1: {
    id: 1,
    jour: '2026-01-10',
    heure: '10:00',
    statut: 'CONFIRME',
    patient: mockPatients.patient1,
    medecin: mockUsers.medecin,
    notes: 'Consultation de routine'
  },
  
  rdv2: {
    id: 2,
    jour: '2026-01-11',
    heure: '14:00',
    statut: 'EN_ATTENTE',
    patient: mockPatients.patient2,
    medecin: mockUsers.medecin,
    notes: 'Suivi médical'
  }
}

export const createMockRendezVous = (id = 1, overrides = {}) => ({
  id,
  jour: new Date(Date.now() + id * 86400000).toISOString().split('T')[0],
  heure: `${9 + (id % 8)}:00`,
  statut: 'CONFIRME',
  patient: createMockPatient(id),
  medecin: mockUsers.medecin,
  notes: `Consultation #${id}`,
  ...overrides
})

export const createMockRendezVousList = (count = 5) =>
  Array.from({ length: count }, (_, i) => createMockRendezVous(i + 1))

// ==================== CONSULTATIONS ====================

export const mockConsultations = {
  consultation1: {
    id: 1,
    dateConsultation: '2026-01-05',
    motif: 'Fièvre et toux',
    diagnostic: 'Grippe saisonnière',
    traitement: 'Paracétamol 500mg',
    observations: 'Repos recommandé',
    patient: mockPatients.patient1,
    medecin: mockUsers.medecin,
    rendezVous: mockRendezVous.rdv1
  }
}

export const createMockConsultation = (id = 1, overrides = {}) => ({
  id,
  dateConsultation: new Date().toISOString().split('T')[0],
  motif: `Motif consultation #${id}`,
  diagnostic: `Diagnostic #${id}`,
  traitement: `Traitement #${id}`,
  observations: 'Observations médicales',
  patient: createMockPatient(id),
  medecin: mockUsers.medecin,
  ...overrides
})

// ==================== PRESCRIPTIONS ====================

export const mockPrescriptions = {
  prescription1: {
    id: 1,
    datePrescription: '2026-01-05',
    medicaments: 'Paracétamol 500mg, Ibuprofène 200mg',
    posologie: '2 fois par jour',
    duree: '7 jours',
    consultation: mockConsultations.consultation1,
    medecin: mockUsers.medecin
  }
}

export const createMockPrescription = (id = 1, overrides = {}) => ({
  id,
  datePrescription: new Date().toISOString().split('T')[0],
  medicaments: `Médicament #${id}`,
  posologie: '2 fois par jour',
  duree: '7 jours',
  ...overrides
})

// ==================== FACTURES ====================

export const mockFactures = {
  facture1: {
    id: 1,
    numeroFacture: 'FACT-000001',
    dateFacture: '2026-01-05',
    montantTotal: 50000,
    montantPaye: 50000,
    statut: 'PAYEE',
    patient: mockPatients.patient1,
    consultation: mockConsultations.consultation1
  },
  
  facture2: {
    id: 2,
    numeroFacture: 'FACT-000002',
    dateFacture: '2026-01-06',
    montantTotal: 75000,
    montantPaye: 0,
    statut: 'EN_ATTENTE',
    patient: mockPatients.patient2
  }
}

export const createMockFacture = (id = 1, overrides = {}) => ({
  id,
  numeroFacture: `FACT-${String(id).padStart(6, '0')}`,
  dateFacture: new Date().toISOString().split('T')[0],
  montantTotal: 50000 + (id * 10000),
  montantPaye: 0,
  statut: 'EN_ATTENTE',
  patient: createMockPatient(id),
  ...overrides
})

// ==================== NOTIFICATIONS ====================

export const mockNotifications = {
  notification1: {
    id: 1,
    type: 'RENDEZ_VOUS',
    message: 'Nouveau rendez-vous confirmé',
    dateEnvoi: new Date().toISOString(),
    lu: false,
    destinataire: mockUsers.medecin
  },
  
  notification2: {
    id: 2,
    type: 'RAPPEL',
    message: 'Rendez-vous demain à 10h',
    dateEnvoi: new Date().toISOString(),
    lu: true,
    destinataire: mockUsers.medecin
  }
}

export const createMockNotification = (id = 1, overrides = {}) => ({
  id,
  type: 'RENDEZ_VOUS',
  message: `Notification #${id}`,
  dateEnvoi: new Date().toISOString(),
  lu: false,
  ...overrides
})

// ==================== AUTH TOKENS ====================

export const mockTokens = {
  accessToken: 'mock-access-token-12345',
  refreshToken: 'mock-refresh-token-67890',
  expiredToken: 'expired-token-00000'
}

export const mockAuthResponse = {
  success: {
    accessToken: mockTokens.accessToken,
    refreshToken: mockTokens.refreshToken,
    user: mockUsers.admin
  },
  
  error: {
    message: 'Invalid credentials',
    status: 401
  }
}

// ==================== API RESPONSES ====================

export const mockApiResponses = {
  success: (data) => ({
    data,
    status: 200,
    statusText: 'OK'
  }),
  
  created: (data) => ({
    data,
    status: 201,
    statusText: 'Created'
  }),
  
  error: (message = 'Error', status = 500) => ({
    response: {
      data: { message },
      status,
      statusText: 'Error'
    }
  }),
  
  notFound: (message = 'Not found') => ({
    response: {
      data: { message },
      status: 404,
      statusText: 'Not Found'
    }
  }),
  
  unauthorized: () => ({
    response: {
      data: { message: 'Unauthorized' },
      status: 401,
      statusText: 'Unauthorized'
    }
  })
}

// ==================== STATISTICS ====================

export const mockStatistics = {
  dashboard: {
    totalPatients: 150,
    totalRendezVous: 45,
    rendezVousAujourdhui: 8,
    facturesEnAttente: 12,
    revenuMensuel: 2500000
  },
  
  monthly: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    consultations: [45, 52, 48, 61, 55, 67],
    revenus: [1200000, 1450000, 1380000, 1620000, 1550000, 1780000]
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Create a list of any mock entity
 */
export const createMockList = (createFn, count = 5) =>
  Array.from({ length: count }, (_, i) => createFn(i + 1))

/**
 * Simulate API delay
 */
export const mockDelay = (ms = 100) =>
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Create mock error
 */
export const createMockError = (message, status = 500) => {
  const error = new Error(message)
  error.response = {
    data: { message },
    status,
    statusText: 'Error'
  }
  return error
}

/**
 * Reset localStorage for tests
 */
export const resetMockStorage = () => {
  localStorage.clear()
  sessionStorage.clear()
}

/**
 * Setup authenticated user
 */
export const setupMockAuth = (user = mockUsers.admin) => {
  localStorage.setItem('accessToken', mockTokens.accessToken)
  localStorage.setItem('refreshToken', mockTokens.refreshToken)
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Clear authentication
 */
export const clearMockAuth = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

// Export all as default for easy import
export default {
  mockUsers,
  mockPatients,
  mockRendezVous,
  mockConsultations,
  mockPrescriptions,
  mockFactures,
  mockNotifications,
  mockTokens,
  mockAuthResponse,
  mockApiResponses,
  mockStatistics,
  createMockPatient,
  createMockPatientList,
  createMockRendezVous,
  createMockRendezVousList,
  createMockConsultation,
  createMockPrescription,
  createMockFacture,
  createMockNotification,
  createMockList,
  mockDelay,
  createMockError,
  resetMockStorage,
  setupMockAuth,
  clearMockAuth
}
