package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.RequestDto.PrescriptionRequestDto;
import com.example.GestionClinique.dto.ResponseDto.PrescriptionResponseDto;
import com.example.GestionClinique.mapper.PrescriptionMapper;
import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.service.PrescriptionService;
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

import static com.example.GestionClinique.configuration.utils.Constants.API_NAME;

@Tag(name = "Gestion des Prescriptions", description = "API pour la gestion des prescriptions médicales")
@RequestMapping(API_NAME + "/prescriptions")
@RestController
@AllArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final PrescriptionMapper prescriptionMapper;

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @PostMapping(path = "/{consultationId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Ajouter une prescription à une consultation existante",
            description = "Enregistre une nouvelle prescription médicale et la lie à une consultation existante.")
    public ResponseEntity<PrescriptionResponseDto> addPrescription(
            @Parameter(description = "ID de la consultation à laquelle la prescription sera ajoutée", required = true)
            @PathVariable("consultationId") Long consultationId,
            @Parameter(description = "Détails de la prescription à créer", required = true)
            @Valid @RequestBody PrescriptionRequestDto prescriptionRequestDto) {
        Prescription prescriptionToCreate = prescriptionMapper.toEntity(prescriptionRequestDto);
        Prescription createdPrescription = prescriptionService.addPrescription(consultationId, prescriptionToCreate);
        PrescriptionResponseDto responseDto = prescriptionMapper.toDto(createdPrescription);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Mettre à jour une prescription",
            description = "Modifie les informations d'une prescription existante")
    public ResponseEntity<PrescriptionResponseDto> updatePrescription(
            @Parameter(description = "ID de la prescription à mettre à jour", required = true, example = "1")
            @PathVariable("id") Long id,
            @Parameter(description = "Nouveaux détails de la prescription", required = true)
            @Valid @RequestBody PrescriptionRequestDto prescriptionRequestDto) {
        Prescription existingPrescription = prescriptionService.findById(id);
        prescriptionMapper.updateEntityFromDto(prescriptionRequestDto, existingPrescription);
        Prescription updatedPrescription = prescriptionService.updatePrescription(id, existingPrescription);
        return ResponseEntity.ok(prescriptionMapper.toDto(updatedPrescription));
    }

    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE')")
    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir une prescription par son ID",
            description = "Récupère les détails complets d'une prescription spécifique")
    public ResponseEntity<PrescriptionResponseDto> findById(
            @Parameter(description = "ID de la prescription à récupérer", required = true, example = "1")
            @PathVariable("id") Long id) {
        Prescription prescription = prescriptionService.findById(id);
        return ResponseEntity.ok(prescriptionMapper.toDto(prescription));
    }

    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE', 'ADMIN')")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lister toutes les prescriptions",
            description = "Récupère la liste complète des prescriptions enregistrées")
    public ResponseEntity<List<PrescriptionResponseDto>> findAllPrescription() {
        List<Prescription> prescriptions = prescriptionService.findAllPrescription();
        if (prescriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(prescriptionMapper.toDtoList(prescriptions));
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @DeleteMapping(path = "/{id}")
    @Operation(summary = "Supprimer une prescription",
            description = "Supprime définitivement une prescription du système")
    public ResponseEntity<Void> deletePrescription(
            @Parameter(description = "ID de la prescription à supprimer", required = true, example = "1")
            @PathVariable("id") Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MEDECIN', 'ADMIN')")
    @GetMapping(path = "/medecin/{medecinId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir les prescriptions par médecin",
            description = "Récupère toutes les prescriptions rédigées par un médecin spécifique")
    public ResponseEntity<List<PrescriptionResponseDto>> findPrescriptionByMedecinId(
            @Parameter(description = "ID du médecin", required = true, example = "1")
            @PathVariable("medecinId") Long id) {
        List<Prescription> prescriptions = prescriptionService.findPrescriptionByMedecinId(id);
        if (prescriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(prescriptionMapper.toDtoList(prescriptions));
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @GetMapping(path = "/patient/{patientId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir les prescriptions par patient",
            description = "Récupère toutes les prescriptions associées à un patient spécifique")
    public ResponseEntity<List<PrescriptionResponseDto>> findPrescriptionByPatientId(
            @Parameter(description = "ID du patient", required = true, example = "1")
            @PathVariable("patientId") Long id) {
        List<Prescription> prescriptions = prescriptionService.findPrescriptionByPatientId(id);
        if (prescriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(prescriptionMapper.toDtoList(prescriptions));
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @GetMapping(path = "/consultation/{consultationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir les prescriptions par consultation",
            description = "Récupère toutes les prescriptions associées à une consultation spécifique")
    public ResponseEntity<List<PrescriptionResponseDto>> findPrescriptionByConsultationId(
            @Parameter(description = "ID de la consultation", required = true, example = "1")
            @PathVariable("consultationId") Long id) {
        List<Prescription> prescriptions = prescriptionService.findPrescriptionByConsultationId(id);
        if (prescriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(prescriptionMapper.toDtoList(prescriptions));
    }
}