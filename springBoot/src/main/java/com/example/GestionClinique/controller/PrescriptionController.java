package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.ResponseDto.PrescriptionResponseDto;
import com.example.GestionClinique.mapper.PrescriptionMapper;
import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.service.PrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
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