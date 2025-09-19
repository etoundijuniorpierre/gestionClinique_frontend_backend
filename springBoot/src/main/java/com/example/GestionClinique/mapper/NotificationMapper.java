package com.example.GestionClinique.mapper;

import com.example.GestionClinique.dto.RequestDto.NotificationRequestDto;
import com.example.GestionClinique.dto.ResponseDto.NotificationResponseDto;
import com.example.GestionClinique.model.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    @Mapping(source = "utilisateur.id", target = "utilisateurId")
    @Mapping(source = "message.id", target = "messageId")
    @Mapping(source = "rendezVous.id", target = "rendezVousId")
    NotificationResponseDto toDto(Notification notification);

    Notification toEntity(NotificationRequestDto dto);

    List<NotificationResponseDto> toDtos(List<Notification> notifications);
}

