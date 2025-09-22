package com.example.GestionClinique.controller;

import com.example.GestionClinique.service.authService.MonUserDetailsCustom;
import com.example.GestionClinique.dto.RequestDto.ConsultationRequestDto;
import com.example.GestionClinique.dto.ResponseDto.DossierMedicalResponseDto;
import com.example.GestionClinique.dto.RequestDto.PrescriptionRequestDto;
import com.example.GestionClinique.dto.ResponseDto.ConsultationResponseDto;

import com.example.GestionClinique.dto.ResponseDto.PrescriptionResponseDto;
import com.example.GestionClinique.dto.ResponseDto.RendezVousResponseDto;
import com.example.GestionClinique.mapper.ConsultationMapper;
import com.example.GestionClinique.mapper.DossierMedicalMapper;
import com.example.GestionClinique.mapper.PrescriptionMapper;
import com.example.GestionClinique.mapper.RendezVousMapper;
import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.service.ConsultationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.GestionClinique.configuration.utils.Constants.API_NAME;

@Tag(name = "Gestion des Consultations", description = "API pour la gestion des consultations médicales")
@RequestMapping(API_NAME + "/consultations")
@RestController
@AllArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;
    private final ConsultationMapper consultationMapper;
    private final PrescriptionMapper prescriptionMapper;
    private final RendezVousMapper rendezVousMapper;
    private final DossierMedicalMapper dossierMedicalMapper;

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof MonUserDetailsCustom) {
            return ((MonUserDetailsCustom) authentication.getPrincipal()).getId();
        }
        throw new IllegalStateException("Authenticated user (Medecin) ID not found in security context or not an Utilisateur instance.");
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @PostMapping(path = "/emergency", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Créer une nouvelle consultation d'urgence (sans rendez-vous)",
            description = "Enregistre une nouvelle consultation médicale d'urgence non liée à un rendez-vous existant.")
    public ResponseEntity<ConsultationResponseDto> createEmergencyConsultation(
            @Parameter(description = "Détails de la consultation d'urgence à créer", required = true)
            @Valid @RequestBody ConsultationRequestDto consultationRequestDto) {
        Long medecinId = getAuthenticatedUserId();
        Consultation consultationToCreate = consultationMapper.toEntity(consultationRequestDto);
        consultationToCreate.setDossierMedical(null);
        Consultation createdConsultation = consultationService.createConsultation(consultationToCreate, medecinId);
        return new ResponseEntity<>(consultationMapper.toDto(createdConsultation), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @PostMapping(path = "/start/{idRendezVous}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Démarrer une consultation à partir d'un rendez-vous",
            description = "Crée et démarre une consultation liée à un rendez-vous existant")
    public ResponseEntity<ConsultationResponseDto> startConsultation(
            @Parameter(description = "ID du rendez-vous à lier", required = true, example = "1")
            @PathVariable("idRendezVous") Long idRendezVous,
            @Parameter(description = "Détails de la consultation (y compris date/heure et durée)", required = true)
            @Valid @RequestBody ConsultationRequestDto consultationRequestDto) {
        Long medecinId = getAuthenticatedUserId();
        Consultation consultationDetails = consultationMapper.toEntity(consultationRequestDto);
        Consultation startedConsultation = consultationService.startConsultation(idRendezVous, consultationDetails, medecinId);
        return new ResponseEntity<>(consultationMapper.toDto(startedConsultation), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Mettre à jour une consultation",
            description = "Modifie les informations d'une consultation existante")
    public ResponseEntity<ConsultationResponseDto> updateConsultation(
            @Parameter(description = "ID de la consultation à mettre à jour", required = true, example = "1")
            @PathVariable("id") Long id,
            @Parameter(description = "Nouveaux détails de la consultation", required = true)
            @Valid @RequestBody ConsultationRequestDto consultationRequestDto) {
        Consultation existingConsultation = consultationService.findById(id);
        consultationMapper.updateEntityFromDto(consultationRequestDto, existingConsultation);
        Consultation updatedConsultation = consultationService.updateConsultation(id, existingConsultation);
        return ResponseEntity.ok(consultationMapper.toDto(updatedConsultation));
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir une consultation par son ID",
            description = "Récupère les détails complets d'une consultation spécifique")
    public ResponseEntity<ConsultationResponseDto> findById(
            @Parameter(description = "ID de la consultation à récupérer", required = true, example = "1")
            @PathVariable("id") Long id) {

        Consultation consultation = consultationService.findById(id);
        return ResponseEntity.ok(consultationMapper.toDto(consultation));
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lister toutes les consultations",
            description = "Récupère la liste complète des consultations enregistrées")
    public ResponseEntity<List<ConsultationResponseDto>> findAll() {
        List<Consultation> consultations = consultationService.findAll();
        if (consultations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(consultationMapper.toDtoList(consultations));
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @GetMapping(path = "/{idConsultation}/dossier-medical", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir le dossier médical lié",
            description = "Récupère le dossier médical associé à une consultation spécifique")
    public ResponseEntity<DossierMedicalResponseDto> findDossierMedicalByConsultationId(
            @Parameter(description = "ID de la consultation", required = true, example = "1")
            @PathVariable("idConsultation") Long idConsultation) {

        DossierMedical dossierMedical = consultationService.findDossierMedicalByConsultationId(idConsultation);
        return ResponseEntity.ok(dossierMedicalMapper.toDto(dossierMedical));
    }

    @PreAuthorize("hasAnyRole('MEDECIN', 'ADMIN')")
    @GetMapping(path = "/{idConsultation}/rendez-vous", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir le rendez-vous lié",
            description = "Récupère le rendez-vous associé à une consultation spécifique")
    public ResponseEntity<RendezVousResponseDto> findRendezVousByConsultationId(
            @Parameter(description = "ID de la consultation", required = true, example = "1")
            @PathVariable("idConsultation") Long idConsultation) {
        RendezVous rendezVous = consultationService.findRendezVousByConsultationId(idConsultation);
        return ResponseEntity.ok(rendezVousMapper.toDto(rendezVous));
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @DeleteMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Supprimer une consultation",
            description = "Supprime définitivement une consultation du système")
    public ResponseEntity<Void> deleteById(
            @Parameter(description = "ID de la consultation à supprimer", required = true, example = "1")
            @PathVariable("id") Long id) {
        consultationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @PostMapping(path = "/{idConsultation}/prescriptions", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Ajouter une prescription",
            description = "Ajoute une prescription médicale à une consultation existante")
    public ResponseEntity<ConsultationResponseDto> addPrescriptionToConsultation(
            @Parameter(description = "ID de la consultation", required = true, example = "1")
            @PathVariable("idConsultation") Long idConsultation,
            @Parameter(description = "Détails de la prescription", required = true)
            @Valid @RequestBody PrescriptionRequestDto prescriptionRequestDto) {
        Prescription prescriptionToAdd = prescriptionMapper.toEntity(prescriptionRequestDto);
        Prescription addedPrescription = consultationService.addPrescriptionToConsultation(idConsultation, prescriptionToAdd);
        Consultation updatedConsultation = consultationService.findById(idConsultation);
        return new ResponseEntity<>(consultationMapper.toDto(updatedConsultation), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('MEDECIN')")
    @GetMapping(path = "/{idConsultation}/prescriptions", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir les prescriptions d'une consultation",
            description = "Récupère toutes les prescriptions associées à une consultation")
    public ResponseEntity<List<PrescriptionResponseDto>> findPrescriptionsByConsultationId(
            @Parameter(description = "ID de la consultation", required = true, example = "1")
            @PathVariable("idConsultation") Long idConsultation) {
        List<Prescription> prescriptions = consultationService.findPrescriptionsByConsultationId(idConsultation);
        if (prescriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(prescriptionMapper.toDtoList(prescriptions));
    }
}
