// src/services/messagerieService.js
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import { API_BASE } from "../composants/config/apiconfig";
import axios from "axios";
import { useState, useEffect } from "react";

let stompClient = null;

// Configuration axios avec token d'authentification
const createAxiosInstance = () => {
    // Essayer plusieurs clés possibles pour le token JWT
    let token = localStorage.getItem('jwtToken') || 
                localStorage.getItem('token') || 
                localStorage.getItem('accessToken');
    
    const userId = localStorage.getItem('id');
    const userRole = localStorage.getItem('role');
    
    if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
    }
    
    if (!userId) {
        throw new Error('ID utilisateur manquant. Veuillez vous reconnecter.');
    }
    
    console.log('🔑 Token présent:', !!token);
    console.log('👤 ID utilisateur:', userId);
    console.log('🌐 URL de base:', API_BASE);
    
    const instance = axios.create({
        baseURL: API_BASE,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    // Intercepteur pour logger les requêtes
    instance.interceptors.request.use(request => {
        console.log('📤 Requête envoyée:', {
            method: request.method,
            url: request.url,
            headers: request.headers,
            data: request.data
        });
        return request;
    });
    
    // Intercepteur pour logger les réponses
    instance.interceptors.response.use(
        response => {
            console.log('📥 Réponse reçue:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data
            });
            return response;
        },
        error => {
            console.log('❌ Erreur de réponse:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            return Promise.reject(error);
        }
    );
    
    return instance;
};

// ===== FONCTIONS DE DIAGNOSTIC =====

// Vérifier l'état de l'authentification
export const checkAuthStatus = () => {
    // Essayer plusieurs clés possibles pour le token JWT
    const token = localStorage.getItem('jwtToken') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('accessToken');
    
    const userId = localStorage.getItem('id');
    
    console.log('🔍 Diagnostic d\'authentification:', {
        hasToken: !!token,
        userId: userId,
        tokenLength: token ? token.length : 0
    });
    
    return {
        isAuthenticated: !!token && !!userId,
        token: token,
        userId: userId
    };
};



// ===== SERVICES PRINCIPAUX =====

// Service pour les conversations
export const conversationService = {
    // Récupérer toutes les conversations de l'utilisateur
    getUserConversations: async () => {
        try {
            console.log('🔄 Tentative de récupération des conversations...');
            const response = await createAxiosInstance().get('/chat/conversations');
            console.log('Conversations récupérées avec succès:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des conversations:', error);
            
            if (error.response) {
                // Erreur de réponse du serveur
                console.error('📊 Détails de l\'erreur:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data,
                    headers: error.response.headers
                });
                
                if (error.response.status === 403) {
                    throw new Error('Accès refusé. Vérifiez vos autorisations ou reconnectez-vous.');
                } else if (error.response.status === 401) {
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                } else if (error.response.status === 404) {
                    throw new Error('Endpoint non trouvé. Vérifiez la configuration du backend.');
                }
            } else if (error.request) {
                // Erreur de requête (pas de réponse)
                console.error('🌐 Erreur de connexion:', error.request);
                throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
            } else {
                // Erreur de configuration
                console.error('⚙️ Erreur de configuration:', error.message);
                throw new Error(error.message || 'Erreur inconnue lors de la récupération des conversations');
            }
        }
    },

    // Démarrer une nouvelle conversation
    startConversation: async (recipientId) => {
        try {
            const currentUserId = localStorage.getItem('id');
            
            if (!currentUserId) {
                throw new Error('Utilisateur non connecté');
            }
            
            const conversationData = {
                participantIds: [parseInt(currentUserId), parseInt(recipientId)]
            };
            
            console.log('🔄 Création de conversation avec les participants:', conversationData.participantIds);
            
            const response = await createAxiosInstance().post('/chat/conversations', conversationData);
            console.log('Conversation créée avec succès:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur lors de la création de la conversation:', error);
            
            if (error.response) {
                console.error('📊 Détails de l\'erreur:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
                
                if (error.response.status === 403) {
                    throw new Error('Accès refusé. Vérifiez vos autorisations pour créer des conversations.');
                } else if (error.response.status === 401) {
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                }
            }
            
            throw new Error(error.message || 'Impossible de créer la conversation');
        }
    },

    // Marquer une conversation comme lue
    markConversationAsRead: async (conversationId) => {
        try {
            const userId = localStorage.getItem('id');
            const markReadData = {
                conversationId: conversationId,
                userId: parseInt(userId),
                readAt: new Date().toISOString()
            };
            await createAxiosInstance().post('/chat/conversations/mark-read', markReadData);
        } catch (error) {
            console.error('Erreur lors du marquage comme lu:', error);
        }
    }
};

// Service pour les messages
export const messageService = {
    // Récupérer les messages d'une conversation
    getMessagesByConversation: async (conversationId, page = 0, size = 20) => {
        try {
            const response = await createAxiosInstance().get(`/chat/conversations/${conversationId}/messages`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
            throw new Error('Impossible de récupérer les messages');
        }
    },

    // Envoyer un message
    sendMessage: async (conversationId, contenu) => {
        try {
            const userId = localStorage.getItem('id');
            const messageData = {
                contenu: contenu,
                lu: false,
                expediteurId: parseInt(userId),
                conversationId: conversationId
            };
            const response = await createAxiosInstance().post('/chat/messages', messageData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            throw new Error('Impossible d\'envoyer le message');
        }
    },

    // Modifier un message
    updateMessage: async (messageId, newContent) => {
        try {
            const response = await createAxiosInstance().put(`/chat/messages/${messageId}`, newContent);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la modification du message:', error);
            throw new Error('Impossible de modifier le message');
        }
    },

    // Supprimer un message
    deleteMessage: async (messageId) => {
        try {
            await createAxiosInstance().delete(`/chat/messages/${messageId}`);
        } catch (error) {
            console.error('Erreur lors de la suppression du message:', error);
            throw new Error('Impossible de supprimer le message');
        }
    }
};



// Service pour les groupes
export const groupService = {
    // Créer un nouveau groupe
    createGroup: async (groupeData) => {
        try {
            const response = await createAxiosInstance().post('/chat/groups', groupeData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du groupe:', error);
            throw new Error('Impossible de créer le groupe');
        }
    },

    // Ajouter des membres à un groupe
    addMembersToGroup: async (groupeId, memberIds) => {
        try {
            const response = await createAxiosInstance().post(`/chat/groups/${groupeId}/members`, {
                memberIds: memberIds
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout des membres:', error);
            throw new Error('Impossible d\'ajouter les membres');
        }
    }
};

// Service pour les utilisateurs
export const userService = {
    // Récupérer tous les utilisateurs
    getAllUsers: async () => {
        try {
            const response = await createAxiosInstance().get('/utilisateurs');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            throw new Error('Impossible de récupérer les utilisateurs');
        }
    },

    // Récupérer un utilisateur par ID
    getUserById: async (userId) => {
        try {
            const response = await createAxiosInstance().get(`/utilisateurs/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw new Error('Impossible de récupérer l\'utilisateur');
        }
    }
};

// ===== CONTEXTE POUR LES MESSAGES EN TEMPS RÉEL =====
let messageListeners = new Map();

export const addMessageListener = (conversationId, callback) => {
    if (!messageListeners.has(conversationId)) {
        messageListeners.set(conversationId, new Set());
    }
    messageListeners.get(conversationId).add(callback);
    
    // Retourner une fonction pour supprimer l'écouteur
    return () => {
        const listeners = messageListeners.get(conversationId);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                messageListeners.delete(conversationId);
            }
        }
    };
};

export const notifyMessageListeners = (conversationId, message, action = 'ADD') => {
    const listeners = messageListeners.get(conversationId);
    if (listeners) {
        listeners.forEach(callback => {
            try {
                callback(message, action);
            } catch (error) {
                console.error('Erreur dans le callback de message:', error);
            }
        });
    }
};

// ===== WEBSOCKET CONFIGURATION =====

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 secondes

export const connectWebSocket = (userId, onMessageReceived, onConnected) => {
    console.log("🔌 Tentative de connexion WebSocket pour l'utilisateur:", userId);
    const wsBaseUrl = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
    console.log("🌐 URL WebSocket:", `${wsBaseUrl}/ws`);
    
    // Vérifier l'authentification avant la connexion
    const authStatus = checkAuthStatus();
    if (!authStatus.isAuthenticated) {
        console.error("❌ Impossible de se connecter au WebSocket: utilisateur non authentifié");
        return;
    }
    
    // Nettoyer la connexion précédente si elle existe
    if (stompClient) {
        try {
            stompClient.deactivate();
        } catch (error) {
            console.warn("⚠️ Erreur lors de la déconnexion précédente:", error);
        }
    }
    
    stompClient = new StompClient({
        webSocketFactory: () => {
            const wsUrl = API_BASE.endsWith('/') ? `${API_BASE}ws` : `${API_BASE}/ws`;
            const sock = new SockJS(wsUrl);
            
            // Ajouter des listeners pour diagnostiquer les problèmes de connexion
            sock.onopen = () => {
                console.log("Connexion SockJS établie");
            };
            
            sock.onclose = (event) => {
                console.log("🔌 Connexion SockJS fermée:", event);
                if (event.code !== 1000) { // Fermeture normale
                    console.warn("⚠️ Fermeture anormale de SockJS:", event);
                }
            };
            
            sock.onerror = (error) => {
                console.error("❌ Erreur SockJS:", error);
            };
            
            return sock;
        },
        onConnect: () => {
            console.log("Connecté au WebSocket STOMP");
            reconnectAttempts = 0; // Réinitialiser les tentatives de reconnexion
            
            // S'abonner aux messages privés
            stompClient.subscribe(`/queue/user.${userId}`, (message) => {
                console.log("📨 Message privé reçu:", message);
                try {
                    const body = JSON.parse(message.body);
                    console.log("📨 Contenu du message privé:", body);
                    onMessageReceived(body);
                } catch (error) {
                    console.error("❌ Erreur lors du parsing du message privé:", error);
                    console.error("📨 Message brut:", message.body);
                }
            });
            
            // S'abonner aux messages de groupe
            stompClient.subscribe(`/topic/group`, (message) => {
                console.log("📨 Message de groupe reçu:", message);
                try {
                    const body = JSON.parse(message.body);
                    console.log("📨 Contenu du message de groupe:", body);
                    onMessageReceived(body);
                } catch (error) {
                    console.error("❌ Erreur lors du parsing du message de groupe:", error);
                    console.error("📨 Message brut:", message.body);
                }
            });
            
            // S'abonner aux messages de conversation spécifique
            stompClient.subscribe(`/topic/conversation`, (message) => {
                console.log("📨 Message de conversation reçu:", message);
                try {
                    const body = JSON.parse(message.body);
                    console.log("📨 Contenu du message de conversation:", body);
                    onMessageReceived(body);
                } catch (error) {
                    console.error("❌ Erreur lors du parsing du message de conversation:", error);
                    console.error("📨 Message brut:", message.body);
                }
            });

            // S'abonner aux notifications en temps réel (nouveaux messages, RDV, etc.)
            stompClient.subscribe(`/user/queue/notifications`, (message) => {
                console.log("🔔 Notification temps réel reçue:", message);
                try {
                    const body = JSON.parse(message.body);
                    // On transmet la notification au callback
                    onMessageReceived({ 
                        type: 'NOTIFICATION_REALTIME', 
                        data: body 
                    });
                } catch (error) {
                    console.error("❌ Erreur lors du parsing de la notification:", error);
                }
            });
            
            if (onConnected) onConnected();
        },
        onDisconnect: () => {
            console.log("🔌 Déconnecté du WebSocket STOMP");
            
            // Tentative de reconnexion automatique
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                console.log(`🔄 Tentative de reconnexion ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} dans ${RECONNECT_DELAY}ms...`);
                
                setTimeout(() => {
                    console.log("🔄 Reconnexion automatique...");
                    connectWebSocket(userId, onMessageReceived, onConnected);
                }, RECONNECT_DELAY);
            } else {
                console.error("❌ Nombre maximum de tentatives de reconnexion atteint");
            }
        },
        onStompError: (frame) => {
            console.error("❌ Erreur STOMP:", frame);
            console.error("❌ Détails de l'erreur STOMP:", {
                command: frame.command,
                headers: frame.headers,
                body: frame.body
            });
        },
        onWebSocketError: (error) => {
            console.error("❌ Erreur WebSocket:", error);
            console.error("❌ Type d'erreur:", error.type);
            console.error("❌ Message d'erreur:", error.message);
        }
    });
    
    try {
        stompClient.activate();
        console.log("🚀 Activation du client STOMP");
    } catch (error) {
        console.error("❌ Erreur lors de l'activation du client STOMP:", error);
    }
};

export const sendMessageViaWebSocket = (message) => {
    if (stompClient && stompClient.connected) {
        console.log("📤 Envoi de message via WebSocket:", message);
        stompClient.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(message)
        });
    } else {
        console.warn("⚠️ WebSocket non connecté, impossible d'envoyer le message");
        console.log("🔍 État du client STOMP:", {
            exists: !!stompClient,
            connected: stompClient?.connected,
            state: stompClient?.state
        });
    }
};

export const updateMessageViaWebSocket = (message) => {
    if (stompClient && stompClient.connected) {
        console.log("📤 Mise à jour de message via WebSocket:", message);
        stompClient.publish({
            destination: "/app/chat.updateMessage",
            body: JSON.stringify(message)
        });
    } else {
        console.warn("⚠️ WebSocket non connecté, impossible de mettre à jour le message");
    }
};

export const deleteMessageViaWebSocket = (messageId) => {
    if (stompClient && stompClient.connected) {
        console.log("📤 Suppression de message via WebSocket:", messageId);
        stompClient.publish({
            destination: "/app/chat.deleteMessage",
            body: JSON.stringify({ messageId: messageId })
        });
    } else {
        console.warn("⚠️ WebSocket non connecté, impossible de supprimer le message");
    }
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        try {
            stompClient.deactivate();
            console.log("🔌 Déconnecté du WebSocket");
        } catch (error) {
            console.warn("⚠️ Erreur lors de la déconnexion:", error);
        }
    }
};



// ===== HOOKS PERSONNALISÉS =====

// Hook pour les conversations
export const useConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sortConversations = (conversationsList) => {
        return conversationsList.sort((a, b) => {
            const dateA = new Date(a.lastMessageAt || a.creationDate || a.createdAt || 0);
            const dateB = new Date(b.lastMessageAt || b.creationDate || b.createdAt || 0);
            
            // Ordre croissant : plus anciennes en haut, plus récentes en bas
            return dateA - dateB;
        });
    };

    const fetchConversations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await conversationService.getUserConversations();
            
            // Trier les conversations par date de dernier message
            const sortedConversations = sortConversations(data);
            
            console.log('📅 Conversations triées par date:', sortedConversations.map(c => ({
                id: c.id,
                lastMessageAt: c.lastMessageAt,
                creationDate: c.creationDate,
                createdAt: c.createdAt
            })));
            
            setConversations(sortedConversations);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateConversationOrder = (conversationId) => {
        setConversations(prev => {
            // Trouver la conversation à mettre à jour
            const updatedConversations = prev.map(conv => {
                if (conv.id === conversationId) {
                    // Mettre à jour la date du dernier message
                    return {
                        ...conv,
                        lastMessageAt: new Date().toISOString()
                    };
                }
                return conv;
            });
            
            // Retrier les conversations
            return sortConversations(updatedConversations);
        });
    };

    return { 
        conversations, 
        loading, 
        error, 
        fetchConversations,
        updateConversationOrder
    };
};

// Hook pour les messages
export const useMessages = (conversationId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sortMessages = (messagesList) => {
        return messagesList.sort((a, b) => {
            const dateA = new Date(a.creationDate || a.createdAt || 0);
            const dateB = new Date(b.creationDate || b.createdAt || 0);
            
            // Ordre croissant : plus anciens en haut, plus récents en bas
            return dateA - dateB;
        });
    };

    // Écouter les nouveaux messages en temps réel
    useEffect(() => {
        if (!conversationId) return;

        const removeListener = addMessageListener(conversationId, (message, action) => {
            console.log(`📨 Message reçu en temps réel pour la conversation ${conversationId}:`, action, message);
            
            if (action === 'ADD') {
                // Vérifier si le message n'existe pas déjà pour éviter les doublons
                setMessages(prev => {
                    const messageExists = prev.some(msg => msg.id === message.id);
                    if (messageExists) {
                        console.log('⚠️ Message déjà présent, ignoré:', message.id);
                        return prev;
                    }
                    
                    const updatedMessages = [...prev, message];
                    return sortMessages(updatedMessages);
                });
            } else if (action === 'UPDATE') {
                // Mettre à jour le message
                setMessages(prev => {
                    const updatedMessages = prev.map(msg => 
                        msg.id === message.id ? message : msg
                    );
                    return sortMessages(updatedMessages);
                });
            } else if (action === 'DELETE') {
                // Supprimer le message
                setMessages(prev => {
                    const updatedMessages = prev.filter(msg => msg.id !== message.id);
                    return sortMessages(updatedMessages);
                });
            }
        });

        // Nettoyer l'écouteur
        return removeListener;
    }, [conversationId]);

    const fetchMessages = async (page = 0, isDisplayRefresh = false) => {
        if (!conversationId) return;
        
        // Pour les actualisations d'affichage, vérifier si c'est nécessaire
        if (isDisplayRefresh && messages.length > 0) {
            // Vérifier si les messages sont récents (moins de 3 secondes)
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.dateEnvoi) {
                const lastMessageTime = new Date(lastMessage.dateEnvoi).getTime();
                const currentTime = new Date().getTime();
                const timeDiff = currentTime - lastMessageTime;
                
                // Si le dernier message est récent (moins de 3 secondes), ne pas actualiser
                if (timeDiff < 3000) {
                    console.log(`⏭️ Actualisation d'affichage ignorée - dernier message récent (${Math.round(timeDiff/1000)}s)`);
                    return { content: messages };
                }
            }
            
            // Vérifier si les messages sont identiques pour éviter les re-renders inutiles
            const currentMessageIds = messages.map(m => m.id).join(',');
            const lastRefreshKey = `lastRefresh_${conversationId}`;
            const lastMessageIds = sessionStorage.getItem(lastRefreshKey);
            
            if (currentMessageIds === lastMessageIds) {
                console.log('⏭️ Actualisation d\'affichage ignorée - messages identiques');
                return { content: messages };
            }
        }
        
        // Pour les actualisations d'affichage, ne pas afficher le loading
        if (!isDisplayRefresh) {
            setLoading(true);
        }
        setError(null);
        
        try {
            const data = await messageService.getMessagesByConversation(conversationId, page);
            const newMessages = data.content || [];
            
            if (page === 0) {
                // Première page : remplacer tous les messages et les trier
                const sortedMessages = sortMessages(newMessages);
                
                // Pour les actualisations d'affichage, vérifier si les messages ont vraiment changé
                if (isDisplayRefresh) {
                    const newMessageIds = sortedMessages.map(m => m.id).join(',');
                    const currentMessageIds = messages.map(m => m.id).join(',');
                    
                    if (newMessageIds === currentMessageIds) {
                        console.log('⏭️ Actualisation d\'affichage ignorée - aucun changement détecté');
                        return { content: messages };
                    }
                }
                
                setMessages(sortedMessages);
                console.log(`📨 Messages triés pour la conversation ${conversationId}:`, sortedMessages.length);
                
                // Sauvegarder les IDs des messages pour la prochaine vérification
                if (isDisplayRefresh) {
                    const messageIds = sortedMessages.map(m => m.id).join(',');
                    sessionStorage.setItem(`lastRefresh_${conversationId}`, messageIds);
                }
            } else {
                // Pages suivantes : ajouter au début (pour l'historique) et retrier
                const allMessages = [...newMessages, ...messages];
                const sortedMessages = sortMessages(allMessages);
                setMessages(sortedMessages);
                console.log(`📨 Messages historiques ajoutés pour la conversation ${conversationId}:`, newMessages.length);
            }
            
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            // Pour les actualisations d'affichage, ne pas afficher le loading
            if (!isDisplayRefresh) {
                setLoading(false);
            }
        }
    };

    const sendMessage = async (contenu) => {
        if (!conversationId || !contenu.trim()) return;
        
        try {
            const newMessage = await messageService.sendMessage(conversationId, contenu);
            
            // Ajouter le message localement pour une mise à jour immédiate
            const updatedMessages = [...messages, newMessage];
            const sortedMessages = sortMessages(updatedMessages);
            setMessages(sortedMessages);
            
            // Notifier les autres écouteurs de ce message
            notifyMessageListeners(conversationId, newMessage, 'ADD');
            
            console.log('Nouveau message envoyé et ajouté localement:', newMessage);
            return newMessage;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateMessage = async (messageId, newContent) => {
        try {
            const updatedMessage = await messageService.updateMessage(messageId, newContent);
            const updatedMessages = messages.map(msg => 
                msg.id === messageId ? updatedMessage : msg
            );
            
            // Retrier après mise à jour
            const sortedMessages = sortMessages(updatedMessages);
            setMessages(sortedMessages);
            
            return updatedMessage;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            await messageService.deleteMessage(messageId);
            const updatedMessages = messages.filter(msg => msg.id !== messageId);
            
            // Retrier après suppression
            const sortedMessages = sortMessages(updatedMessages);
            setMessages(sortedMessages);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        messages,
        loading,
        error,
        fetchMessages,
        sendMessage,
        updateMessage,
        deleteMessage
    };
};
