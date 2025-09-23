package com.example.GestionClinique.dto.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionRequestDto {
    private Long consultantId;

    @NotBlank
    private String typePrescription;

    @NotBlank
    private String medicaments;

    @NotBlank
    private String instructions;
    private String dureePrescription;

    @NotNull
    private Long quantite;
}