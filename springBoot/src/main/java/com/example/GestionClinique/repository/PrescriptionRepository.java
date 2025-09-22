package com.example.GestionClinique.repository;

import com.example.GestionClinique.model.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByMedecinId(Long medecinId);
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByConsultationId(Long consultationId);
}


