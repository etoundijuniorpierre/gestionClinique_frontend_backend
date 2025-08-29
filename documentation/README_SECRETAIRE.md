# Guide Secrétaire - Système de Gestion Clinique

## 👩‍💼 Rôle de la Secrétaire

La secrétaire est responsable de l'accueil des patients, de la gestion des rendez-vous, de l'enregistrement des patients et de la facturation. Elle assure le lien entre les patients et l'équipe médicale.

## 🔐 Connexion

1. Accédez à la page de connexion
2. Entrez vos identifiants secrétaire
3. Vous serez redirigée vers le tableau de bord secrétaire

## 📅 Gestion des Rendez-vous

### Vue d'ensemble des Rendez-vous
- **Liste complète** : Tous les rendez-vous de la clinique
- **Filtres** : Par date, médecin, statut
- **Recherche** : Par nom de patient ou numéro de dossier
- **Statuts** : Confirmé, en attente, annulé, terminé

### Créer un Nouveau Rendez-vous
1. Cliquez sur "Nouveau rendez-vous"
2. Remplissez le formulaire :
   - **Patient** : Sélectionnez le patient existant ou créez-en un nouveau
   - **Médecin** : Choisissez le médecin traitant
   - **Date et heure** : Sélectionnez la disponibilité
   - **Type de consultation** : Consultation normale, urgence, suivi
   - **Motif** : Raison de la consultation
   - **Notes** : Informations complémentaires
3. Validez la création

### Modifier un Rendez-vous
1. Sélectionnez le rendez-vous dans la liste
2. Cliquez sur "Modifier"
3. Mettez à jour les informations nécessaires
4. Sauvegardez les modifications

## 👥 Gestion des Patients

### Liste des Patients
- **Recherche rapide** : Par nom, numéro de dossier
- **Filtres** : Par médecin traitant, date d'inscription
- **Tri** : Par nom, date de dernière visite

### Enregistrer un Nouveau Patient
1. Accédez au formulaire "Nouveau patient"
2. Remplissez les informations :
   - **Données personnelles** : Nom, prénom, date de naissance, sexe
   - **Coordonnées** : Adresse, téléphone, email
   - **Informations médicales** : Groupe sanguin, allergies, antécédents
   - **Médecin traitant** : Attribution d'un médecin
   - **Informations administratives** : Numéro de sécurité sociale, mutuelle
3. Validez l'enregistrement

## 📊 Calendrier

### Vue Calendrier
- **Vue mensuelle** : Vue d'ensemble du mois
- **Vue hebdomadaire** : Planning détaillé de la semaine
- **Vue quotidienne** : Rendez-vous du jour
- **Navigation** : Changement de période facile

### Fonctionnalités du Calendrier
- **Couleurs par médecin** : Identification visuelle
- **Statuts visuels** : Confirmé, en attente, terminé
- **Création rapide** : Clic droit pour nouveau RDV
- **Modification directe** : Glisser-déposer des rendez-vous

## 💰 Facturation

### Liste des Factures
- **Toutes les factures** : Générées et en attente
- **Filtres** : Par patient, médecin, statut de paiement
- **Recherche** : Par numéro de facture ou nom patient

### Créer une Facture
1. Sélectionnez la consultation ou le patient
2. Cliquez sur "Nouvelle facture"
3. Remplissez les détails :
   - **Patient** : Informations de facturation
   - **Services** : Consultations, examens, médicaments
   - **Tarifs** : Montants selon la grille tarifaire
   - **Remises** : Réductions applicables
   - **Mode de paiement** : Espèces, carte, chèque
4. Générez la facture PDF

## 💬 Messagerie

### Communication Interne
- **Messages avec l'équipe** : Médecins, administrateurs
- **Notifications** : Alertes importantes
- **Historique** : Conservation des échanges

## 📱 Interface Utilisateur

### Navigation
- **Menu latéral** : Accès rapide aux fonctionnalités
- **Barre supérieure** : Notifications et profil
- **Breadcrumbs** : Navigation contextuelle

## 🔐 Sécurité et Confidentialité

### Protection des Données
- **Secret médical** : Respect absolu de la confidentialité
- **Accès sécurisé** : Connexion avec identifiants personnels
- **Déconnexion** : Fermeture de session après utilisation

---

**Note importante** : La secrétaire joue un rôle crucial dans l'organisation de la clinique. Une gestion efficace des rendez-vous et une communication claire avec les patients contribuent au bon fonctionnement de l'établissement.

## 🔗 Références Techniques

### Documentation Complète
- **Documentation Technique** : [Plateforme de Gestion de Clinique Médicale](https://docs.google.com/document/d/11CkpRdISp8IFbqysINgZKNNlVGT6uu5ThWbM-rl8JLQ/edit?tab=t.0)

### Entités Gérées
- **RendezVous** : Planification avec validation des disponibilités
- **Patient** : Création et gestion avec InfoPersonnel
- **Facture** : Génération et suivi des paiements
- **Message** : Communication avec l'équipe médicale

### Contrôles Métier
- **Validation des RDV** : Prévention des doubles réservations (médecin + salle)
- **Statuts RDV** : CONFIRME (payé), EN_ATTENTE (non payé), ANNULE, TERMINE
- **Suppression automatique** : RDV non payés supprimés après la date
- **Unicité** : Un médecin ne peut avoir qu'un RDV à la même heure
