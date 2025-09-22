package com.example.GestionClinique.dto.RequestDto;

import com.example.GestionClinique.model.entity.enumElem.ModePaiement;
import com.example.GestionClinique.model.entity.enumElem.StatutPaiement;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FactureRequestDto {

    @NotNull
    private Long rendezVousId;

    @NotNull
    @Positive
    private Double montant;

    private LocalDate dateEmission;

    @NotNull
    private StatutPaiement statutPaiement = StatutPaiement.IMPAYEE;

    @NotNull
    private ModePaiement modePaiement = ModePaiement.ESPECES;
}