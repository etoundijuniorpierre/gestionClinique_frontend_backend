# 🔄 GUIDE DE MIGRATION: Console.log → Logger

## Comment remplacer tous les console.log par le nouveau système de logging

---

## 📚 Table des Matières

1. [Introduction](#introduction)
2. [Import du Logger](#import-du-logger)
3. [Exemples de Migration](#exemples-de-migration)
4. [Patterns Courants](#patterns-courants)
5. [Checklist de Migration](#checklist-de-migration)

---

## Introduction

Le nouveau système de logging offre plusieurs avantages:

- ✅ **Désactivation automatique en production** (sécurité)
- ✅ **Contexte et timestamp** pour chaque log
- ✅ **Niveaux de log** (DEBUG, INFO, WARN, ERROR)
- ✅ **Méthodes spécialisées** (API, WebSocket, Auth, etc.)
- ✅ **Performance** (pas de logs inutiles en production)

---

## Import du Logger

### Dans chaque fichier où vous utilisez console.log:

```javascript
// Ajouter en haut du fichier
import logger from "@/utils/logger";

// OU avec chemin relatif si les alias ne sont pas configurés
import logger from "../../utils/logger";
```

---

## Exemples de Migration

### 1. Console.log Simple

**❌ AVANT:**

```javascript
console.log("Utilisateur connecté:", user);
```

**✅ APRÈS:**

```javascript
logger.debug("Auth", "Utilisateur connecté:", user);
```

---

### 2. Console.log avec Emojis (Messagerie)

**❌ AVANT:**

```javascript
console.log("🔑 Token présent:", !!token);
console.log("👤 ID utilisateur:", userId);
console.log("🌐 URL de base:", API_BASE);
```

**✅ APRÈS:**

```javascript
logger.debug("Auth", "Token présent:", !!token);
logger.debug("Auth", "ID utilisateur:", userId);
logger.debug("Config", "URL de base:", API_BASE);
```

---

### 3. Requêtes API

**❌ AVANT:**

```javascript
console.log("📤 Requête envoyée:", {
  method: "GET",
  url: "/api/conversations",
  headers,
});
```

**✅ APRÈS:**

```javascript
logger.api("GET", "/api/conversations", { headers });
```

---

### 4. WebSocket

**❌ AVANT:**

```javascript
console.log("🔌 Tentative de connexion WebSocket pour l'utilisateur:", userId);
console.log("✅ Connexion SockJS établie");
```

**✅ APRÈS:**

```javascript
logger.websocket("Tentative de connexion", { userId });
logger.websocket("Connexion SockJS établie");
```

---

### 5. Notifications

**❌ AVANT:**

```javascript
console.log("🔔 Ajout d'une nouvelle notification:", {
  type: notification.type,
  message: notification.message,
});
```

**✅ APRÈS:**

```javascript
logger.notification(notification.type, notification.message);
```

---

### 6. Erreurs

**❌ AVANT:**

```javascript
console.log("❌ Erreur de réponse:", {
  status: error.response?.status,
  message: error.message,
});
```

**✅ APRÈS:**

```javascript
logger.error("API", "Erreur de réponse:", {
  status: error.response?.status,
  message: error.message,
});
```

---

### 7. Groupes de Logs

**❌ AVANT:**

```javascript
console.log("=== Diagnostic d'authentification ===");
console.log("Token:", token);
console.log("User ID:", userId);
console.log("Role:", role);
console.log("=====================================");
```

**✅ APRÈS:**

```javascript
logger.group("Diagnostic d'authentification");
logger.debug("Auth", "Token:", token);
logger.debug("Auth", "User ID:", userId);
logger.debug("Auth", "Role:", role);
logger.groupEnd();
```

---

### 8. Mesure de Performance

**❌ AVANT:**

```javascript
const start = Date.now();
// ... opération longue ...
console.log("Durée:", Date.now() - start, "ms");
```

**✅ APRÈS:**

```javascript
logger.time("Opération longue");
// ... opération longue ...
logger.timeEnd("Opération longue");
```

---

## Patterns Courants

### messagerieService.js

**Fichier:** `src/services/messagerieService.js`  
**Console.log à remplacer:** 35+

**Pattern de remplacement:**

```javascript
// En haut du fichier
import logger from '../utils/logger';

// Remplacer tous les console.log par:
logger.debug('Messagerie', ...);  // Pour les logs généraux
logger.api('GET/POST', url, data);  // Pour les requêtes API
logger.websocket(event, data);  // Pour les WebSocket
logger.error('Messagerie', ...);  // Pour les erreurs
```

---

### notificationService.js

**Fichier:** `src/services/notificationService.js`  
**Console.log à remplacer:** 10+

**Pattern de remplacement:**

```javascript
// En haut du fichier
import logger from '../utils/logger';

// Remplacer tous les console.log par:
logger.notification(type, message);  // Pour les notifications
logger.debug('Notification', ...);  // Pour les logs généraux
```

---

### Composants de Pages

**Fichiers:** `src/pages/*.jsx`, `src/composants/**/*.jsx`

**Pattern de remplacement:**

```javascript
// En haut du fichier
import logger from "@/utils/logger";

// Dans les useEffect et fonctions:
logger.debug("ComponentName", "Message", data);
logger.info("ComponentName", "Action importante");
logger.warn("ComponentName", "Avertissement");
logger.error("ComponentName", "Erreur", error);
```

---

## Checklist de Migration

### Fichiers Prioritaires (35+ console.log chacun)

- [ ] `src/services/messagerieService.js` (35+ logs)
- [ ] `src/services/notificationService.js` (10+ logs)
- [ ] `src/pages/pagelogin.jsx`
- [ ] `src/pages/pagemedecin.jsx`
- [ ] `src/pages/pageadmin.jsx`
- [ ] `src/pages/pagesecretaire.jsx`

### Composants Administrateur

- [ ] `src/composants/administrateur/dashboard.jsx`
- [ ] `src/composants/administrateur/patients.jsx`
- [ ] `src/composants/administrateur/utilisateurs.jsx`
- [ ] `src/composants/administrateur/formulairepatient.jsx`
- [ ] `src/composants/administrateur/formulaireutilisateur.jsx`

### Composants Médecin

- [ ] `src/composants/medecin/rendezvousmedecin.jsx`
- [ ] `src/composants/medecin/dossiermedical.jsx`
- [ ] `src/composants/medecin/calendriermedecin.jsx`
- [ ] `src/composants/medecin/formulaireconsultation.jsx`

### Composants Secrétaire

- [ ] `src/composants/secretaire/rendezvoussecretaire.jsx`
- [ ] `src/composants/secretaire/patientsecretaire.jsx`
- [ ] `src/composants/secretaire/facture.jsx`
- [ ] `src/composants/secretaire/formulairerendezvous.jsx`
- [ ] `src/composants/secretaire/formulairefacture.jsx`

### Composants Chat

- [ ] `src/composants/chat/ChatContainer.jsx`
- [ ] `src/composants/chat/MessageList.jsx`
- [ ] `src/composants/chat/ConversationList.jsx`

### Autres Fichiers

- [ ] `src/polyfills.js`
- [ ] `src/composants/barrehorizontal1.jsx`
- [ ] `src/composants/photoprofil.jsx`

---

## Script de Recherche

Pour trouver tous les console.log restants:

```powershell
# PowerShell
Get-ChildItem -Path "react\src" -Recurse -Include *.js,*.jsx |
    Select-String -Pattern "console\.log" |
    Group-Object Path |
    Select-Object Count, Name |
    Sort-Object Count -Descending
```

```bash
# Bash/Git Bash
grep -r "console\.log" react/src --include="*.js" --include="*.jsx" |
    cut -d: -f1 |
    sort |
    uniq -c |
    sort -rn
```

---

## Vérification Finale

Après migration, vérifier qu'il ne reste aucun console.log:

```powershell
# PowerShell - Doit retourner 0 résultats
(Get-ChildItem -Path "react\src" -Recurse -Include *.js,*.jsx |
    Select-String -Pattern "console\.log").Count
```

---

## Configuration du Logger en Production

Le logger est automatiquement configuré selon l'environnement:

- **Développement (`npm run dev`)**: Tous les logs sont affichés
- **Production (`npm run build`)**: Seuls les ERROR sont affichés

Pour changer le niveau manuellement (console navigateur):

```javascript
// Activer tous les logs
window.__logger.setLevel("DEBUG");

// Désactiver tous les logs
window.__logger.setLevel("NONE");
```

---

## Support

Pour toute question sur la migration:

1. Consulter `src/utils/logger.js` pour voir tous les méthodes disponibles
2. Consulter `AUDIT_CLEAN_CODE_SENIOR.md` pour le contexte complet
3. Tester en développement avant de commit

---

**Dernière mise à jour:** 2026-01-04  
**Version du Logger:** 1.0.0
