package com.example.GestionClinique.testutils;

import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.model.entity.enumElem.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Centralized Mock Data Factory
 * Single source of truth for all test data
 * Follows DRY principle - declare once, use everywhere
 */
public class MockDataFactory {

    // ==================== PATIENTS ====================

    public static Patient createMockPatient() {
        return createMockPatient(1L, "Nguemo", "Jean");
    }

    public static Patient createMockPatient(Long id, String nom, String prenom) {
        Patient patient = new Patient();
        patient.setId(id);
        patient.setNom(nom);
        patient.setPrenom(prenom);
        patient.setEmail(nom.toLowerCase() + "." + prenom.toLowerCase() + "@email.com");
        patient.setTelephone("677" + String.format("%06d", id));
        patient.setAdresse("Bastos, Yaoundé");
        patient.setDateNaissance(LocalDate.of(1990, 1, 1).plusYears(id.intValue()));
        patient.setAge(LocalDate.now().getYear() - patient.getDateNaissance().getYear());
        patient.setGenre(id % 2 == 0 ? "F" : "M");
        patient.setGroupeSanguin("O+");
        return patient;
    }

    public static List<Patient> createMockPatientList(int count) {
        List<Patient> patients = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            patients.add(createMockPatient((long) i, "Patient" + i, "Test" + i));
        }
        return patients;
    }

    // ==================== UTILISATEURS ====================

    public static Utilisateur createMockUtilisateur() {
        return createMockUtilisateur(1L, "Admin", "System", "ROLE_ADMIN");
    }

    public static Utilisateur createMockUtilisateur(Long id, String nom, String prenom, String role) {
        Utilisateur user = new Utilisateur();
        user.setId(id);
        user.setNom(nom);
        user.setPrenom(prenom);
        user.setEmail(nom.toLowerCase() + "." + prenom.toLowerCase() + "@clinique.com");
        user.setTelephone("699" + String.format("%06d", id));
        user.setAdresse("Centre-ville, Yaoundé");
        user.setGenre(id % 2 == 0 ? "F" : "M");

        Role userRole = new Role();
        userRole.setId(id);
        userRole.setName(role);
        user.setRole(userRole);

        return user;
    }

    public static Utilisateur createMockMedecin() {
        return createMockUtilisateur(2L, "Mbappé", "Amina", "ROLE_MEDECIN");
    }

    public static Utilisateur createMockSecretaire() {
        return createMockUtilisateur(3L, "Kamga", "Marie", "ROLE_SECRETAIRE");
    }

    // ==================== RENDEZ-VOUS ====================

    public static RendezVous createMockRendezVous() {
        return createMockRendezVous(1L, StatutRDV.CONFIRME);
    }

    public static RendezVous createMockRendezVous(Long id, StatutRDV statut) {
        RendezVous rdv = new RendezVous();
        rdv.setId(id);
        rdv.setJour(LocalDate.now().plusDays(id));
        rdv.setHeure(LocalTime.of(9 + id.intValue() % 8, 0));
        rdv.setStatut(statut);
        rdv.setPatient(createMockPatient());
        rdv.setMedecin(createMockMedecin());
        rdv.setNotes("Consultation de routine #" + id);
        rdv.setDateCreation(LocalDateTime.now());
        return rdv;
    }

    public static List<RendezVous> createMockRendezVousList(int count) {
        List<RendezVous> rdvList = new ArrayList<>();
        StatutRDV[] statuts = StatutRDV.values();
        for (int i = 1; i <= count; i++) {
            rdvList.add(createMockRendezVous((long) i, statuts[i % statuts.length]));
        }
        return rdvList;
    }

    // ==================== CONSULTATIONS ====================

    public static Consultation createMockConsultation() {
        return createMockConsultation(1L);
    }

    public static Consultation createMockConsultation(Long id) {
        Consultation consultation = new Consultation();
        consultation.setId(id);
        consultation.setDateConsultation(LocalDate.now());
        consultation.setMotif("Consultation générale");
        consultation.setDiagnostic("Diagnostic #" + id);
        consultation.setTraitement("Traitement prescrit #" + id);
        consultation.setObservations("Observations médicales");
        consultation.setPatient(createMockPatient());
        consultation.setMedecin(createMockMedecin());
        consultation.setRendezVous(createMockRendezVous());
        return consultation;
    }

    // ==================== PRESCRIPTIONS ====================

    public static Prescription createMockPrescription() {
        return createMockPrescription(1L);
    }

    public static Prescription createMockPrescription(Long id) {
        Prescription prescription = new Prescription();
        prescription.setId(id);
        prescription.setDatePrescription(LocalDate.now());
        prescription.setMedicaments("Paracétamol 500mg, Ibuprofène 200mg");
        prescription.setPosologie("2 fois par jour pendant 7 jours");
        prescription.setDuree("7 jours");
        prescription.setConsultation(createMockConsultation());
        prescription.setMedecin(createMockMedecin());
        return prescription;
    }

    // ==================== FACTURES ====================

    public static Facture createMockFacture() {
        return createMockFacture(1L, StatutFacture.EN_ATTENTE);
    }

    public static Facture createMockFacture(Long id, StatutFacture statut) {
        Facture facture = new Facture();
        facture.setId(id);
        facture.setNumeroFacture("FACT-" + String.format("%06d", id));
        facture.setDateFacture(LocalDate.now());
        facture.setMontantTotal(50000.0 + (id * 10000));
        facture.setMontantPaye(statut == StatutFacture.PAYEE ? facture.getMontantTotal() : 0.0);
        facture.setStatut(statut);
        facture.setPatient(createMockPatient());
        facture.setConsultation(createMockConsultation());
        return facture;
    }

    // ==================== DOSSIER MEDICAL ====================

    public static DossierMedical createMockDossierMedical() {
        return createMockDossierMedical(1L);
    }

    public static DossierMedical createMockDossierMedical(Long id) {
        DossierMedical dossier = new DossierMedical();
        dossier.setId(id);
        dossier.setNumeroDossier("DM-" + String.format("%06d", id));
        dossier.setDateCreation(LocalDate.now().minusYears(1));
        dossier.setAntecedentsMedicaux("Aucun antécédent majeur");
        dossier.setAllergies("Aucune allergie connue");
        dossier.setGroupeSanguin("O+");
        dossier.setPatient(createMockPatient());
        return dossier;
    }

    // ==================== NOTIFICATIONS ====================

    public static Notification createMockNotification() {
        return createMockNotification(1L, TypeNotification.RENDEZ_VOUS);
    }

    public static Notification createMockNotification(Long id, TypeNotification type) {
        Notification notification = new Notification();
        notification.setId(id);
        notification.setType(type);
        notification.setMessage("Notification de test #" + id);
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setLu(false);
        notification.setDestinataire(createMockUtilisateur());
        return notification;
    }

    // ==================== ROLES ====================

    public static Role createMockRole(String roleName) {
        Role role = new Role();
        role.setId(roleName.equals("ROLE_ADMIN") ? 1L : roleName.equals("ROLE_MEDECIN") ? 2L : 3L);
        role.setName(roleName);
        return role;
    }

    // ==================== SALLES ====================

    public static Salle createMockSalle() {
        return createMockSalle(1L, "Salle de Consultation 1");
    }

    public static Salle createMockSalle(Long id, String nom) {
        Salle salle = new Salle();
        salle.setId(id);
        salle.setNom(nom);
        salle.setNumero("S" + String.format("%03d", id));
        salle.setCapacite(1);
        salle.setDisponible(true);
        return salle;
    }

    // ==================== HELPER METHODS ====================

    /**
     * Create a list of any entity type
     */
    public static <T> List<T> createList(T item, int count) {
        List<T> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(item);
        }
        return list;
    }

    /**
     * Reset all IDs to null (for testing create operations)
     */
    public static <T> T withoutId(T entity) {
        if (entity instanceof Patient) {
            ((Patient) entity).setId(null);
        } else if (entity instanceof Utilisateur) {
            ((Utilisateur) entity).setId(null);
        } else if (entity instanceof RendezVous) {
            ((RendezVous) entity).setId(null);
        }
        // Add more entity types as needed
        return entity;
    }
}
