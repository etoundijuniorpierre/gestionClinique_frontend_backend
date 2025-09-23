package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.Patient;
import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.model.entity.enumElem.StatutRDV;

import java.util.List;

public interface PatientService {
    Patient createPatient(Patient patient);
    Patient updatePatient(Long id, Patient patientDetails);
    List<Patient> findAllPatients();
    Patient findById(Long id);
    void deletePatient(Long id);
    List<Patient> findPatientByNom(String nom);
}
