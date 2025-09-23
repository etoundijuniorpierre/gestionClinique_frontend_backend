package com.example.GestionClinique.dto.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HistoriqueActionRequestDto {

    @NotBlank(message = "L'action ne peut pas être vide.")
    private String action;

    @NotNull(message = "La date de l'action est requise.")
    private LocalDate date;

    @NotNull(message = "L'ID de l'utilisateur est requis.")
    private Long utilisateurId;
}