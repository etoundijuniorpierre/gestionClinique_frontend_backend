package com.example.GestionClinique.mapper;

import com.example.GestionClinique.dto.RequestDto.ServiceMedicalRequestDto;
import com.example.GestionClinique.dto.ResponseDto.ServiceMedicalResponseDto;
import com.example.GestionClinique.dto.ResponseDto.UtilisateurResponseDto;
import com.example.GestionClinique.model.entity.ServiceMedical;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.repository.UtilisateurRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class ServiceMedicalMapper {

    @Autowired
    protected UtilisateurRepository utilisateurRepository;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "medecins", ignore = true)
    @Mapping(source = "medecinResponsableId", target = "medecinResponsable")
    public abstract ServiceMedical toEntity(ServiceMedicalRequestDto dto);

    @Mapping(target = "medecinResponsable", source = "medecinResponsable")
    @Mapping(target = "medecinResponsable.serviceMedicalName", source = "nomService")
    @Mapping(target = "medecinInfos", source = "medecins")
    @Mapping(target = "serviceMedicalName", source = "nomService")
    public abstract ServiceMedicalResponseDto toDto(ServiceMedical entity);

    public abstract List<ServiceMedicalResponseDto> toDtoList(List<ServiceMedical> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "medecins", ignore = true)
    @Mapping(source = "medecinResponsableId", target = "medecinResponsable")
    public abstract ServiceMedical updateEntityFromDto(ServiceMedicalRequestDto dto, @MappingTarget ServiceMedical entity);

    protected Utilisateur mapMedecinResponsableIdToUtilisateur(Long medecinId) {
        if (medecinId == null) {
            return null;
        }
        return utilisateurRepository.findById(medecinId).orElse(null);
    }

    protected Long mapUtilisateurToMedecinResponsableId(Utilisateur utilisateur) {
        if (utilisateur == null) return null;
        return utilisateur.getId();
    }

    protected List<Utilisateur> mapMedecinIdsToMedecins(List<Long> medecinIds) {
        if (medecinIds == null || medecinIds.isEmpty()) return null;
        return medecinIds.stream()
                .map(id -> utilisateurRepository.findById(id).orElse(null))
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    protected List<Long> mapMedecinsToMedecinIds(List<Utilisateur> medecins) {
        if (medecins == null || medecins.isEmpty()) return null;
        return medecins.stream()
                .map(Utilisateur::getId)
                .collect(Collectors.toList());
    }
}
