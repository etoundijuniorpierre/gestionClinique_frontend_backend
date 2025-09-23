package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.RequestDto.FactureRequestDto;
import com.example.GestionClinique.dto.ResponseDto.FactureResponseDto;
import com.example.GestionClinique.dto.ResponseDto.PatientResponseDto;
import com.example.GestionClinique.mapper.FactureMapper;
import com.example.GestionClinique.mapper.PatientMapper;
import com.example.GestionClinique.model.entity.Facture;
import com.example.GestionClinique.model.entity.Patient;
import com.example.GestionClinique.model.entity.enumElem.ModePaiement;
import com.example.GestionClinique.model.entity.enumElem.StatutPaiement;
import com.example.GestionClinique.service.FactureService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.GestionClinique.configuration.utils.Constants.API_NAME;

@Tag(name = "Gestion des Factures", description = "API pour la gestion des factures et des paiements")
@RequestMapping(API_NAME + "/factures")
@RestController
@AllArgsConstructor
public class FactureController {

    private final FactureService factureService;
    private final FactureMapper factureMapper;
    private final PatientMapper patientMapper;

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @GetMapping(path = "/statut/impayee", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "afficher les factures impayées",
            description = "Récupère les factures si impayées.")
    public ResponseEntity<List<FactureResponseDto>> findAllFacturesIMPAYE() {
        List<Facture> factures = factureService.findAllFacturesIMPAYE();
        if (factures.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(factureMapper.toDtoList(factures));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @GetMapping(path = "/recherche/{idFacture}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir une facture par son ID",
            description = "Récupère tous les détails d'une facture spécifique, y compris les éléments facturés.")
    public ResponseEntity<FactureResponseDto> findById(
            @Parameter(description = "ID unique de la facture à récupérer", required = true, example = "1")
            @PathVariable("idFacture") Long id) {
        Facture facture = factureService.findById(id);
        return ResponseEntity.ok(factureMapper.toDto(facture));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @PatchMapping(path = "/payer/{factureId}/{modePaiement}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Marquer une facture comme payée",
            description = "Met à jour le statut d'une facture IMPAYEE à PAYEE.")
    public ResponseEntity<FactureResponseDto> payerFacture(
            @Parameter(description = "ID de la facture à marquer comme payée", required = true, example = "1")
            @PathVariable("factureId") Long factureId, @PathVariable("modePaiement") ModePaiement modePaiement) {
        Facture updatedFacture = factureService.payerFacture(factureId, modePaiement);
        return ResponseEntity.ok(factureMapper.toDto(updatedFacture));
    }
}