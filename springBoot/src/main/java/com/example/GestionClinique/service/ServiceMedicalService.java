package com.example.GestionClinique.service;

import com.example.GestionClinique.dto.RequestDto.ServiceMedicalRequestDto;
import com.example.GestionClinique.dto.ResponseDto.ServiceMedicalResponseDto;
import com.example.GestionClinique.model.entity.Utilisateur;

import java.util.List;

public interface ServiceMedicalService {

    ServiceMedicalResponseDto createServiceMedical(ServiceMedicalRequestDto serviceMedicalRequestDto);

    ServiceMedicalResponseDto getServiceMedicalById(Long id);

    List<ServiceMedicalResponseDto> getAllServicesMedicaux();

    ServiceMedicalResponseDto updateServiceMedical(Long id, ServiceMedicalRequestDto serviceMedicalRequestDto);

    void deleteServiceMedical(Long id);

    List<ServiceMedicalResponseDto> getServicesMedicauxByMedecinResponsable(Long medecinId);

    List<Utilisateur> getMedecinsByServiceMedicalId(Long serviceMedicalId);

    List<Utilisateur> getAllResponsablesServicesMedicaux();
}
