package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.model.entity.enumElem.StatutPaiement;
import com.example.GestionClinique.model.entity.enumElem.StatutRDV;
import com.example.GestionClinique.model.entity.enumElem.StatutSalle;
import com.example.GestionClinique.repository.*;
import com.example.GestionClinique.service.ConsultationService;
import com.example.GestionClinique.service.FactureService;
import com.example.GestionClinique.service.HistoriqueActionService;
import com.example.GestionClinique.service.StatService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final RendezVousRepository rendezVousRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final SalleRepository salleRepository;
    private final FactureService factureService;
    private final HistoriqueActionService historiqueActionService;
    private final LoggingAspect loggingAspect;
    private final StatService statService;

    @Override
    @Transactional
    public Consultation createConsultation(Consultation consultation, Long medecinId) {

        Utilisateur medecin = utilisateurRepository.findById(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Medecin not found with ID: " + medecinId));

        consultation.setMedecin(medecin);
        consultation.setDossierMedical(null);

        List<Prescription> prescriptionsToSave = consultation.getPrescriptions();
        if (prescriptionsToSave != null && !prescriptionsToSave.isEmpty()) {
            for (Prescription prescription : prescriptionsToSave) {
                prescription.setConsultation(consultation);
                prescription.setMedecin(medecin);
                prescription.setPatient(null);
                prescription.setDossierMedical(null);
            }
        }

        Consultation savedConsultation = consultationRepository.save(consultation);
        historiqueActionService.enregistrerAction(
                String.format("Création consultation d'urgence ID: %d par médecin ID: %d",
                        savedConsultation.getId(), medecinId),
                loggingAspect.currentUserId()
        );
        factureService.generateInvoiceForConsultation(savedConsultation.getId());

        statService.refreshStatDuJour(LocalDate.now());
        statService.refreshStatParMois(LocalDate.now().getMonthValue());
        statService.refreshStatsSurLannee(LocalDate.now().getYear());

        return savedConsultation;
    }

    @Override
    @Transactional
    public Consultation startConsultation(Long rendezVousId, Consultation consultationDetails, Long medecinId) {
        RendezVous rendezVous = rendezVousRepository.findById(rendezVousId)
                .orElseThrow(() -> new IllegalArgumentException("RendezVous not found with ID: " + rendezVousId));

        if (rendezVous.getConsultation() != null) {
            throw new RuntimeException("RendezVous with ID " + rendezVousId + " is already linked to a consultation.");
        }
        if (rendezVous.getFacture() == null || rendezVous.getFacture().getStatutPaiement() != StatutPaiement.PAYEE) {
            throw new RuntimeException("Cannot start consultation: invoice not found or not paid for rendez-vous with ID " + rendezVousId);
        }

        rendezVous.setStatut(StatutRDV.ENCOURS);

        Utilisateur medecin = utilisateurRepository.findById(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Medecin not found with ID: " + medecinId));
        consultationDetails.setMedecin(medecin);

        Salle salle = rendezVous.getSalle();
        if (salle == null) {
            throw new IllegalStateException("RendezVous does not have an associated room to mark as occupied.");
        }
        salle.setStatutSalle(StatutSalle.OCCUPEE);
        salleRepository.save(salle);

        if (rendezVous.getPatient() == null || rendezVous.getPatient().getDossierMedical() == null) {
            throw new RuntimeException("RendezVous patient does not have an associated medical record.");
        }
        DossierMedical dossierMedical = rendezVous.getPatient().getDossierMedical();
        consultationDetails.setDossierMedical(dossierMedical);

        List<Prescription> prescriptionsToSave = consultationDetails.getPrescriptions();
        if (prescriptionsToSave != null && !prescriptionsToSave.isEmpty()) {
            for (Prescription prescription : prescriptionsToSave) {
                prescription.setConsultation(consultationDetails);
                prescription.setMedecin(medecin);
                prescription.setPatient(rendezVous.getPatient());
                prescription.setDossierMedical(dossierMedical);
            }

            Prescription lastPrescription = prescriptionsToSave.getLast();
            dossierMedical.setDernierTraitement(lastPrescription.getMedicaments());
        }

        Consultation newConsultation = consultationRepository.save(consultationDetails);

        rendezVous.setConsultation(newConsultation);
        rendezVousRepository.save(rendezVous);
        salle.setStatutSalle(StatutSalle.DISPONIBLE);
        rendezVous.setStatut(StatutRDV.TERMINE);
        salleRepository.save(salle);
        rendezVousRepository.save(rendezVous);

        historiqueActionService.enregistrerAction(
                String.format("Début consultation ID: %d pour rendez-vous ID: %d",
                        newConsultation.getId(), rendezVousId),
                loggingAspect.currentUserId()
        );

        statService.refreshStatDuJour(LocalDate.now());
        statService.refreshStatParMois(LocalDate.now().getMonthValue());
        statService.refreshStatsSurLannee(LocalDate.now().getYear());

        return newConsultation;
    }

    @Override
    @Transactional
    public Consultation updateConsultation(Long id, Consultation consultationDetails) {
        Consultation existingConsultation = consultationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found with ID: " + id));

        existingConsultation.setMotifs(consultationDetails.getMotifs());
        existingConsultation.setTensionArterielle(consultationDetails.getTensionArterielle());
        existingConsultation.setTemperature(consultationDetails.getTemperature());
        existingConsultation.setPoids(consultationDetails.getPoids());
        existingConsultation.setTaille(consultationDetails.getTaille());
        existingConsultation.setCompteRendu(consultationDetails.getCompteRendu());
        existingConsultation.setDiagnostic(consultationDetails.getDiagnostic());

        historiqueActionService.enregistrerAction(
                String.format("Mise à jour consultation ID: %d", id),
                loggingAspect.currentUserId()
        );

        return consultationRepository.save(existingConsultation);
    }

    @Override
    @Transactional
    public Consultation findById(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found with ID: " + id));
    }

    @Override
    @Transactional
    public List<Consultation> findAll() {
        return consultationRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Consultation consultation = findById(id);
        if (consultation.getRendezVous() != null) {
            RendezVous rendezVous = consultation.getRendezVous();
            rendezVous.setConsultation(null); // Unlink
            rendezVousRepository.save(rendezVous);
        }

        historiqueActionService.enregistrerAction(
                String.format("Suppression consultation ID: %d", id),
                loggingAspect.currentUserId()
        );

        consultationRepository.delete(consultation);
    }

    @Override
    @Transactional
    public Prescription addPrescriptionToConsultation(Long consultationId, Prescription prescription) {
        Consultation consultation = findById(consultationId);

        if (consultation.getDossierMedical() == null || consultation.getDossierMedical().getPatient() == null) {
            throw new IllegalStateException("Cannot add prescription to a consultation without a linked patient/dossier medical.");
        }
        prescription.setConsultation(consultation);
        prescription.setMedecin(consultation.getMedecin());
        prescription.setPatient(consultation.getDossierMedical().getPatient());
        prescription.setDossierMedical(consultation.getDossierMedical());

        historiqueActionService.enregistrerAction(
                String.format("ajout prescription à la consultation avec l' ID: %d", consultationId),
                loggingAspect.currentUserId()
        );

        return prescriptionRepository.save(prescription);
    }

    @Override
    @Transactional
    public List<Prescription> findPrescriptionsByConsultationId(Long consultationId) {
        Consultation consultation = findById(consultationId);
        return consultation.getPrescriptions();
    }
}