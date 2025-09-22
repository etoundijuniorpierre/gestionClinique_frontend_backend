package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.DossierMedical;
import com.example.GestionClinique.model.entity.Patient;
import com.example.GestionClinique.repository.DossierMedicalRepository;
import com.example.GestionClinique.repository.PatientRepository;
import com.example.GestionClinique.service.DossierMedicalService;
import com.example.GestionClinique.service.HistoriqueActionService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DossierMedicalServiceImpl implements DossierMedicalService {

    private final DossierMedicalRepository dossierMedicalRepository;
    private final PatientRepository patientRepository;
    private final HistoriqueActionService historiqueActionService;
    private final LoggingAspect loggingAspect;

    @Override
    public DossierMedical createDossierMedicalForPatient(Long patientId, DossierMedical dossierMedical) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + patientId));

        if (patient.getDossierMedical() != null) {
            throw new RuntimeException("Patient with ID " + patientId + " already has a medical record.");
        }

        dossierMedical.setPatient(patient);
        DossierMedical savedDossier = dossierMedicalRepository.save(dossierMedical);

        patient.setDossierMedical(savedDossier);
        patientRepository.save(patient);

        historiqueActionService.enregistrerAction(
                String.format("Création dossier médical ID: %d pour patient ID: %d",
                        savedDossier.getId(), patientId),
                loggingAspect.currentUserId()
        );

        return savedDossier;
    }

    @Override
    public DossierMedical updateDossierMedical(Long id, DossierMedical dossierMedicalDetails) {
        DossierMedical existingDossier = dossierMedicalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dossier Medical not found with ID: " + id));

        existingDossier.setGroupeSanguin(dossierMedicalDetails.getGroupeSanguin());
        existingDossier.setAntecedentsMedicaux(dossierMedicalDetails.getAntecedentsMedicaux());
        existingDossier.setAllergies(dossierMedicalDetails.getAllergies());
        existingDossier.setDernierTraitement(dossierMedicalDetails.getDernierTraitement());
        existingDossier.setObservations(dossierMedicalDetails.getObservations());

        historiqueActionService.enregistrerAction(
                String.format("Mise à jour dossier médical ID: %d", id),
                loggingAspect.currentUserId()
        );

        return dossierMedicalRepository.save(existingDossier);
    }

    @Override
    @Transactional
    public DossierMedical findDossierMedicalById(Long id) {
        return dossierMedicalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dossier Medical not found with ID: " + id));
    }

    @Override
    @Transactional
    public List<DossierMedical> findAllDossierMedical() {
        return dossierMedicalRepository.findAll();
    }

    @Override
    @Transactional
    public Patient findPatientByDossierMedicalId(Long id) {
        DossierMedical dossierMedical = findDossierMedicalById(id);
        return dossierMedical.getPatient(); // Automatically fetched due to EAGER or proxy handling
    }

    @Override
    public void deleteDossierMedicalById(Long id) {
        DossierMedical dossierMedical = dossierMedicalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dossier Medical not found with ID: " + id));

        if (dossierMedical.getPatient() != null) {
            Patient patient = dossierMedical.getPatient();
            patient.setDossierMedical(null);
            patientRepository.save(patient);
        }

        historiqueActionService.enregistrerAction(
                String.format("Suppression dossier médical ID: %d", id),
                loggingAspect.currentUserId()
        );

        dossierMedicalRepository.delete(dossierMedical);
    }

    @Override
    @Transactional
    public DossierMedical findDossierMedicalByPatientId(Long patientId) {
        return dossierMedicalRepository.findByPatientId(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Dossier Medical not found for Patient with ID: " + patientId));
    }
}