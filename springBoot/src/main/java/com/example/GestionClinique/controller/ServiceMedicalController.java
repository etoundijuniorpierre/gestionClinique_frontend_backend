package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.RequestDto.ServiceMedicalRequestDto;
import com.example.GestionClinique.dto.ResponseDto.ServiceMedicalResponseDto;
import com.example.GestionClinique.dto.ResponseDto.UtilisateurResponseDto;
import com.example.GestionClinique.mapper.UtilisateurMapper;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.service.ServiceMedicalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.GestionClinique.configuration.utils.Constants.API_NAME;

@RestController
@RequestMapping(API_NAME + "/services-medicaux")
@RequiredArgsConstructor
@Tag(name = "GESTION DES SERVICES MÉDICAUX", description = "API pour la gestion des services médicaux (réservé à l'administrateur)")
public class ServiceMedicalController {

    private final ServiceMedicalService serviceMedicalService;
    private final UtilisateurMapper utilisateurMapper;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer un service médical", description = "Permet à l'administrateur de créer un nouveau service médical")
    public ResponseEntity<ServiceMedicalResponseDto> createServiceMedical(
            @Valid @RequestBody ServiceMedicalRequestDto serviceMedicalRequestDto) {
        ServiceMedicalResponseDto createdService = serviceMedicalService.createServiceMedical(serviceMedicalRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Récupérer un service médical par ID", description = "Permet à l'administrateur de récupérer un service médical par son ID")
    public ResponseEntity<ServiceMedicalResponseDto> getServiceMedicalById(@PathVariable Long id) {
        ServiceMedicalResponseDto serviceMedical = serviceMedicalService.getServiceMedicalById(id);
        return ResponseEntity.ok(serviceMedical);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Récupérer tous les services médicaux", description = "Permet à l'administrateur de récupérer tous les services médicaux")
    public ResponseEntity<List<ServiceMedicalResponseDto>> getAllServicesMedicaux() {
        List<ServiceMedicalResponseDto> servicesMedicaux = serviceMedicalService.getAllServicesMedicaux();
        return ResponseEntity.ok(servicesMedicaux);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mettre à jour un service médical", description = "Permet à l'administrateur de mettre à jour un service médical existant")
    public ResponseEntity<ServiceMedicalResponseDto> updateServiceMedical(
            @PathVariable Long id,
            @Valid @RequestBody ServiceMedicalRequestDto serviceMedicalRequestDto) {
        ServiceMedicalResponseDto updatedService = serviceMedicalService.updateServiceMedical(id, serviceMedicalRequestDto);
        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un service médical", description = "Permet à l'administrateur de supprimer un service médical")
    public ResponseEntity<Void> deleteServiceMedical(@PathVariable Long id) {
        serviceMedicalService.deleteServiceMedical(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/medecin-responsable/{medecinId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Récupérer les services par médecin responsable", description = "Permet à l'administrateur de récupérer les services gérés par un médecin spécifique")
    public ResponseEntity<List<ServiceMedicalResponseDto>> getServicesByMedecinResponsable(@PathVariable Long medecinId) {
        List<ServiceMedicalResponseDto> services = serviceMedicalService.getServicesMedicauxByMedecinResponsable(medecinId);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{serviceId}/medecins")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Récupérer les médecins d'un service médical", description = "Permet à l'administrateur de récupérer tous les médecins (responsable inclus) d'un service médical")
    public ResponseEntity<List<UtilisateurResponseDto>> getMedecinsByServiceMedicalId(@PathVariable Long serviceId) {
        List<Utilisateur> medecins = serviceMedicalService.getMedecinsByServiceMedicalId(serviceId);
        List<UtilisateurResponseDto> medecinDtos = medecins.stream()
                .map(utilisateurMapper::toDto)
                .toList();
        return ResponseEntity.ok(medecinDtos);
    }

    @GetMapping("/responsables")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Récupérer tous les responsables de services médicaux", description = "Permet à l'administrateur de récupérer tous les médecins responsables de services médicaux")
    public ResponseEntity<List<UtilisateurResponseDto>> getAllResponsablesServicesMedicaux() {
        List<Utilisateur> responsables = serviceMedicalService.getAllResponsablesServicesMedicaux();
        List<UtilisateurResponseDto> responsableDtos = responsables.stream()
                .map(utilisateurMapper::toDto)
                .toList();
        return ResponseEntity.ok(responsableDtos);
    }
}
