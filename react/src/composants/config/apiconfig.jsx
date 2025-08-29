// Configuration des endpoints API
export const API_BASE = 'http://localhost:2025/Api/V1/clinique';



// Endpoints des statistiques
export const STATS_ENDPOINTS = {
    DAILY: '/stats/daily',
    MONTHLY: '/stats/monthly',
    YEARLY: '/stats/yearly',
};

// Endpoints utilisateurs
export const USER_ENDPOINTS = {
    ALL_USERS: '/utilisateurs',
    USER_BY_ID: (id) => `/utilisateurs/${id}`,
    USER_PHOTO: (id) => `/utilisateurs/${id}/photo`,
    USER_BY_ROLE: (role) => `/utilisateurs/role/${role}`,
    SEARCH_USERS: '/utilisateurs/search',
    CONNECTED_USERS: '/utilisateurs/connected',
    DISCONNECTED_USERS: '/utilisateurs/disconnected',
};



// Configuration des headers par défaut
export const getDefaultHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Configuration des paramètres de pagination
export const PAGINATION_CONFIG = {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0,
};

// Configuration des timeouts
export const TIMEOUT_CONFIG = {
    REQUEST_TIMEOUT: 30000, // 30 secondes
};

export default {
    API_BASE,
    STATS_ENDPOINTS,
    USER_ENDPOINTS,
    getDefaultHeaders,
    PAGINATION_CONFIG,
    TIMEOUT_CONFIG,
}; 