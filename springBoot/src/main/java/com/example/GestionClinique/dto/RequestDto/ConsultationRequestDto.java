package com.example.GestionClinique.dto.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationRequestDto {

    @NotBlank
    private String motifs;

    @NotBlank
    private String tensionArterielle;

    @NotNull
    private Float temperature;

    @NotNull
    private Float poids;

    @NotNull
    private Float taille;

    @NotBlank
    private String compteRendu;

    @NotBlank
    private String diagnostic;
    private Long rendezVousId;
    private List<PrescriptionRequestDto> prescriptions;
}