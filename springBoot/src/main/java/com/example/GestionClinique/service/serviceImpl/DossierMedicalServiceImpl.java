package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.DossierMedical;
import com.example.GestionClinique.repository.DossierMedicalRepository;
import com.example.GestionClinique.service.DossierMedicalService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DossierMedicalServiceImpl implements DossierMedicalService {

    private final DossierMedicalRepository dossierMedicalRepository;

    @Override
    @Transactional
    public DossierMedical findDossierMedicalById(Long id) {
        return dossierMedicalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dossier Medical not found with ID: " + id));
    }

    @Override
    @Transactional
    public DossierMedical findDossierMedicalByPatientId(Long patientId) {
        return dossierMedicalRepository.findByPatientId(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Dossier Medical not found for Patient with ID: " + patientId));
    }
}