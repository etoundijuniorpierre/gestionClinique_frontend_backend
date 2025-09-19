package com.example.GestionClinique.dto.RequestDto;

import com.example.GestionClinique.model.entity.enumElem.NotificationType;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class NotificationRequestDto extends InfoPersonnelRequestDto {
    private Long utilisateurId;
    private String contenu;
    private NotificationType type;
    private Long messageId;
    private Long rendezVousId;
}
