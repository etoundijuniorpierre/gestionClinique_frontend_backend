# Champs Obligatoires par Formulaire

## 1. Formulaire Utilisateur (`formulaireutilisateur.jsx`)

### Champs OBLIGATOIRES (required):

- Nom
- Prénom
- Username
- Email
- Téléphone
- Rôle
- Mot de passe (si création)
- Date de naissance
- Âge

### Champs OPTIONNELS:

- Adresse
- Spécialité (seulement si rôle = MEDECIN)

---

## 2. Formulaire Patient Admin (`formulairepatient.jsx`)

### Champs OBLIGATOIRES (required):

- Nom
- Prénom
- Date de naissance
- Téléphone
- Email
- Sexe

### Champs OPTIONNELS:

- Adresse
- Groupe sanguin
- Allergies
- Antécédents médicaux

---

## 3. Formulaire Patient Secrétaire (`formulairepatientsecretaire.jsx`)

### Champs OBLIGATOIRES (required):

- Nom
- Prénom
- Date de naissance
- Téléphone
- Email
- Sexe

### Champs OPTIONNELS:

- Adresse
- Groupe sanguin
- Allergies
- Antécédents médicaux

---

## 4. Formulaire Rendez-vous (`formulairerendezvous.jsx`)

### Champs OBLIGATOIRES (required):

- Patient
- Médecin
- Date du rendez-vous
- Heure du rendez-vous
- Type de consultation

### Champs OPTIONNELS:

- Motif
- Notes

---

## 5. Formulaire Consultation (`formulaireconsultation.jsx`)

### Champs OBLIGATOIRES (required):

- Patient
- Médecin
- Date de consultation
- Motif de consultation
- Diagnostic

### Champs OPTIONNELS:

- Symptômes
- Examen clinique
- Traitement prescrit
- Notes

---

## 6. Formulaire Consultation Urgence (`formulaireconsultationurgence.jsx`)

### Champs OBLIGATOIRES (required):

- Patient
- Médecin
- Date de consultation
- Motif de consultation
- Diagnostic
- Niveau d'urgence

### Champs OPTIONNELS:

- Symptômes
- Examen clinique
- Traitement prescrit
- Notes

---

## 7. Formulaire Prescription (`formulaireprescription.jsx`)

### Champs OBLIGATOIRES (required):

- Patient
- Médecin
- Médicament
- Posologie
- Durée du traitement
- Date de prescription

### Champs OPTIONNELS:

- Instructions spéciales
- Notes

---

## 8. Formulaire Facture (`formulairefacture.jsx`)

### Champs OBLIGATOIRES (required):

- Patient
- Montant total
- Date de facturation
- Statut de paiement

### Champs OPTIONNELS:

- Description des services
- Mode de paiement
- Notes

---

## Convention de Marquage

Pour tous les formulaires, utiliser le composant `FormLabel` avec la prop `required`:

```jsx
import { FormLabel } from '../shared/FormComponents';

// Champ obligatoire
<FormLabel required htmlFor="nom">Nom</FormLabel>

// Champ optionnel
<FormLabel htmlFor="adresse">Adresse</FormLabel>
```

Les champs obligatoires afficheront automatiquement un astérisque rouge (\*) après le label.
