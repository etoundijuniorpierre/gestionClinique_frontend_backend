package com.example.GestionClinique.controller;

import com.example.GestionClinique.configuration.utils.Constants;
import com.example.GestionClinique.dto.RequestDto.PatientRequestDto;
import com.example.GestionClinique.dto.ResponseDto.PatientResponseDto;
import com.example.GestionClinique.mapper.PatientMapper;
import com.example.GestionClinique.mapper.RendezVousMapper;
import com.example.GestionClinique.model.entity.Patient;
import com.example.GestionClinique.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Gestion des Patients", description = "API pour la gestion des patients de la clinique")
@RequestMapping(Constants.API_NAME + "/patients")
@RestController
@AllArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final PatientMapper patientMapper;
    private final RendezVousMapper rendezVousMapper;

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN')")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Créer un nouveau patient",
            description = "Enregistre un nouveau patient dans le système avec ses informations personnelles et un dossier médical complet.")
    public ResponseEntity<PatientResponseDto> createPatient(
            @Parameter(description = "Détails du patient et de son dossier médical à créer", required = true)
            @Valid @RequestBody PatientRequestDto patientRequestDto) {
        Patient patientToCreate = patientMapper.toEntity(patientRequestDto);
        Patient createdPatient = patientService.createPatient(patientToCreate);
        PatientResponseDto responseDto = patientMapper.toDto(createdPatient);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN')")
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Mettre à jour un patient",
            description = "Modifie les informations d'un patient existant identifié par son ID")
    public ResponseEntity<PatientResponseDto> updatePatient(
            @Parameter(description = "ID du patient à mettre à jour", required = true, example = "1")
            @PathVariable("id") Long id,
            @Parameter(description = "Nouvelles informations du patient", required = true)
            @Valid @RequestBody PatientRequestDto patientRequestDto) {

        Patient existingPatient = patientService.findById(id);
        patientMapper.updateEntityFromDto(patientRequestDto, existingPatient);
        Patient updatedPatient = patientService.updatePatient(id, existingPatient);
        return ResponseEntity.ok(patientMapper.toDto(updatedPatient));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN', 'MEDECIN')")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lister tous les patients",
            description = "Récupère la liste complète des patients enregistrés dans le système")
    public ResponseEntity<List<PatientResponseDto>> findAllPatients() {
        List<Patient> patients = patientService.findAllPatients();
        if (patients.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(patientMapper.toDtoList(patients));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN', 'MEDECIN')")
    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir un patient par son ID",
            description = "Récupère les détails complets d'un patient spécifique")
    public ResponseEntity<PatientResponseDto> findById(
            @Parameter(description = "ID du patient à récupérer", required = true, example = "1")
            @PathVariable("id") Long id) {
        Patient patient = patientService.findById(id);
        return ResponseEntity.ok(patientMapper.toDto(patient));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN')")
    @DeleteMapping(path = "/{id}")
    @Operation(summary = "Supprimer un patient",
            description = "Supprime définitivement un patient du système (archivage selon politique de rétention)")
    public ResponseEntity<Void> deletePatient(
            @Parameter(description = "ID du patient à supprimer", required = true, example = "1")
            @PathVariable("id") Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN', 'MEDECIN')")
    @GetMapping(path = "/nom/{nom}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Rechercher par nom exact",
            description = "Trouve tous les patients portant exactement le nom spécifié")
    public ResponseEntity<List<PatientResponseDto>> findPatientByNom(
            @Parameter(description = "Nom exact du patient (case insensitive)", required = true, example = "ateba")
            @PathVariable("nom") String nom) {
        List<Patient> patients = patientService.findPatientByNom(nom);
        if (patients.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(patientMapper.toDtoList(patients));
    }
}