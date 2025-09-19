Système de Gestion Clinique — Guide Full‑Stack (React + Spring Boot)


Login par défaut :
• Email : admin@gmail.com
• Mot de passe : administrateur


🏥 Vue d'ensemble

Le Système de Gestion Clinique est une application web moderne développée en React (Frontend) et Spring Boot 3 (Backend, JDK 21). Elle couvre la gestion des utilisateurs, patients, rendez‑vous, consultations, facturation, messagerie et notifications. Trois rôles sont supportés : Administrateur, Médecin et Secrétaire.

🎯 Fonctionnalités principales

🔐 Authentification et Sécurité
• Connexion sécurisée avec rôles (RBAC)
• Routes protégées (Frontend) + filtres de sécurité (Backend)
• Sessions via JWT (access + refresh)
• Interface responsive (mobile, tablette, desktop)

👥 Gestion Multi‑Rôles
• Administrateur : gestion système, utilisateurs, patients, tableaux de bord
• Médecin : consultations, dossiers médicaux, prescriptions, planning
• Secrétaire : rendez‑vous, facturation, gestion des patients

🧰 Pile technologique

Frontend
• React 18, React Router, Axios, CSS Modules

Backend
• Spring Boot 3, JDK 21, Maven
• Spring Security, JWT, Validation, Data JPA
• PostgreSQL, WebSockets (STOMP) pour temps réel
• Génération de PDF (factures, prescriptions)
• Fichiers de configuration en application.properties (pas YAML)

🚀 Installation et Démarrage

Prérequis
• Node.js 16+ et npm/yarn
• JDK 21 (JAVA_HOME configuré)
• Maven 3.9+
• PostgreSQL 14+ (base et utilisateur)

Installation — Frontend
# Cloner le projet
git clone [URL_DU_REPO]

# Installer et démarrer
npm install
npm run dev

# Accès
http://localhost:5173
Installation — Backend (Spring Boot 3, JDK 21)
# Depuis la racine du backend
mvn clean install
mvn spring-boot:run

# Par défaut
# API: http://localhost:2025
# Swagger: http://localhost:2025/swagger-ui/index.html

🔧 Configuration
Frontend — .env
API_BASE_URL=http://localhost:8080/api
APP_NAME=Gestion Clinique

Backend — application.properties (JDK 21, pas YAML)
# Port de l'application
server.port=2025

spring.datasource.url=jdbc:postgresql://localhost:5432/clinique
spring.datasource.username=postgres
spring.datasource.password=root
#mdrs050796
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database=postgresql
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
debug=true

# application.properties
logging.level.com.example.GestionClinique=DEBUG
logging.level.org.springframework.aop=DEBUG
spring.main.allow-circular-references=true

# config upload photoProfil
# Dossier oÃ¹ stocker les photos
file.storage.directory=src/main/uploads/profilsUser

# Taille max en octets (ex: 2Mo = 2 * 1024 * 1024)
file.max-size=104971520

# For Spring Boot 2.x & 3.x
spring.servlet.multipart.max-file-size=15MB
spring.servlet.multipart.max-request-size=15MB

# Extensions autorisÃ©es (sÃ©parÃ©es par virgule)
file.allowed-extensions=.jpg,.jpeg,.png,.gif


🌐 CORS — rappel côté Frontend
Assurez-vous que les requêtes Axios pointent vers API_BASE_URL et que les cookies/headers JWT sont correctement transmis.

🧩 Sécurité (aperçu)
• Authentification: Login -> génération d'un accessToken + refreshToken (JWT).
• Autorisation: Filtres Spring Security + @PreAuthorize selon les rôles (ADMIN, MEDECIN, SECRETAIRE).
• Endpoints protégés par antMatchers/HttpSecurity DSL (Spring Security 6).
• Rafraîchissement de token via /auth/refresh.


🗄️ Modèle de données (extraits)
Entités principales: Patient, DossierMedical, Consultation, Prescription, RendezVous, Facture, Utilisateur.
Contraintes: unicité email Utilisateur, prévention doublons RDV, statuts RDV: CONFIRME, EN_ATTENTE, TERMINE, ANNULE, NO_SHOW.

🔌 Endpoints API (exemples)
/api/auth/login              POST   {email, password} -> tokens
/api/auth/refresh            POST   refreshToken -> accessToken
/api/utilisateurs            GET/POST/PUT/DELETE (ADMIN)
/api/patients                GET/POST/PUT/DELETE
/api/rendezvous              GET/POST/PUT/DELETE
/api/consultations           GET/POST/PUT
/api/prescriptions           GET/POST
/api/factures                GET/POST
/ws                          WebSocket STOMP endpoint

💬 Messagerie & Temps Réel
• WebSockets STOMP pour conversations, notifications et présence en ligne.
• Topics conseillés: /topic/notifications, /topic/conversations/{id}, /user/queue/messages.

📄 Génération de documents
• Factures et prescriptions exportées en PDF (ex: iText, OpenPDF, ou via templates).

🚀 Build & Déploiement
# Frontend (production)
npm run build
npm run preview

# Backend (JAR exécutable)
mvn clean package
java -jar target/clinique-*.jar

# Profiles si besoin
# java -jar -Dspring.profiles.active=prod target/clinique.jar



📞 Support & Maintenance
• README par rôle (Admin, Médecin, Secrétaire).
• Mises à jour régulières des dépendances, sauvegardes automatiques, monitoring.


🔗 Références techniques
• Frontend : React
• Backend : Spring Boot 3 + JWT + Spring Security (JDK 21) — configuration en application.properties
• Base de données : PostgreSQL
• Temps réel : WebSockets STOMP
• Génération de documents : PDF


📌 Notes importantes
• Le backend utilise JDK 21 et des fichiers application.properties (pas YAML).
• Pensez à adapter les secrets JWT, les identifiants DB et les origines CORS.
• Les identifiants par défaut sont à usage de développement uniquement.

KFOKAM48 — Version 1.0.0 — Dernière mise à jour : AOUT 2025 — Support : ******* 
