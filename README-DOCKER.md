# 🐳 Guide Docker - Système de Gestion Clinique

## 📋 Prérequis

- **Docker Desktop** installé et démarré

  - Windows: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Minimum 4GB RAM alloués à Docker
  - WSL 2 activé (Windows)

- **Git** (pour cloner le projet)

---

## 🚀 Démarrage Rapide (Une Seule Commande!)

### 1. Cloner le projet (si pas déjà fait)

```bash
git clone [URL_DU_REPO]
cd gestionClinique_frontend_backend
```

### 2. Créer le fichier .env

```bash
# Copier le template
cp .env.example .env

# Éditer .env et changer JWT_SECRET en production!
```

### 3. Renommer les fichiers dockerignore

```bash
# Frontend
cd react
ren dockerignore.txt .dockerignore
cd ..

# Backend
cd springBoot
ren dockerignore.txt .dockerignore
cd ..
```

### 4. Lancer l'application complète

```bash
docker-compose up --build
```

**C'est tout!** 🎉

L'application sera accessible sur:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:2025/api
- **Swagger**: http://localhost:2025/swagger-ui/index.html
- **PostgreSQL**: localhost:5432

---

## 📊 Vérification du Démarrage

### Voir les logs en temps réel

```bash
docker-compose logs -f
```

### Vérifier l'état des services

```bash
docker-compose ps
```

Vous devriez voir:

```
NAME                  STATUS
clinique_db          Up (healthy)
clinique_backend     Up (healthy)
clinique_frontend    Up (healthy)
```

### Tester les services

**Frontend:**

```bash
curl http://localhost
```

**Backend Health:**

```bash
curl http://localhost:2025/actuator/health
```

**Database:**

```bash
docker-compose exec postgres psql -U postgres -d clinique -c "SELECT COUNT(*) FROM patient;"
```

---

## 🔐 Connexion par Défaut

- **Email**: admin@gmail.com
- **Mot de passe**: administrateur

---

## 🛠️ Commandes Utiles

### Arrêter l'application

```bash
docker-compose down
```

### Arrêter ET supprimer les données

```bash
docker-compose down -v
```

### Redémarrer un service spécifique

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres
```

### Voir les logs d'un service

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Reconstruire après modifications du code

```bash
# Reconstruire tout
docker-compose up --build

# Reconstruire un service spécifique
docker-compose up --build backend
docker-compose up --build frontend
```

### Accéder au shell d'un conteneur

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# Database
docker-compose exec postgres psql -U postgres -d clinique
```

---

## 🔧 Configuration Avancée

### Variables d'Environnement (.env)

Créez un fichier `.env` à la racine du projet:

```env
# Database
POSTGRES_DB=clinique
POSTGRES_USER=postgres
POSTGRES_PASSWORD=votre_mot_de_passe_securise
POSTGRES_PORT=5432

# Backend
BACKEND_PORT=2025
SPRING_PROFILES_ACTIVE=docker

# JWT (IMPORTANT: Changez ceci en production!)
JWT_SECRET=votre-cle-secrete-tres-longue-minimum-256-bits

# Frontend
FRONTEND_PORT=80
```

### Profils Spring

Le backend utilise le profil `docker` par défaut. Pour changer:

```bash
SPRING_PROFILES_ACTIVE=prod docker-compose up
```

---

## 📦 Architecture Docker

### Services

1. **postgres** (PostgreSQL 14)

   - Port: 5432
   - Volume persistant: `postgres_data`
   - Initialisation: `database.sql`

2. **backend** (Spring Boot)

   - Port: 2025
   - Build multi-stage (Maven + JRE 21)
   - Health check: `/actuator/health`

3. **frontend** (React + Nginx)
   - Port: 80
   - Build multi-stage (Node + Nginx)
   - Proxy API vers backend
   - Support WebSocket

### Réseau

Tous les services communiquent via le réseau `clinique-network`.

### Volumes

- `postgres_data`: Données PostgreSQL persistantes

---

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend

**Vérifier:**

```bash
# Backend est-il accessible?
curl http://localhost:2025/actuator/health

# Vérifier les logs
docker-compose logs backend
```

### Erreur de connexion à la base de données

**Vérifier:**

```bash
# PostgreSQL est-il démarré?
docker-compose ps postgres

# Tester la connexion
docker-compose exec postgres psql -U postgres -d clinique -c "SELECT 1;"
```

### Port déjà utilisé

**Solution:**

```bash
# Changer les ports dans .env
FRONTEND_PORT=8080
BACKEND_PORT=8025
POSTGRES_PORT=5433

# Relancer
docker-compose down
docker-compose up
```

### Problème de build

**Solution:**

```bash
# Nettoyer tout
docker-compose down -v
docker system prune -a

# Reconstruire
docker-compose build --no-cache
docker-compose up
```

### Logs d'erreur

**Voir tous les logs:**

```bash
docker-compose logs --tail=100
```

**Logs d'un service spécifique:**

```bash
docker-compose logs --tail=50 backend
```

---

## 🔄 Mise à Jour du Code

Après modification du code:

```bash
# 1. Arrêter les services
docker-compose down

# 2. Reconstruire
docker-compose build

# 3. Redémarrer
docker-compose up
```

Ou en une commande:

```bash
docker-compose up --build
```

---

## 🚀 Déploiement en Production

### 1. Sécuriser les secrets

**Ne JAMAIS commiter .env!**

Créez un `.env` de production avec:

- Mot de passe PostgreSQL fort
- JWT secret de 256+ bits
- Désactiver debug mode

### 2. Optimiser les images

```bash
# Build optimisé
docker-compose -f docker-compose.prod.yml build

# Vérifier la taille
docker images | grep clinique
```

### 3. Utiliser un reverse proxy

Ajoutez Traefik ou Nginx en reverse proxy pour:

- HTTPS/SSL
- Load balancing
- Rate limiting

---

## 📊 Monitoring

### Voir l'utilisation des ressources

```bash
docker stats
```

### Health checks

Tous les services ont des health checks automatiques:

- Frontend: `http://localhost/`
- Backend: `http://localhost:2025/actuator/health`
- Database: `pg_isready`

---

## 🧹 Nettoyage

### Supprimer les conteneurs et volumes

```bash
docker-compose down -v
```

### Nettoyer Docker complètement

```bash
# Attention: Supprime TOUTES les images/conteneurs non utilisés
docker system prune -a --volumes
```

---

## 📝 Notes Importantes

1. **Première exécution**: Le build peut prendre 5-10 minutes
2. **Données**: Les données PostgreSQL sont persistantes (volume Docker)
3. **Hot reload**: Non disponible en mode Docker (rebuild requis)
4. **Développement**: Pour le dev, utilisez `npm run dev` et `mvn spring-boot:run` localement

---

## 🆘 Support

En cas de problème:

1. Vérifier les logs: `docker-compose logs`
2. Vérifier l'état: `docker-compose ps`
3. Redémarrer: `docker-compose restart`
4. Reconstruire: `docker-compose up --build`

---

## ✅ Checklist de Démarrage

- [ ] Docker Desktop installé et démarré
- [ ] Fichier `.env` créé et configuré
- [ ] Fichiers `.dockerignore` renommés
- [ ] `docker-compose up --build` exécuté
- [ ] Frontend accessible sur http://localhost
- [ ] Backend accessible sur http://localhost:2025
- [ ] Connexion réussie avec admin@gmail.com

---

**Version**: 1.0.0  
**Dernière mise à jour**: Janvier 2026
