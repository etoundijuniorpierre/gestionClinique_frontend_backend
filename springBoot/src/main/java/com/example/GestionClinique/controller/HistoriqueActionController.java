package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.ResponseDto.HistoriqueActionResponseDto;
import com.example.GestionClinique.mapper.HistoriqueActionMapper;
import com.example.GestionClinique.model.entity.HistoriqueAction;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.GestionClinique.service.HistoriqueActionService;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

import static com.example.GestionClinique.configuration.utils.Constants.API_NAME;

@Tag(name = "Gestion des Historiques d'Actions", description = "API pour la gestion et le suivi des actions dans le système")
@RequestMapping(API_NAME + "/historiqueActions")
@RestController
@AllArgsConstructor
public class HistoriqueActionController {

    private final HistoriqueActionService historiqueActionService;
    private final HistoriqueActionMapper historiqueActionMapper;

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lister tout l'historique des actions",
            description = "Récupère la liste complète et chronologique de toutes les actions enregistrées dans le système")
    public ResponseEntity<List<HistoriqueActionResponseDto>> findAllHistoriqueActions() {
        List<HistoriqueAction> actions = historiqueActionService.findAllHistoriqueActionsDesc();
        if (actions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(historiqueActionMapper.toDtoList(actions));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(path = "/{idHistorique}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Récupérer une action spécifique par ID",
            description = "Trouve et retourne les détails complets d'une action particulière dans l'historique")
    public ResponseEntity<HistoriqueActionResponseDto> findHistoriqueActionById(
            @Parameter(description = "ID unique de l'action historique à récupérer", required = true, example = "1")
            @PathVariable("idHistorique") Long id) {

        HistoriqueAction action = historiqueActionService.findHistoriqueActionById(id);
        return ResponseEntity.ok(historiqueActionMapper.toDto(action));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(path = "/utilisateur/{utilisateurId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Historique des actions par utilisateur",
            description = "Récupère la liste chronologique de toutes les actions effectuées par un utilisateur spécifique")
    public ResponseEntity<List<HistoriqueActionResponseDto>> findHistoriqueActionsByUtilisateurId(
            @Parameter(description = "ID de l'utilisateur dont on veut l'historique", required = true, example = "5")
            @PathVariable("utilisateurId") Long utilisateurId) {

        List<HistoriqueAction> actions = historiqueActionService.findHistoriqueActionsByUtilisateurId(utilisateurId);
        if (actions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(historiqueActionMapper.toDtoList(actions));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(path = "/utilisateur/nom/{utilisateurName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Historique des actions par nom d'utilisateur",
            description = "Récupère la liste chronologique de toutes les actions effectuées par un utilisateur dont le nom contient la chaîne spécifiée.")
    public ResponseEntity<List<HistoriqueActionResponseDto>> findHistoriqueActionsByUtilisateurName(
            @Parameter(description = "Nom (partiel) de l'utilisateur", required = true, example = "Jean")
            @PathVariable("utilisateurName") String utilisateurName) {

        List<HistoriqueAction> actions = historiqueActionService.findHistoriqueActionsByUtilisateurName(utilisateurName);
        if (actions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(historiqueActionMapper.toDtoList(actions));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(path = "/periode", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Filtrer l'historique par période temporelle",
            description = "Récupère toutes les actions enregistrées entre deux dates spécifiées (inclusives).")
    public ResponseEntity<List<HistoriqueActionResponseDto>> findHistoriqueActionsByDateRange(
            @Parameter(description = "Date de début de la période (format: YYYY-MM-DD)", required = true, example = "2023-01-01")
            @RequestParam("startDate") LocalDate startDate,
            @Parameter(description = "Date de fin de la période (format: YYYY-MM-DD)", required = true, example = "2023-12-31")
            @RequestParam("endDate") LocalDate endDate) {

        List<HistoriqueAction> actions = historiqueActionService.findHistoriqueActionsByDateRange(startDate, endDate);
        if (actions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(historiqueActionMapper.toDtoList(actions));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping(path = "/recherche", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Rechercher dans l'historique des actions",
            description = "Filtre les actions par nom, prénom, email ou mot clé dans la description.")
    public ResponseEntity<List<HistoriqueActionResponseDto>> rechercherHistorique(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String motCle) {
        List<HistoriqueAction> resultats = historiqueActionService.rechercherHistorique(nom, prenom, email, motCle);
        if (resultats.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(historiqueActionMapper.toDtoList(resultats));
    }
}
