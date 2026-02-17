package com.example.GestionClinique.dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceMedicalResponseDto extends BaseResponseDto{
    private String nomService;
    private String serviceMedicalName;
    private UtilisateurResponseDto medecinResponsable;
    private List<UtilisateurResponseDto> medecinInfos;
}
