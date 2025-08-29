# Système de Gestion Clinique

Login Par default  : 
Email : admin@gmail.com
Mot de passe : administrateur

## 🏥 Vue d'ensemble

Le **Système de Gestion Clinique** est une application web moderne développée en React qui permet la gestion complète d'une clinique médicale. L'application offre des fonctionnalités spécialisées pour trois rôles distincts : Administrateur, Médecin et Secrétaire.

## 🎯 Fonctionnalités Principales

### 🔐 Authentification et Sécurité
- **Système de connexion sécurisé** avec gestion des rôles
- **Routes protégées** selon les permissions utilisateur
- **Session sécurisée** avec déconnexion automatique
- **Interface responsive** adaptée à tous les appareils

### 👥 Gestion Multi-Rôles
- **Administrateur** : Gestion complète du système, utilisateurs et patients
- **Médecin** : Consultations, dossiers médicaux, prescriptions
- **Secrétaire** : Rendez-vous, facturation, gestion des patients

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Navigateur web moderne

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]

# Accéder au répertoire
cd projet_01

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm run dev
```

### Accès à l'application
- **URL locale** : http://localhost:5173
- **Page de connexion** : http://localhost:5173/

## 📋 Structure du Projet

```
projet_01/
├── src/
│   ├── composants/
│   │   ├── administrateur/     # Composants pour l'admin
│   │   ├── medecin/           # Composants pour les médecins
│   │   ├── secretaire/        # Composants pour les secrétaires
│   │   ├── shared/            # Composants partagés
│   │   └── config/            # Configuration et services
│   ├── pages/                 # Pages principales
│   ├── services/              # Services API
│   └── styles/                # Fichiers CSS
├── public/                    # Fichiers statiques
└── package.json              # Dépendances et scripts
```

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Gestion Clinique
```

### Configuration API
L'application se connecte à une API backend. Assurez-vous que :
- L'API backend est en cours d'exécution
- Les endpoints sont correctement configurés
- Les CORS sont configurés pour permettre les requêtes

## 📱 Rôles et Permissions

### 👨‍💼 Administrateur
- **Accès complet** à toutes les fonctionnalités
- **Gestion des utilisateurs** : Création, modification, suppression
- **Gestion des patients** : Dossiers complets, historique
- **Tableau de bord** : Statistiques et monitoring
- **Configuration système** : Paramètres et sécurité

### 👨‍⚕️ Médecin
- **Consultations** : Création et gestion des consultations
- **Dossiers médicaux** : Accès aux dossiers patients
- **Prescriptions** : Création de prescriptions médicales
- **Rendez-vous** : Consultation de son planning
- **Messagerie** : Communication avec l'équipe

### 👩‍💼 Secrétaire
- **Gestion des rendez-vous** : Planification et modification
- **Patients** : Enregistrement et mise à jour
- **Facturation** : Création et gestion des factures
- **Calendrier** : Vue d'ensemble des rendez-vous
- **Messagerie** : Communication interne

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** : Framework principal
- **React Router** : Navigation et routage
- **Axios** : Requêtes HTTP
- **CSS Modules** : Styling modulaire
- **Vite** : Build tool et serveur de développement

### Fonctionnalités
- **Responsive Design** : Adaptation mobile/desktop
- **Notifications** : Système de notifications en temps réel
- **Loading States** : États de chargement
- **Formulaires** : Validation et gestion des erreurs
- **Pagination** : Navigation dans les listes

## 📊 Fonctionnalités Avancées

### 🔔 Système de Notifications
- Notifications en temps réel
- Alertes importantes
- Historique des notifications

### 📅 Calendrier Intégré
- Vue calendrier interactive
- Gestion des rendez-vous
- Filtres par date et médecin

### 💬 Messagerie Interne
- Communication entre utilisateurs
- Envoi de messages privés
- Historique des conversations

### 📄 Génération de Documents
- Factures PDF
- Prescriptions médicales
- Rapports et statistiques

## 🔒 Sécurité

### Authentification
- **JWT Tokens** : Authentification sécurisée
- **Refresh Tokens** : Renouvellement automatique
- **Déconnexion automatique** : Sécurité des sessions

### Autorisation
- **Contrôle d'accès basé sur les rôles** (RBAC)
- **Routes protégées** selon les permissions
- **Validation côté client et serveur**

## 📈 Performance

### Optimisations
- **Lazy Loading** : Chargement à la demande
- **Code Splitting** : Division du bundle
- **Memoization** : Optimisation des re-renders
- **Compression** : Réduction de la taille des assets

```

## 🚀 Déploiement

### Build de Production
```bash
# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview
```

### Environnements
- **Développement** : `npm run dev`
- **Production** : `npm run build`
- **Prévisualisation** : `npm run preview`

## 📞 Support et Maintenance

### Documentation
- **README Administrateur** : Guide complet pour les admins
- **README Médecin** : Guide pour les médecins
- **README Secrétaire** : Guide pour les secrétaires

### Maintenance
- **Mises à jour régulières** des dépendances
- **Sauvegardes automatiques** des données
- **Monitoring** des performances

## 🔗 Références Techniques

### Documentation Complète
- **Documentation Technique** : [Plateforme de Gestion de Clinique Médicale](https://docs.google.com/document/d/11CkpRdISp8IFbqysINgZKNNlVGT6uu5ThWbM-rl8JLQ/edit?tab=t.0)

### Architecture Technique
- **Frontend** : React avec Vite
- **Backend** : Spring Boot 3 avec JWT + Spring Security
- **Base de données** : PostgreSQL
- **Communication temps réel** : WebSockets STOMP
- **Génération de documents** : PDF pour factures et prescriptions

### Modèle de Données
- **Entités principales** : Patient, DossierMedical, Consultation, Prescription, RendezVous, Facture, Utilisateur
- **Relations** : OneToOne, OneToMany, ManyToMany selon les besoins métier
- **Contraintes** : Unicité des emails, prévention des doublons de RDV
- **Statuts** : CONFIRME, EN_ATTENTE, TERMINE, ANNULE, NO_SHOW pour les RDV

### Contrôles Métier Implémentés
- **Validation des RDV** : Prévention des doubles réservations
- **Gestion des paiements** : RDV non payés supprimés automatiquement
- **Intégrité référentielle** : Relations obligatoires entre entités
- **Traçabilité** : HistoriqueAction pour toutes les opérations critiques

## 🤝 Contribution

### Développement
1. Fork du projet
2. Création d'une branche feature
3. Développement des fonctionnalités
4. Tests et validation
5. Pull Request

### Standards de Code
- **ESLint** : Linting du code
- **Prettier** : Formatage automatique
- **Conventions** : Nommage et structure

## 📄 Licence

Ce projet est sous licence [LICENCE]. Voir le fichier LICENSE pour plus de détails.

## 👥 Équipe

- **Développeurs** : Équipe de développement
- **Designers** : Interface utilisateur
- **Testeurs** : Assurance qualité

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Support** : support@clinique.com
