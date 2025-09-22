package com.example.GestionClinique.dto.RequestDto;

import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
public class UtilisateurRequestDto extends InfoPersonnelRequestDto {
    @NotNull
    private String password;
    private ServiceMedical serviceMedicalName;
    private Boolean actif;
    @NotNull
    private RoleRequestDto role;
}