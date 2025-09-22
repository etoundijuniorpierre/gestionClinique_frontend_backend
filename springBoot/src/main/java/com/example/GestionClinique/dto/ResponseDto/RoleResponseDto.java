package com.example.GestionClinique.dto.ResponseDto;

import com.example.GestionClinique.model.entity.enumElem.RoleType;
import lombok.Data;

@Data
public class RoleResponseDto {
    private Long id;
    private RoleType roleType;
}