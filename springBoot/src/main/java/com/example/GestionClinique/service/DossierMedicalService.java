package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.DossierMedical;

public interface DossierMedicalService {
    DossierMedical findDossierMedicalById(Long id);
    DossierMedical findDossierMedicalByPatientId(Long patientId);
}
