package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.ResponseDto.DossierMedicalResponseDto;
import com.example.GestionClinique.dto.RequestDto.DossierMedicalRequestDto;
import com.example.GestionClinique.dto.ResponseDto.PatientResponseDto;
import com.example.GestionClinique.mapper.DossierMedicalMapper;
import com.example.GestionClinique.mapper.PatientMapper;
import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.service.DossierMedicalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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

@Tag(name = "Gestion des Dossiers Médicaux", description = "API pour la gestion des dossiers médicaux des patients")
@RequestMapping(API_NAME + "/dossierMedical")
@RestController
@AllArgsConstructor
public class DossierMedicalController {

    private final DossierMedicalService dossierMedicalService;
    private final DossierMedicalMapper dossierMedicalMapper;
    private final PatientMapper patientMapper;

    @PreAuthorize("hasAnyRole('MEDECIN', 'SECRETAIRE')")
    @GetMapping(path = "/patient/{idPatient}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir le dossier médical d'un patient",
            description = "Récupère le dossier médical associé à un patient")
    public ResponseEntity<DossierMedicalResponseDto> findDossierMedicalByPatientId(
            @Parameter(description = "ID du patient", required = true, example = "1")
            @PathVariable("idPatient") Long idPatient) {

        DossierMedical dossierMedical = dossierMedicalService.findDossierMedicalByPatientId(idPatient);
        return ResponseEntity.ok(dossierMedicalMapper.toDto(dossierMedical));
    }
}