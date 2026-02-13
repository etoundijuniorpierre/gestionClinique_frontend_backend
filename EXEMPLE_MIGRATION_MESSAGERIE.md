# 📝 EXEMPLE CONCRET DE MIGRATION

## messagerieService.js - Avant/Après

Ce document montre **exactement** comment migrer le fichier `messagerieService.js` qui contient **35+ console.log**.

---

## 🎯 Objectif

Remplacer tous les `console.log` par le nouveau système de logging professionnel.

---

## 📊 Statistiques du Fichier

- **Fichier:** `react/src/services/messagerieService.js`
- **Lignes:** 817
- **Console.log:** 35+
- **Temps estimé:** 15-20 minutes

---

## 🔧 ÉTAPE 1: Ajouter l'Import du Logger

### ❌ AVANT (lignes 1-6)

```javascript
// src/services/messagerieService.js
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import { API_BASE } from "../composants/config/apiconfig";
import axios from "axios";
import { useState, useEffect } from "react";
```

### ✅ APRÈS

```javascript
// src/services/messagerieService.js
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import { API_BASE } from "../composants/config/apiconfig";
import axios from "axios";
import { useState, useEffect } from "react";
import logger from "../utils/logger"; // ✅ AJOUTÉ
```

---

## 🔧 ÉTAPE 2: Remplacer les Console.log d'Authentification

### ❌ AVANT (lignes 28-30)

```javascript
console.log("🔑 Token présent:", !!token);
console.log("👤 ID utilisateur:", userId);
console.log("🌐 URL de base:", API_BASE);
```

### ✅ APRÈS

```javascript
logger.debug("Auth", "Token présent:", !!token);
logger.debug("Auth", "ID utilisateur:", userId);
logger.debug("Config", "URL de base:", API_BASE);
```

**Explication:**

- `logger.debug()` = logs visibles uniquement en développement
- Premier paramètre = contexte (`'Auth'`, `'Config'`)
- Reste = identique à console.log

---

## 🔧 ÉTAPE 3: Remplacer les Intercepteurs Axios

### ❌ AVANT (lignes 41-48)

```javascript
// Intercepteur pour logger les requêtes
instance.interceptors.request.use((request) => {
  console.log("📤 Requête envoyée:", {
    method: request.method,
    url: request.url,
    headers: request.headers,
    data: request.data,
  });
  return request;
});
```

### ✅ APRÈS

```javascript
// Intercepteur pour logger les requêtes
instance.interceptors.request.use((request) => {
  logger.api(request.method.toUpperCase(), request.url, {
    headers: request.headers,
    data: request.data,
  });
  return request;
});
```

**Explication:**

- `logger.api()` = méthode spécialisée pour les requêtes API
- Paramètres: (méthode, url, données optionnelles)

---

### ❌ AVANT (lignes 52-70)

```javascript
// Intercepteur pour logger les réponses
instance.interceptors.response.use(
  (response) => {
    console.log("📥 Réponse reçue:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log("❌ Erreur de réponse:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
```

### ✅ APRÈS

```javascript
// Intercepteur pour logger les réponses
instance.interceptors.response.use(
  (response) => {
    logger.debug("API", "Réponse reçue:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    logger.error("API", "Erreur de réponse:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);
```

**Explication:**

- Succès = `logger.debug()` (visible en dev uniquement)
- Erreur = `logger.error()` (toujours visible, même en production)

---

## 🔧 ÉTAPE 4: Fonction de Diagnostic

### ❌ AVANT (lignes 86-90)

```javascript
console.log("🔍 Diagnostic d'authentification:", {
  hasToken: !!token,
  userId: userId,
  tokenLength: token ? token.length : 0,
});
```

### ✅ APRÈS

```javascript
logger.group("Diagnostic d'authentification");
logger.debug("Auth", "Token présent:", !!token);
logger.debug("Auth", "User ID:", userId);
logger.debug("Auth", "Token length:", token ? token.length : 0);
logger.groupEnd();
```

**Explication:**

