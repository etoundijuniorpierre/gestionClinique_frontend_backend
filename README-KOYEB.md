# Déploiement sur Koyeb - Guide de Production

## 🚀 Prérequis

- Compte Koyeb avec accès PostgreSQL
- Domaine configuré (optionnel)
- Secrets générés pour la production

## 🔧 Configuration des variables d'environnement Koyeb

### Base de données Neon (déjà configurée)
- **URL**: `jdbc:postgresql://ep-bitter-waterfall-aif4chkq-pooler.c-4.us-east-1.aws.neon.tech/clinique?user=neondb_owner&password=npg_I5YSvgBqCNb7&sslmode=require&channelBinding=require`
- **Username**: `neondb_owner`
- **Password**: `npg_I5YSvgBqCNb7`

### Secrets requis
**JWT Secret généré et sécurisé :**
```
VCZtezNVbZ4f/Vyo+XTC02AyT9B83tITwXdM87YromU=
```

### Variables à configurer dans Koyeb
- `JWT_SECRET`: `VCZtezNVbZ4f/Vyo+XTC02AyT9B83tITwXdM87YromU=`

## 📦 Déploiement

### Option 1: Via koyeb.yml
1. Pousser le code sur GitHub/GitLab
2. Connecter le repository à Koyeb
3. Utiliser le fichier `koyeb.yml`

### Option 2: Interface Koyeb
1. Créer service Backend (Docker)
2. Créer service Frontend (Docker)
3. Configurer les routes

## 🔍 Vérifications post-déploiement

### Health checks
- Backend: `https://votre-domaine.koyeb.app/actuator/health`
- Frontend: `https://votre-domaine.koyeb.app/`

### Tests critiques
- Connexion administrateur
- Upload de fichiers
- WebSockets (messagerie)
- Génération PDF

## 🛡️ Sécurité

- JWT secret configuré
- HTTPS activé
- Headers sécurité Nginx
- Non-root user containers
- ⚠️ Valider les CORS en production

## 📊 Monitoring

- Logs Koyeb intégrés
- Health checks automatiques
- Métriques Spring Actuator

## 🔧 Maintenance

- Backups automatiques Neon PostgreSQL
- Mises à jour via CI/CD
- Monitoring des performances
