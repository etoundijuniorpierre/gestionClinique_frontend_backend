package com.example.GestionClinique.dto.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceMedicalRequestDto {

    @NotBlank(message = "Le nom du service est obligatoire")
    private String nomService;

    @NotNull(message = "Le médecin responsable est obligatoire")
    private Long medecinResponsableId;

    private List<Long> medecinIds;
}
