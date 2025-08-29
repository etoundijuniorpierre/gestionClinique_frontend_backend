# Guide Médecin - Consultations Médicales

## 🏥 Consultations Médicales

Ce guide détaille les procédures pour effectuer des consultations médicales dans le système de gestion clinique.

## 📋 Types de Consultations

### Consultation Standard
- **Rendez-vous programmé** : Patient avec rendez-vous
- **Durée** : 15-30 minutes selon le type
- **Documentation** : Complète et structurée

### Consultation d'Urgence
- **Sans rendez-vous** : Patient en urgence
- **Priorité** : Prise en charge immédiate
- **Documentation** : Rapide mais complète

## 🔄 Procédure de Consultation Standard

### 1. Accès à la Consultation
1. **Connectez-vous** à votre compte médecin
2. **Accédez à votre planning** : Rendez-vous du jour
3. **Sélectionnez le rendez-vous** à traiter
4. **Cliquez sur "Consultation"** pour ouvrir le formulaire

### 2. Vérification des Informations Patient
- **Identité** : Vérifier nom, prénom, date de naissance
- **Dossier médical** : Consulter l'historique
- **Allergies** : Vérifier les contre-indications
- **Traitements en cours** : Médicaments actuels

### 3. Remplissage du Formulaire de Consultation

#### Motif de Consultation
- **Raison de la visite** : Symptômes principaux
- **Durée des symptômes** : Depuis quand ?
- **Évolution** : Amélioration ou aggravation

#### Examen Clinique
- **Signes vitaux** : Tension, pouls, température
- **Examen physique** : Observations détaillées
- **Tests spécifiques** : Selon la pathologie

#### Diagnostic
- **Diagnostic principal** : Pathologie identifiée
- **Code CIM-10** : Classification internationale
- **Sévérité** : Grade de la pathologie

#### Traitement Prescrit
- **Médicaments** : Nom, posologie, durée
- **Instructions** : Mode d'administration
- **Précautions** : Effets secondaires

## 🚨 Procédure de Consultation d'Urgence

### 1. Accès Rapide
1. **Cliquez sur "Consultation d'urgence"**
2. **Créez** une nouvelle consultation
3. **Saisissez** les informations patient minimales

### 2. Évaluation Rapide
- **Motif d'urgence** : Symptômes principaux
- **Examen clinique** : Signes vitaux prioritaires
- **Gravité** : Évaluation de l'urgence

## 📊 Documentation de la Consultation

### Informations Obligatoires
- **Date et heure** : Horodatage automatique
- **Médecin** : Votre identité
- **Patient** : Identité complète
- **Motif** : Raison de la consultation
- **Examen** : Observations cliniques
- **Diagnostic** : Conclusion médicale
- **Traitement** : Prescriptions

## 🔍 Historique des Consultations

### Accès à l'Historique
1. **Sélectionnez** un patient
2. **Accédez** au dossier médical
3. **Consultez** l'historique des consultations

### Informations Disponibles
- **Liste chronologique** : Toutes les consultations
- **Filtres** : Par date, type, diagnostic
- **Recherche** : Par symptômes ou diagnostic

## 💊 Intégration avec les Prescriptions

### Création de Prescription
1. **Dans la consultation** : Accédez à "Prescription"
2. **Remplissez** le formulaire de prescription
3. **Validez** la prescription
4. **Générez** le document PDF

## 🔐 Confidentialité et Sécurité

### Protection des Données
- **Secret médical** : Respect absolu
- **Accès sécurisé** : Identifiants personnels
- **Traçabilité** : Toutes les actions sont tracées

### Bonnes Pratiques
- **Vérification** : Contrôler l'identité du patient
- **Documentation** : Enregistrer toutes les informations
- **Validation** : Vérifier avant sauvegarde

---

**Note importante** : La qualité de la documentation des consultations est essentielle pour assurer la continuité des soins et la sécurité des patients.

## 🔗 Références Techniques

### Documentation Complète
- **Documentation Technique** : [Plateforme de Gestion de Clinique Médicale](https://docs.google.com/document/d/11CkpRdISp8IFbqysINgZKNNlVGT6uu5ThWbM-rl8JLQ/edit?tab=t.0)

### Entité Consultation
- **Attributs** : motifs, tensionArterielle, temperature, poids, taille, compteRendu, diagnostic
- **Relations** : ManyToOne avec DossierMedical, OneToMany avec Prescription
- **Workflow** : RendezVous → Consultation → Prescription → Facture

### Contrôles de Qualité
- **Validation des données** : Contrôles côté frontend et backend
- **Traçabilité** : HistoriqueAction pour chaque consultation
- **Intégrité** : Consultation obligatoirement liée à un DossierMedical
- **Sécurité** : Accès restreint aux médecins uniquement
