package com.example.GestionClinique.service;

import com.example.GestionClinique.exception.BusinessException;
import com.example.GestionClinique.exception.ResourceNotFoundException;
import com.example.GestionClinique.model.entity.Patient;
import com.example.GestionClinique.repository.PatientRepository;
import com.example.GestionClinique.service.serviceImpl.PatientServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for PatientService using Mockito
 * Tests all CRUD operations and business logic
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Patient Service Tests")
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientServiceImpl patientService;

    private Patient testPatient;

    @BeforeEach
    void setUp() {
        testPatient = new Patient();
        testPatient.setId(1L);
        testPatient.setNom("Nguemo");
        testPatient.setPrenom("Jean");
        testPatient.setEmail("jean.nguemo@email.com");
        testPatient.setTelephone("677889900");
        testPatient.setAdresse("Bastos, Yaoundé");
        testPatient.setDateNaissance(LocalDate.of(1993, 5, 15));
        testPatient.setAge(32);
        testPatient.setGenre("M");
    }

    @Test
    @DisplayName("Should create patient successfully")
    void testCreatePatient_Success() {
        // Given
        when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);

        // When
        Patient createdPatient = patientService.createPatient(testPatient);

        // Then
        assertThat(createdPatient).isNotNull();
        assertThat(createdPatient.getNom()).isEqualTo("Nguemo");
        assertThat(createdPatient.getEmail()).isEqualTo("jean.nguemo@email.com");
        verify(patientRepository, times(1)).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should throw exception when creating patient with null data")
    void testCreatePatient_NullData() {
        // Given
        Patient nullPatient = null;

        // When & Then
        assertThatThrownBy(() -> patientService.createPatient(nullPatient))
                .isInstanceOf(IllegalArgumentException.class);
        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should find patient by ID successfully")
    void testFindById_Success() {
        // Given
        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));

        // When
        Patient foundPatient = patientService.findById(1L);

        // Then
        assertThat(foundPatient).isNotNull();
        assertThat(foundPatient.getId()).isEqualTo(1L);
        assertThat(foundPatient.getNom()).isEqualTo("Nguemo");
        verify(patientRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when patient not found")
    void testFindById_NotFound() {
        // Given
        when(patientRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> patientService.findById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Patient not found");
        verify(patientRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should find all patients successfully")
    void testFindAllPatients_Success() {
        // Given
        Patient patient2 = new Patient();
        patient2.setId(2L);
        patient2.setNom("Mbappé");
        patient2.setPrenom("Aïcha");

        List<Patient> patients = Arrays.asList(testPatient, patient2);
        when(patientRepository.findAll()).thenReturn(patients);

        // When
        List<Patient> foundPatients = patientService.findAllPatients();

        // Then
        assertThat(foundPatients).isNotNull();
        assertThat(foundPatients).hasSize(2);
        assertThat(foundPatients.get(0).getNom()).isEqualTo("Nguemo");
        assertThat(foundPatients.get(1).getNom()).isEqualTo("Mbappé");
        verify(patientRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no patients exist")
    void testFindAllPatients_Empty() {
        // Given
        when(patientRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<Patient> foundPatients = patientService.findAllPatients();

        // Then
        assertThat(foundPatients).isNotNull();
        assertThat(foundPatients).isEmpty();
        verify(patientRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should update patient successfully")
    void testUpdatePatient_Success() {
        // Given
        Patient updatedDetails = new Patient();
        updatedDetails.setNom("Nguemo Updated");
        updatedDetails.setEmail("jean.updated@email.com");
        updatedDetails.setTelephone("677000000");

        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
        when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);

        // When
        Patient updatedPatient = patientService.updatePatient(1L, updatedDetails);

        // Then
        assertThat(updatedPatient).isNotNull();
        verify(patientRepository, times(1)).findById(1L);
        verify(patientRepository, times(1)).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent patient")
    void testUpdatePatient_NotFound() {
        // Given
        when(patientRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> patientService.updatePatient(999L, testPatient))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(patientRepository, times(1)).findById(999L);
        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should delete patient successfully")
    void testDeletePatient_Success() {
        // Given
        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
        doNothing().when(patientRepository).delete(any(Patient.class));

        // When
        patientService.deletePatient(1L);

        // Then
        verify(patientRepository, times(1)).findById(1L);
        verify(patientRepository, times(1)).delete(testPatient);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent patient")
    void testDeletePatient_NotFound() {
        // Given
        when(patientRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> patientService.deletePatient(999L))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(patientRepository, times(1)).findById(999L);
        verify(patientRepository, never()).delete(any(Patient.class));
    }

    @Test
    @DisplayName("Should find patients by name successfully")
    void testFindPatientByNom_Success() {
        // Given
        List<Patient> patients = Arrays.asList(testPatient);
        when(patientRepository.findByNomContainingIgnoreCase("Nguemo")).thenReturn(patients);

        // When
        List<Patient> foundPatients = patientService.findPatientByNom("Nguemo");

        // Then
        assertThat(foundPatients).isNotNull();
        assertThat(foundPatients).hasSize(1);
        assertThat(foundPatients.get(0).getNom()).isEqualTo("Nguemo");
        verify(patientRepository, times(1)).findByNomContainingIgnoreCase("Nguemo");
    }

    @Test
    @DisplayName("Should validate patient email format")
    void testValidateEmail_InvalidFormat() {
        // Given
        testPatient.setEmail("invalid-email");

        // When & Then
        assertThatThrownBy(() -> patientService.createPatient(testPatient))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Invalid email format");
    }

    @Test
    @DisplayName("Should validate patient age range")
    void testValidateAge_InvalidRange() {
        // Given
        testPatient.setAge(-5);

        // When & Then
        assertThatThrownBy(() -> patientService.createPatient(testPatient))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Age must be between 0 and 150");
    }

    @Test
    @DisplayName("Should validate required fields")
    void testValidateRequiredFields_MissingNom() {
        // Given
        testPatient.setNom(null);

        // When & Then
        assertThatThrownBy(() -> patientService.createPatient(testPatient))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Nom is required");
    }
}
