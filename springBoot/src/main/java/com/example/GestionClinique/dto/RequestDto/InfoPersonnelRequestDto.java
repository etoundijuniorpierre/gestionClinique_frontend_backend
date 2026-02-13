package com.example.GestionClinique.dto.RequestDto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class InfoPersonnelRequestDto {
    @NotEmpty(message = "Le nom est obligatoire")
    private String nom;

    @NotEmpty(message = "Le prénom est obligatoire")
    private String prenom;

    @Email(message = "L'email doit être valide")
    private String email;

    @NotNull(message = "La date de naissance est obligatoire")
    private LocalDate dateNaissance;

    @NotNull(message = "Le téléphone est obligatoire")
    private String telephone;

    private String adresse;

    @NotNull(message = "Le genre est obligatoire")
    private String genre;
}
