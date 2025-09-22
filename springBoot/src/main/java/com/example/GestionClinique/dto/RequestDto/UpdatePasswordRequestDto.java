package com.example.GestionClinique.dto.RequestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePasswordRequestDto {
    @NotBlank
    private String newPassword;
    @NotBlank
    private String confirmPassword;
}
