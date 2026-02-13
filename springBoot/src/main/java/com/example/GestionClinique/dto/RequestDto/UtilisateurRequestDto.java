package com.example.GestionClinique.dto.RequestDto;

import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
public class UtilisateurRequestDto extends InfoPersonnelRequestDto {
    @NotNull(message = "Le nom d'utilisateur est obligatoire")
    private String username;

    @NotNull(message = "Le mot de passe est obligatoire")
    private String password;

    private ServiceMedical serviceMedicalName;
    private Boolean actif;

    @NotNull(message = "Le rôle est obligatoire")
    private RoleRequestDto role;
}