package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.Prescription;
import com.example.GestionClinique.repository.PrescriptionRepository;
import com.example.GestionClinique.service.serviceImpl.PrescriptionServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static com.example.GestionClinique.testutils.MockDataFactory.createMockPrescription;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Prescription Service Unit Tests")
class PrescriptionServiceTest {

    @Mock
    private PrescriptionRepository prescriptionRepository;

    @InjectMocks
    private PrescriptionServiceImpl prescriptionService;

    @Test
    @DisplayName("Should find prescription by ID")
    void testFindById() {
        Prescription prescription = createMockPrescription();
        when(prescriptionRepository.findById(1L)).thenReturn(Optional.of(prescription));

        Prescription result = prescriptionService.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should find by consultation ID")
    void testFindByConsultationId() {
        Prescription prescription = createMockPrescription();
        when(prescriptionRepository.findByConsultationId(1L)).thenReturn(List.of(prescription));

        List<Prescription> results = prescriptionService.findPrescriptionByConsultationId(1L);

        assertThat(results).hasSize(1);
    }
}