- `logger.group()` = groupe visuellement les logs liés
- `logger.groupEnd()` = ferme le groupe

---

## 🔧 ÉTAPE 5: Services de Conversation

### ❌ AVANT (lignes 108-110)

```javascript
console.log("🔄 Tentative de récupération des conversations...");
const response = await createAxiosInstance().get("/chat/conversations");
console.log("✅ Conversations récupérées avec succès:", response.data);
```

### ✅ APRÈS

```javascript
logger.debug("Messagerie", "Récupération des conversations...");
const response = await createAxiosInstance().get("/chat/conversations");
logger.debug(
  "Messagerie",
  "Conversations récupérées:",
  response.data.length,
  "conversations"
);
```

---

### ❌ AVANT (lignes 113-122)

```javascript
console.error('❌ Erreur lors de la récupération des conversations:', error);

if (error.response) {
    // Erreur de réponse du serveur
    console.error('📊 Détails de l\'erreur:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
    });
```

### ✅ APRÈS

```javascript
logger.error('Messagerie', 'Erreur récupération conversations:', error.message);

if (error.response) {
    // Erreur de réponse du serveur
    logger.error('Messagerie', 'Détails erreur:', {
        status: error.response.status,
        data: error.response.data
    });
```

---

## 🔧 ÉTAPE 6: WebSocket

### ❌ AVANT (lignes 348-350)

```javascript
console.log("🔌 Tentative de connexion WebSocket pour l'utilisateur:", userId);
const wsBaseUrl = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
console.log("🌐 URL WebSocket:", `${wsBaseUrl}/ws`);
```

### ✅ APRÈS

```javascript
logger.websocket("Tentative de connexion", { userId });
const wsBaseUrl = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
logger.websocket("URL WebSocket", `${wsBaseUrl}/ws`);
```

**Explication:**

- `logger.websocket()` = méthode spécialisée pour les WebSocket

---

### ❌ AVANT (lignes 375-386)

```javascript
sock.onopen = () => {
  console.log("✅ Connexion SockJS établie");
};

sock.onclose = (event) => {
  console.log("🔌 Connexion SockJS fermée:", event);
  if (event.code !== 1000) {
    // Fermeture normale
    console.warn("⚠️ Fermeture anormale de SockJS:", event);
  }
};

sock.onerror = (error) => {
  console.error("❌ Erreur SockJS:", error);
};
```

### ✅ APRÈS

```javascript
sock.onopen = () => {
  logger.websocket("Connexion SockJS établie");
};

sock.onclose = (event) => {
  logger.websocket("Connexion SockJS fermée", { code: event.code });
  if (event.code !== 1000) {
    // Fermeture normale
    logger.warn("WebSocket", "Fermeture anormale", {
      code: event.code,
      reason: event.reason,
    });
  }
};

sock.onerror = (error) => {
  logger.error("WebSocket", "Erreur SockJS", error);
};
```

---

### ❌ AVANT (lignes 392-405)

```javascript
onConnect: () => {
    console.log("✅ Connecté au WebSocket STOMP");
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
```

### ✅ APRÈS

```javascript
onConnect: () => {
    logger.websocket('Connecté au WebSocket STOMP');
    reconnectAttempts = 0; // Réinitialiser les tentatives de reconnexion

    // S'abonner aux messages privés
    stompClient.subscribe(`/queue/user.${userId}`, (message) => {
        logger.websocket('Message privé reçu');
        try {
            const body = JSON.parse(message.body);
            logger.debug('WebSocket', 'Contenu message privé:', body);
            onMessageReceived(body);
        } catch (error) {
            logger.error('WebSocket', 'Erreur parsing message privé:', error.message);
            logger.error('WebSocket', 'Message brut:', message.body);
        }
    });
```

---

## 🔧 ÉTAPE 7: Hooks Personnalisés

### ❌ AVANT (lignes 571-576)

```javascript
console.log(
  "📅 Conversations triées par date:",
  sortedConversations.map((c) => ({
    id: c.id,
    lastMessageAt: c.lastMessageAt,
    creationDate: c.creationDate,
    createdAt: c.createdAt,
  }))
);
```

