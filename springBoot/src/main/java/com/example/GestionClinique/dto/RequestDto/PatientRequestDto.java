package com.example.GestionClinique.dto.RequestDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
public class PatientRequestDto extends InfoPersonnelRequestDto {
    @Valid
    @NotNull
    private DossierMedicalRequestDto dossierMedical;
}