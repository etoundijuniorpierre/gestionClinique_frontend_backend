package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.repository.*;
import com.example.GestionClinique.service.PrescriptionService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    @Override
    @Transactional
    public Prescription findById(Long id) {
        return prescriptionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + id));
    }

    @Override
    @Transactional
    public List<Prescription> findPrescriptionByConsultationId(Long consultationId) {
        return prescriptionRepository.findByConsultationId(consultationId);
    }
}