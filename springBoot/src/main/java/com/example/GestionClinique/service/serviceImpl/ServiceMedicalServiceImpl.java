package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.dto.RequestDto.ServiceMedicalRequestDto;
import com.example.GestionClinique.dto.ResponseDto.ServiceMedicalResponseDto;
import com.example.GestionClinique.exception.ResourceNotFoundException;
import com.example.GestionClinique.mapper.ServiceMedicalMapper;
import com.example.GestionClinique.model.entity.ServiceMedical;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.repository.ServiceMedicalRepository;
import com.example.GestionClinique.repository.UtilisateurRepository;
import com.example.GestionClinique.service.ServiceMedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceMedicalServiceImpl implements ServiceMedicalService {

    private final ServiceMedicalRepository serviceMedicalRepository;
    private final ServiceMedicalMapper serviceMedicalMapper;
    private final UtilisateurRepository utilisateurRepository;

    @Override
    public ServiceMedicalResponseDto createServiceMedical(ServiceMedicalRequestDto serviceMedicalRequestDto) {
        if (serviceMedicalRepository.existsByNomService(serviceMedicalRequestDto.getNomService())) {
            throw new IllegalArgumentException("Un service médical avec ce nom existe déjà");
        }

        ServiceMedical serviceMedical = serviceMedicalMapper.toEntity(serviceMedicalRequestDto);
        serviceMedical.setCreationDate(LocalDateTime.now());
        
        ServiceMedical savedServiceMedical = serviceMedicalRepository.save(serviceMedical);
        
        if (serviceMedicalRequestDto.getMedecinResponsableId() != null) {
            Utilisateur medecinResponsable = utilisateurRepository.findById(serviceMedicalRequestDto.getMedecinResponsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Médecin responsable non trouvé"));
            medecinResponsable.setResponsableServiceMedical(true);
            medecinResponsable.setNomServiceMedicalResponsable(serviceMedicalRequestDto.getNomService());
            utilisateurRepository.save(medecinResponsable);
        }
        
        return serviceMedicalMapper.toDto(savedServiceMedical);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceMedicalResponseDto getServiceMedicalById(Long id) {
        ServiceMedical serviceMedical = serviceMedicalRepository.findByIdWithMedecins(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service médical non trouvé avec l'ID: " + id));
        return serviceMedicalMapper.toDto(serviceMedical);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceMedicalResponseDto> getAllServicesMedicaux() {
        List<ServiceMedical> servicesMedicaux = serviceMedicalRepository.findAllWithMedecins();
        return serviceMedicalMapper.toDtoList(servicesMedicaux);
    }

    @Override
    public ServiceMedicalResponseDto updateServiceMedical(Long id, ServiceMedicalRequestDto serviceMedicalRequestDto) {
        ServiceMedical existingServiceMedical = serviceMedicalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service médical non trouvé avec l'ID: " + id));

        if (!existingServiceMedical.getNomService().equals(serviceMedicalRequestDto.getNomService()) &&
            serviceMedicalRepository.existsByNomService(serviceMedicalRequestDto.getNomService())) {
            throw new IllegalArgumentException("Un service médical avec ce nom existe déjà");
        }

        Long oldResponsableId = existingServiceMedical.getMedecinResponsable() != null ? 
                existingServiceMedical.getMedecinResponsable().getId() : null;
        Long newResponsableId = serviceMedicalRequestDto.getMedecinResponsableId();

        if (oldResponsableId != null && !oldResponsableId.equals(newResponsableId)) {
            Utilisateur oldResponsable = utilisateurRepository.findById(oldResponsableId).orElse(null);
            if (oldResponsable != null) {
                oldResponsable.setResponsableServiceMedical(false);
                oldResponsable.setNomServiceMedicalResponsable(null);
                utilisateurRepository.save(oldResponsable);
            }
        }

        if (newResponsableId != null && !newResponsableId.equals(oldResponsableId)) {
            Utilisateur newResponsable = utilisateurRepository.findById(newResponsableId)
                    .orElseThrow(() -> new ResourceNotFoundException("Médecin responsable non trouvé"));
            newResponsable.setResponsableServiceMedical(true);
            newResponsable.setNomServiceMedicalResponsable(serviceMedicalRequestDto.getNomService());
            utilisateurRepository.save(newResponsable);
        }

        serviceMedicalMapper.updateEntityFromDto(serviceMedicalRequestDto, existingServiceMedical);
        existingServiceMedical.setModificationDate(LocalDateTime.now());
        
        ServiceMedical updatedServiceMedical = serviceMedicalRepository.save(existingServiceMedical);
        return serviceMedicalMapper.toDto(updatedServiceMedical);
    }

    @Override
    public void deleteServiceMedical(Long id) {
        ServiceMedical serviceMedical = serviceMedicalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service médical non trouvé avec l'ID: " + id));

        if (serviceMedical.getMedecinResponsable() != null) {
            Utilisateur responsable = serviceMedical.getMedecinResponsable();
            responsable.setResponsableServiceMedical(false);
            responsable.setNomServiceMedicalResponsable(null);
            utilisateurRepository.save(responsable);
        }
        
        serviceMedicalRepository.delete(serviceMedical);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceMedicalResponseDto> getServicesMedicauxByMedecinResponsable(Long medecinId) {
        List<ServiceMedical> servicesMedicaux = serviceMedicalRepository.findByMedecinResponsableId(medecinId);
        return servicesMedicaux.stream()
                .map(serviceMedicalMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Utilisateur> getMedecinsByServiceMedicalId(Long serviceMedicalId) {
        ServiceMedical serviceMedical = serviceMedicalRepository.findByIdWithMedecins(serviceMedicalId)
                .orElseThrow(() -> new ResourceNotFoundException("Service médical non trouvé avec l'ID: " + serviceMedicalId));
        
        List<Utilisateur> medecins = new ArrayList<>(serviceMedical.getMedecins());
        
        if (serviceMedical.getMedecinResponsable() != null && 
            !medecins.contains(serviceMedical.getMedecinResponsable())) {
            medecins.add(serviceMedical.getMedecinResponsable());
        }
        
        return medecins;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Utilisateur> getAllResponsablesServicesMedicaux() {
        return utilisateurRepository.findByResponsableServiceMedicalTrue();
    }
}
