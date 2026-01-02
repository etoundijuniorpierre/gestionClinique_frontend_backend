package com.example.GestionClinique.service;

import com.example.GestionClinique.exception.BusinessException;
import com.example.GestionClinique.exception.ResourceNotFoundException;
import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.model.entity.Patient;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.model.entity.enumElem.StatutRDV;
import com.example.GestionClinique.repository.RendezVousRepository;
import com.example.GestionClinique.service.serviceImpl.RendezVousServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for RendezVousService
 * Tests appointment management operations
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("RendezVous Service Tests")
class RendezVousServiceTest {

    @Mock
    private RendezVousRepository rendezVousRepository;

    @InjectMocks
    private RendezVousServiceImpl rendezVousService;

    private RendezVous testRendezVous;
    private Patient testPatient;
    private Utilisateur testMedecin;

    @BeforeEach
    void setUp() {
        testPatient = new Patient();
        testPatient.setId(1L);
        testPatient.setNom("Nguemo");
        testPatient.setPrenom("Jean");

        testMedecin = new Utilisateur();
        testMedecin.setId(1L);
        testMedecin.setNom("Dr. Mbappé");
        testMedecin.setPrenom("Amina");

        testRendezVous = new RendezVous();
        testRendezVous.setId(1L);
        testRendezVous.setJour(LocalDate.now().plusDays(1));
        testRendezVous.setHeure(LocalTime.of(10, 0));
        testRendezVous.setStatut(StatutRDV.CONFIRME);
        testRendezVous.setPatient(testPatient);
        testRendezVous.setMedecin(testMedecin);
        testRendezVous.setNotes("Consultation de routine");
    }

    @Test
    @DisplayName("Should create rendez-vous successfully")
    void testCreateRendezVous_Success() {
        // Given
        when(rendezVousRepository.save(any(RendezVous.class))).thenReturn(testRendezVous);

        // When
        RendezVous created = rendezVousService.createRendezVous(testRendezVous);

        // Then
        assertThat(created).isNotNull();
        assertThat(created.getStatut()).isEqualTo(StatutRDV.CONFIRME);
        assertThat(created.getPatient().getNom()).isEqualTo("Nguemo");
        verify(rendezVousRepository, times(1)).save(any(RendezVous.class));
    }

    @Test
    @DisplayName("Should find rendez-vous by ID")
    void testFindById_Success() {
        // Given
        when(rendezVousRepository.findById(1L)).thenReturn(Optional.of(testRendezVous));

        // When
        RendezVous found = rendezVousService.findById(1L);

        // Then
        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1L);
        verify(rendezVousRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when rendez-vous not found")
    void testFindById_NotFound() {
        // Given
        when(rendezVousRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> rendezVousService.findById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("RendezVous not found");
    }

    @Test
    @DisplayName("Should find all rendez-vous")
    void testFindAll_Success() {
        // Given
        RendezVous rdv2 = new RendezVous();
        rdv2.setId(2L);
        rdv2.setStatut(StatutRDV.EN_ATTENTE);

        List<RendezVous> rendezVousList = Arrays.asList(testRendezVous, rdv2);
        when(rendezVousRepository.findAll()).thenReturn(rendezVousList);

        // When
        List<RendezVous> found = rendezVousService.findAll();

        // Then
        assertThat(found).hasSize(2);
        assertThat(found.get(0).getStatut()).isEqualTo(StatutRDV.CONFIRME);
        assertThat(found.get(1).getStatut()).isEqualTo(StatutRDV.EN_ATTENTE);
    }

    @Test
    @DisplayName("Should update rendez-vous status")
    void testUpdateStatus_Success() {
        // Given
        when(rendezVousRepository.findById(1L)).thenReturn(Optional.of(testRendezVous));
        when(rendezVousRepository.save(any(RendezVous.class))).thenReturn(testRendezVous);

        // When
        RendezVous updated = rendezVousService.updateStatus(1L, StatutRDV.TERMINE);

        // Then
        assertThat(updated.getStatut()).isEqualTo(StatutRDV.TERMINE);
        verify(rendezVousRepository, times(1)).save(any(RendezVous.class));
    }

    @Test
    @DisplayName("Should cancel rendez-vous")
    void testCancelRendezVous_Success() {
        // Given
        when(rendezVousRepository.findById(1L)).thenReturn(Optional.of(testRendezVous));
        when(rendezVousRepository.save(any(RendezVous.class))).thenReturn(testRendezVous);

        // When
        rendezVousService.cancelRendezVous(1L);

        // Then
        assertThat(testRendezVous.getStatut()).isEqualTo(StatutRDV.ANNULE);
        verify(rendezVousRepository, times(1)).save(testRendezVous);
    }

    @Test
    @DisplayName("Should not allow double booking")
    void testCreateRendezVous_DoubleBooking() {
        // Given
        when(rendezVousRepository.existsByMedecinAndJourAndHeure(
                any(), any(), any())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> rendezVousService.createRendezVous(testRendezVous))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("already booked");
    }

    @Test
    @DisplayName("Should validate appointment date is in future")
    void testValidateDate_PastDate() {
        // Given
        testRendezVous.setJour(LocalDate.now().minusDays(1));

        // When & Then
        assertThatThrownBy(() -> rendezVousService.createRendezVous(testRendezVous))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("must be in the future");
    }

    @Test
    @DisplayName("Should find rendez-vous by patient")
    void testFindByPatient_Success() {
        // Given
        List<RendezVous> rdvList = Arrays.asList(testRendezVous);
        when(rendezVousRepository.findByPatientId(1L)).thenReturn(rdvList);

        // When
        List<RendezVous> found = rendezVousService.findByPatient(1L);

        // Then
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getPatient().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should find rendez-vous by medecin")
    void testFindByMedecin_Success() {
        // Given
        List<RendezVous> rdvList = Arrays.asList(testRendezVous);
        when(rendezVousRepository.findByMedecinId(1L)).thenReturn(rdvList);

        // When
        List<RendezVous> found = rendezVousService.findByMedecin(1L);

        // Then
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getMedecin().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should find rendez-vous by date range")
    void testFindByDateRange_Success() {
        // Given
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().plusDays(7);
        List<RendezVous> rdvList = Arrays.asList(testRendezVous);

        when(rendezVousRepository.findByJourBetween(startDate, endDate))
                .thenReturn(rdvList);

        // When
        List<RendezVous> found = rendezVousService.findByDateRange(startDate, endDate);

        // Then
        assertThat(found).hasSize(1);
    }

    @Test
    @DisplayName("Should delete rendez-vous")
    void testDeleteRendezVous_Success() {
        // Given
        when(rendezVousRepository.findById(1L)).thenReturn(Optional.of(testRendezVous));
        doNothing().when(rendezVousRepository).delete(any(RendezVous.class));

        // When
        rendezVousService.deleteRendezVous(1L);

        // Then
        verify(rendezVousRepository, times(1)).delete(testRendezVous);
    }
}
