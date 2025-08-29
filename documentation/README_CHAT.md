# Système de Chat - Gestion Clinique

## Vue d'ensemble

Le système de chat intégré permet aux utilisateurs (Administrateurs, Médecins, Secrétaires) de communiquer en temps réel via des conversations directes et des groupes. Le système utilise WebSocket pour les communications en temps réel et offre une interface moderne et intuitive.

## Fonctionnalités

### 🗨️ Conversations Directes
- Création de conversations privées entre deux utilisateurs
- Messages en temps réel avec indicateurs de statut (envoyé/lu)
- Historique des conversations avec pagination
- Recherche d'utilisateurs pour démarrer de nouvelles conversations

### 👥 Groupes
- Création de groupes avec plusieurs membres
- Gestion des membres (ajout/suppression)
- Messages de groupe avec identification de l'expéditeur
- Nom et description personnalisables

### ✏️ Gestion des Messages
- Envoi de messages texte
- Modification de ses propres messages
- Suppression de ses propres messages
- Historique des modifications
- Indicateurs de lecture

### 🔔 Notifications
- Notifications en temps réel pour nouveaux messages
- Compteurs de messages non lus
- Marquage automatique comme lu lors de l'ouverture d'une conversation

### 📱 Interface Responsive
- Design moderne et intuitif
- Interface adaptée mobile/desktop
- Navigation fluide entre conversations
- Recherche et filtrage

## Architecture Technique

### Frontend (React)
```
src/composants/chat/
├── ChatContainer.jsx          # Composant principal
├── ConversationList.jsx       # Liste des conversations
├── ChatWindow.jsx            # Fenêtre de chat
├── ChatHeader.jsx            # En-tête de conversation
├── MessageList.jsx           # Liste des messages
├── MessageItem.jsx           # Message individuel
├── MessageInput.jsx          # Zone de saisie
├── UserList.jsx              # Liste des utilisateurs
├── CreateGroupModal.jsx      # Modal création de groupe
└── LoadMoreButton.jsx        # Bouton charger plus
```

### Services
```
src/services/messagerieService.js
├── conversationService        # Gestion des conversations
├── messageService            # Gestion des messages
├── groupService              # Gestion des groupes
├── userService               # Gestion des utilisateurs
└── WebSocket                 # Communication temps réel
```

### Backend (Spring Boot)
```
Controllers:
├── ChatController            # Endpoints REST
└── WebSocketConfig          # Configuration WebSocket

Services:
├── ChatService              # Logique métier
└── Mappers                  # Conversion DTO

DTOs:
├── ConversationRequestDto   # Création conversation
├── MessageRequestDto        # Envoi message
├── GroupeRequestDto         # Création groupe
└── Response DTOs            # Réponses API
```

## Installation et Configuration

### Prérequis
- Node.js 16+
- React 19+
- Spring Boot 3+
- Base de données (MySQL/PostgreSQL)

### Installation Frontend
```bash
npm install
npm run dev
```

### Dépendances Frontend
```json
{
  "@stomp/stompjs": "^7.1.1",
  "sockjs-client": "^1.6.1",
  "styled-components": "^6.1.19",
  "axios": "^1.11.0"
}
```

### Configuration Backend
Assurez-vous que les endpoints suivants sont disponibles :
- `POST /chat/conversations` - Créer une conversation
- `GET /chat/conversations` - Lister les conversations
- `POST /chat/messages` - Envoyer un message
- `GET /chat/conversations/{id}/messages` - Récupérer les messages
- `PUT /chat/messages/{id}` - Modifier un message
- `DELETE /chat/messages/{id}` - Supprimer un message
- `POST /chat/groups` - Créer un groupe
- `GET /utilisateurs` - Lister les utilisateurs

## Utilisation

### Accès au Chat
1. Connectez-vous avec votre compte (Admin/Médecin/Secrétaire)
2. Cliquez sur "Chat" dans le menu de navigation
3. Le chat s'ouvre dans une nouvelle page

### Créer une Conversation Directe
1. Cliquez sur "Nouveau" dans la barre latérale
2. Recherchez un utilisateur dans la liste
3. Cliquez sur l'utilisateur pour démarrer la conversation

### Créer un Groupe
1. Cliquez sur "Groupe" dans la barre latérale
2. Remplissez le nom et la description
3. Sélectionnez les membres
4. Cliquez sur "Créer le groupe"

### Envoyer un Message
1. Sélectionnez une conversation
2. Tapez votre message dans la zone de saisie
3. Appuyez sur Entrée ou cliquez sur le bouton d'envoi

### Modifier/Supprimer un Message
1. Survolez votre message
2. Cliquez sur l'icône d'édition (✏️) ou de suppression (🗑️)
3. Pour l'édition : modifiez le texte et sauvegardez
4. Pour la suppression : confirmez l'action

## Fonctionnalités Avancées

### WebSocket
- Connexion automatique lors de l'ouverture du chat
- Réception en temps réel des nouveaux messages
- Gestion des déconnexions/reconnexions
- Notifications push pour messages non lus

### Pagination
- Chargement automatique des messages plus anciens
- Bouton "Charger plus" pour l'historique
- Optimisation des performances

### Sécurité
- Authentification requise pour tous les endpoints
- Vérification des permissions par rôle
- Protection contre la modification/suppression de messages d'autres utilisateurs

### Performance
- Lazy loading des conversations
- Mise en cache des utilisateurs
- Optimisation des requêtes API

## Personnalisation

### Styles
Les styles sont gérés avec styled-components et peuvent être personnalisés dans chaque composant.

### Configuration API
Modifiez `src/composants/config/apiconfig.jsx` pour changer l'URL de l'API.

### WebSocket
La configuration WebSocket se trouve dans `src/services/messagerieService.js`.

## Dépannage

### Problèmes de Connexion WebSocket
- Vérifiez que le serveur backend est démarré
- Contrôlez les logs de la console pour les erreurs
- Assurez-vous que l'URL WebSocket est correcte

### Messages qui ne s'envoient pas
- Vérifiez votre connexion internet
- Contrôlez que vous êtes bien authentifié
- Regardez les erreurs dans la console

### Interface qui ne se charge pas
- Vérifiez que toutes les dépendances sont installées
- Contrôlez les erreurs JavaScript dans la console
- Assurez-vous que l'API backend répond

## Support

Pour toute question ou problème :
1. Vérifiez les logs de la console
2. Contrôlez la documentation de l'API
3. Consultez les logs du serveur backend

## Évolutions Futures

- [ ] Envoi de fichiers/images
- [ ] Messages vocaux
- [ ] Statut en ligne/hors ligne
- [ ] Notifications push navigateur
- [ ] Emojis et réactions
- [ ] Messages éphémères
- [ ] Chiffrement end-to-end
