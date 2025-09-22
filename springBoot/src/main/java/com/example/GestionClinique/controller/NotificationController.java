package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.ResponseDto.NotificationResponseDto;
import com.example.GestionClinique.mapper.NotificationMapper;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.repository.UtilisateurRepository;
import com.example.GestionClinique.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.GestionClinique.configuration.utils.Constants.API_NAME;

@Tag(name = "Notifications", description = "Gestion des notifications utilisateurs")
@RestController
@RequestMapping(API_NAME + "/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;
    private final UtilisateurRepository utilisateurRepository;

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN', 'MEDECIN')")
    @Operation(summary = "Récupérer toutes les notifications d'un utilisateur")
    @GetMapping("/utilisateur/{userId}")
    public ResponseEntity<List<NotificationResponseDto>> getAllNotifications(@PathVariable Long userId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        List<NotificationResponseDto> dtos = notificationMapper.toDtos(
                notificationService.getNotificationsByUtilisateur(utilisateur)
        );
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN', 'MEDECIN')")
    @Operation(summary = "Récupérer les notifications non lues d'un utilisateur")
    @GetMapping("/utilisateur/{userId}/non-lues")
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@PathVariable Long userId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        List<NotificationResponseDto> dtos = notificationMapper.toDtos(
                notificationService.getUnreadNotifications(utilisateur)
        );
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN', 'MEDECIN')")
    @Operation(summary = "Marquer une notification comme lue")
    @PostMapping("/{notificationId}/marquer-lue")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }
}
