package com.example.GestionClinique.service;



import com.example.GestionClinique.model.entity.Prescription;

import java.util.List;


public interface PrescriptionService {
    Prescription addPrescription(Long consultationId, Prescription prescription);
    Prescription updatePrescription(Long id, Prescription prescriptionDetails);
    Prescription findById(Long id);
    List<Prescription> findAllPrescription();
    void deletePrescription(Long id);
    List<Prescription> findPrescriptionByMedecinId(Long medecinId);
    List<Prescription> findPrescriptionByPatientId(Long patientId);
    List<Prescription> findPrescriptionByConsultationId(Long consultationId);
}