### ✅ APRÈS

```javascript
logger.debug(
  "Messagerie",
  "Conversations triées:",
  sortedConversations.length,
  "conversations"
);
```

**Explication:**

- Éviter de logger des objets complexes en production
- Logger seulement les informations essentielles (nombre d'éléments)

---

### ❌ AVANT (lignes 635-642)

```javascript
console.log(`📨 Message reçu en temps réel pour la conversation ${conversationId}:`, action, message);

if (action === 'ADD') {
    // Vérifier si le message n'existe pas déjà pour éviter les doublons
    setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === message.id);
        if (messageExists) {
            console.log('⚠️ Message déjà présent, ignoré:', message.id);
            return prev;
        }
```

### ✅ APRÈS

```javascript
logger.debug('Messagerie', `Message temps réel (${action})`, { conversationId, messageId: message.id });

if (action === 'ADD') {
    // Vérifier si le message n'existe pas déjà pour éviter les doublons
    setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === message.id);
        if (messageExists) {
            logger.debug('Messagerie', 'Message déjà présent, ignoré', message.id);
            return prev;
        }
```

---

## ✅ RÉSULTAT FINAL

### Statistiques de Migration

| Métrique               | Avant  | Après |
| ---------------------- | ------ | ----- |
| **console.log**        | 35+    | 0 ✅  |
| **logger.debug**       | 0      | ~25   |
| **logger.error**       | 0      | ~8    |
| **logger.websocket**   | 0      | ~10   |
| **logger.api**         | 0      | ~2    |
| **Logs en production** | 35+ ❌ | 0 ✅  |

---

## 🧪 TESTER LA MIGRATION

### 1. Vérifier qu'il ne reste aucun console.log

```powershell
Get-ChildItem -Path "react\src\services\messagerieService.js" |
    Select-String -Pattern "console\.log"
```

**Résultat attendu:** Aucun résultat

---

### 2. Tester en développement

```powershell
cd react
npm run dev
```

**Vérifications:**

1. Ouvrir la console du navigateur
2. Se connecter à l'application
3. Ouvrir la messagerie
4. Vérifier que les logs apparaissent avec le format:
   ```
   [GestionClinique] 2026-01-04T16:45:23.123Z DEBUG [Auth] Token présent: true
   [GestionClinique] 2026-01-04T16:45:23.456Z DEBUG [Messagerie] Conversations récupérées: 5 conversations
   ```

---

### 3. Tester en production

```powershell
cd react
npm run build
npm run preview
```

**Vérifications:**

1. Ouvrir la console du navigateur
2. Se connecter à l'application
3. Ouvrir la messagerie
4. Vérifier qu'**AUCUN** log DEBUG n'apparaît
5. Seuls les ERROR doivent être visibles

---

## 📋 CHECKLIST DE MIGRATION

- [ ] Import du logger ajouté (ligne 7)
- [ ] Console.log d'auth remplacés (lignes 28-30)
- [ ] Intercepteurs Axios migrés (lignes 41-70)
- [ ] Fonction de diagnostic migrée (lignes 86-90)
- [ ] Services de conversation migrés (lignes 108-195)
- [ ] WebSocket migrés (lignes 348-540)
- [ ] Hooks personnalisés migrés (lignes 547-817)
- [ ] Aucun console.log restant (vérification PowerShell)
- [ ] Tests en développement réussis
- [ ] Tests en production réussis (aucun log DEBUG)

---

## 🎯 PROCHAINES ÉTAPES

Après avoir migré `messagerieService.js`, appliquer le même pattern à:

1. `notificationService.js` (10+ console.log)
2. `polyfills.js` (1 console.log)
3. Tous les composants de pages
4. Tous les autres composants

**Temps total estimé:** 2-3 heures pour tout le projet

---

**Dernière mise à jour:** 2026-01-04  
**Fichier exemple:** messagerieService.js  
**Statut:** ✅ Prêt pour migration
