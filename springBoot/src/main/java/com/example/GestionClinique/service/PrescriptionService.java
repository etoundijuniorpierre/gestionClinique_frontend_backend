package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.Prescription;

import java.util.List;

public interface PrescriptionService {
    Prescription findById(Long id);
    List<Prescription> findPrescriptionByConsultationId(Long consultationId);
}


