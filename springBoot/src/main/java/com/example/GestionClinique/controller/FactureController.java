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
    @PutMapping(path = "/update/{idFacture}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Mettre à jour une facture",
            description = "Met à jour tous les détails modifiables d'une facture existante (montant, date d'émission, etc.).")
    public ResponseEntity<FactureResponseDto> updateFacture(
            @Parameter(description = "ID de la facture à mettre à jour", required = true, example = "1")
            @PathVariable("idFacture") Long id,
            @Parameter(description = "Nouveaux détails de la facture", required = true,
                    content = @Content(schema = @Schema(implementation = FactureRequestDto.class)))
            @Valid @RequestBody FactureRequestDto factureRequestDto) {
        Facture existingFacture = factureService.findById(id);
        factureMapper.updateEntityFromDto(factureRequestDto, existingFacture);
        Facture updatedFacture = factureService.updateFacture(id, existingFacture);
        return ResponseEntity.ok(factureMapper.toDto(updatedFacture));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @GetMapping(path = "/recherche/allFacture", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lister toutes les factures",
            description = "Récupère la liste complète des factures avec leurs détails.")
    public ResponseEntity<List<FactureResponseDto>> findAllFactures() {
        List<Facture> factures = factureService.findAllFactures();
        if (factures.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(factureMapper.toDtoList(factures));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @GetMapping(path = "/statut/{statutPaiement}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Filtrer les factures par statut de paiement",
            description = "Récupère les factures selon leur statut de paiement (PAYE, IMPAYE, EN_RETARD, etc.).")
    public ResponseEntity<List<FactureResponseDto>> findFacturesByStatut(
            @Parameter(description = "Statut de paiement pour le filtrage", required = true,
                    schema = @Schema(implementation = StatutPaiement.class), example = "PAYE")
            @PathVariable("statutPaiement") StatutPaiement statutPaiement) {
        List<Facture> factures = factureService.findFacturesByStatut(statutPaiement);
        if (factures.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(factureMapper.toDtoList(factures));
    }

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
    @GetMapping(path = "/mode/{modePaiement}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Filtrer les factures par mode de paiement",
            description = "Récupère les factures selon leur mode de paiement (CARTE, ESPECES, VIREMENT, etc.).")
    public ResponseEntity<List<FactureResponseDto>> findFacturesByModePaiement(
            @Parameter(description = "Mode de paiement pour le filtrage", required = true,
                    schema = @Schema(implementation = ModePaiement.class), example = "CARTE_BANCAIRE")
            @PathVariable("modePaiement") ModePaiement modePaiement) {
        List<Facture> factures = factureService.findFacturesByModePaiement(modePaiement);
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
    @DeleteMapping(path = "/{idFacture}")
    @Operation(summary = "Supprimer une facture",
            description = "Supprime définitivement une facture du système (opération irréversible).")
    public ResponseEntity<Void> deleteFacture(
            @Parameter(description = "ID de la facture à supprimer", required = true, example = "1")
            @PathVariable("idFacture") Long id) {
        factureService.deleteFacture(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @GetMapping(path = "/{idFacture}/patient", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir le patient associé à une facture",
            description = "Récupère les informations du patient lié à une facture spécifique.")
    public ResponseEntity<PatientResponseDto> findPatientByFactureId(
            @Parameter(description = "ID de la facture pour trouver le patient associé", required = true, example = "1")
            @PathVariable("idFacture") Long id) {
        Patient patient = factureService.findPatientByFactureId(id);
        return ResponseEntity.ok(patientMapper.toDto(patient));
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