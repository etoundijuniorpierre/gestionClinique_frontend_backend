package com.example.GestionClinique.dto.RequestDto;

import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousRequestDto {
    @NotNull
    private Long patientId;

    @NotNull
    private LocalTime heure;

    @NotNull
    @FutureOrPresent
    private LocalDate jour;

    private String notes;

    @NotNull
    private ServiceMedical serviceMedical;

    @NotNull
    private Long medecinId;
}