package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.RequestDto.RendezVousRequestDto;
import com.example.GestionClinique.dto.ResponseDto.RendezVousResponseDto;
import com.example.GestionClinique.mapper.RendezVousMapper;
import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.service.RendezVousService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static com.example.GestionClinique.configuration.utils.Constants.API_NAME;

@Tag(name = "Gestion des Rendez-vous", description = "API pour la gestion des rendez-vous médicaux")
@RequestMapping(API_NAME + "/rendezvous")
@RestController
@AllArgsConstructor
public class RendezVousController {

    private final RendezVousService rendezVousService;
    private final RendezVousMapper rendezVousMapper;

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @PostMapping(path = "/createRendezVous", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Créer un nouveau rendez-vous médical",
            description = "Permet de programmer un nouveau rendez-vous entre un patient et un professionnel de santé")
    public ResponseEntity<RendezVousResponseDto> createRendezVous(
            @Parameter(description = "Détails du rendez-vous à créer", required = true)
            @Valid @RequestBody RendezVousRequestDto rendezVousRequestDto) {
        RendezVous rendezVousToCreate = rendezVousMapper.toEntity(rendezVousRequestDto);
        RendezVous createdRendezVous = rendezVousService.createRendezVous(rendezVousToCreate);
        RendezVousResponseDto responseDto = rendezVousMapper.toDto(createdRendezVous);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'MEDECIN', 'ADMIN')")
    @GetMapping(path = "/{idRendezVous}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Obtenir un rendez-vous par son ID",
            description = "Récupère les informations détaillées d'un rendez-vous spécifique")
    public ResponseEntity<RendezVousResponseDto> findRendezVousById(
            @Parameter(description = "ID du rendez-vous à récupérer", required = true, example = "123")
            @PathVariable("idRendezVous") Long id) {
        RendezVous rendezVous = rendezVousService.findRendezVousById(id);
        return ResponseEntity.ok(rendezVousMapper.toDto(rendezVous));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @PutMapping(path = "/{idRendezVous}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Mettre à jour un rendez-vous existant",
            description = "Modifie les détails d'un rendez-vous programmé")
    public ResponseEntity<RendezVousResponseDto> updateRendezVous(
            @Parameter(description = "ID du rendez-vous à mettre à jour", required = true, example = "123")
            @PathVariable("idRendezVous") Long id,
            @Parameter(description = "Nouveaux détails du rendez-vous", required = true)
            @Valid @RequestBody RendezVousRequestDto rendezVousRequestDto) {
        RendezVous existingRendezVous = rendezVousService.findRendezVousById(id);
        rendezVousMapper.updateEntityFromDto(rendezVousRequestDto, existingRendezVous);
        RendezVous updatedRendezVous = rendezVousService.updateRendezVous(id, existingRendezVous);
        return ResponseEntity.ok(rendezVousMapper.toDto(updatedRendezVous));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @DeleteMapping(path = "/{idRendezVous}")
    @Operation(summary = "Supprimer un rendez-vous",
            description = "Annule et supprime définitivement un rendez-vous du système")
    public ResponseEntity<Void> deleteRendezVous(
            @Parameter(description = "ID du rendez-vous à supprimer", required = true, example = "123")
            @PathVariable("idRendezVous") Long id) {
        rendezVousService.deleteRendezVous(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'MEDECIN', 'ADMIN')")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lister tous les rendez-vous",
            description = "Récupère la liste complète de tous les rendez-vous programmés")
    public ResponseEntity<List<RendezVousResponseDto>> findAllRendezVous() {
        List<RendezVous> rendezvousList = rendezVousService.findAllRendezVous();
        if (rendezvousList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(rendezVousMapper.toDtoList(rendezvousList));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'MEDECIN')")
    @GetMapping(path = "/jour/{jour}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Rechercher des rendez-vous par jour",
            description = "Récupère une liste de tous les rendez-vous programmés pour une date spécifique.")
    public ResponseEntity<List<RendezVousResponseDto>> findRendezVousByJour(
            @Parameter(description = "Date du jour à rechercher (format yyyy-MM-dd)", required = true, example = "2025-06-28")
            @PathVariable("jour") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour) {
        List<RendezVous> rendezvousList = rendezVousService.findRendezVousByJour(jour);
        if (rendezvousList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(rendezVousMapper.toDtoList(rendezvousList));
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE')")
    @PutMapping(path = "/{idRendezVous}/cancel", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Annuler un rendez-vous",
            description = "Change le statut d'un rendez-vous existant à 'annulé'")
    public ResponseEntity<RendezVousResponseDto> cancelRendezVous(
            @Parameter(description = "ID du rendez-vous à annuler", required = true, example = "123")
            @PathVariable("idRendezVous") Long idRendezVous) {
        RendezVous canceledRendezVous = rendezVousService.cancelRendezVous(idRendezVous);
        return ResponseEntity.ok(rendezVousMapper.toDto(canceledRendezVous));
    }

    @PostMapping("/cancel-old")
    @Operation(summary = "Annuler un rendez-vous et supprimer facture liée",
            description = "annuler un vieux rendezVous et supprimer la facture liée")
    public ResponseEntity<String> cancelOldRendezVous() {
        rendezVousService.cancelRendezVousByJour();
        return ResponseEntity.ok("Tous les rendez-vous antérieurs à la date d'aujourd'hui ont été annulés.");
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN', 'MEDECIN')")
    @GetMapping("/utilisateurs/{idUtilisateur}/confirmed/month/{year}/{month}")
    @Operation(summary = "Obtenir les rendez-vous confirmés d'un utilisateur pour un mois donné",
            description = "Récupère tous les rendez-vous confirmés pour un utilisateur spécifique dans un mois et une année donnés.")
    public ResponseEntity<List<RendezVousResponseDto>> getConfirmedRendezVousByMonth(
            @PathVariable @Parameter(description = "ID de l'utilisateur") Long idUtilisateur,
            @PathVariable @Parameter(description = "Année des rendez-vous") int year,
            @PathVariable @Parameter(description = "Mois des rendez-vous (1-12)") int month) {
        List<RendezVous> rendezVousEntities = rendezVousService.findUtilisateurConfirmedRendezVousByMonth(idUtilisateur, year, month);
        List<RendezVousResponseDto> rendezVousDtos = rendezVousMapper.toDtoList(rendezVousEntities);
        return ResponseEntity.ok(rendezVousDtos);
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN', 'MEDECIN')")
    @GetMapping("/month/{year}/{month}")
    @Operation(summary = "Obtenir les rendez-vous pour un mois donné",
            description = "Récupère tous les rendez-vous dans un mois et une année donnés.")
    public ResponseEntity<List<RendezVousResponseDto>> getRendezVousByMonth(
            @PathVariable @Parameter(description = "Année des rendez-vous") int year,
            @PathVariable @Parameter(description = "Mois des rendez-vous (1-12)") int month) {
        List<RendezVous> rendezVousEntities = rendezVousService.findRendezVousByMonth(year, month);
        List<RendezVousResponseDto> rendezVousDtos = rendezVousMapper.toDtoList(rendezVousEntities);
        return ResponseEntity.ok(rendezVousDtos);
    }
}
