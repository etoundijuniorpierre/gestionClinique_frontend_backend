package com.example.GestionClinique.dto.ResponseDto;

import com.example.GestionClinique.model.entity.enumElem.NotificationType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationResponseDto extends BaseResponseDto {
    private String contenu;
    private NotificationType type;
    private boolean lu;
    private LocalDateTime dateCreation;
    private Long utilisateurId;
    private Long messageId;
    private Long rendezVousId;
}
