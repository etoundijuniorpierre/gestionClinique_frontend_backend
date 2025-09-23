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
}
