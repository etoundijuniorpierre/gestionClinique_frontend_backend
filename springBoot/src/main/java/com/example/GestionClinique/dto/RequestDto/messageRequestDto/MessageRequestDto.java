package com.example.GestionClinique.dto.RequestDto.messageRequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequestDto {
    @NotBlank
    private String contenu;
    private boolean lu;

    @NotNull
    private Long expediteurId;

    private Long groupeId;
    private Long conversationId;
}

