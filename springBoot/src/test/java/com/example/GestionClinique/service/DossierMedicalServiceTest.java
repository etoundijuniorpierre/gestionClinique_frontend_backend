package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.DossierMedical;
import com.example.GestionClinique.repository.DossierMedicalRepository;
import com.example.GestionClinique.service.serviceImpl.DossierMedicalServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static com.example.GestionClinique.testutils.MockDataFactory.createMockDossierMedical;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("DossierMedical Service Unit Tests")
class DossierMedicalServiceTest {

    @Mock
    private DossierMedicalRepository dossierMedicalRepository;

    @InjectMocks
    private DossierMedicalServiceImpl dossierMedicalService;

    @Test
    @DisplayName("Should find dossier by ID")
    void testFindById() {
        DossierMedical dossier = createMockDossierMedical();
        when(dossierMedicalRepository.findById(1L)).thenReturn(Optional.of(dossier));

        DossierMedical result = dossierMedicalService.findDossierMedicalById(1L);

        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("Should find dossier by patient ID")
    void testFindByPatientId() {
        DossierMedical dossier = createMockDossierMedical();
        when(dossierMedicalRepository.findByPatientId(1L)).thenReturn(Optional.of(dossier));

        DossierMedical result = dossierMedicalService.findDossierMedicalByPatientId(1L);

        assertThat(result).isNotNull();
    }
}
