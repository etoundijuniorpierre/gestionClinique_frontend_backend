package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.model.entity.enumElem.StatutPaiement;
import com.example.GestionClinique.repository.*;
import com.example.GestionClinique.service.serviceImpl.ConsultationServiceImpl;
import com.example.GestionClinique.service.serviceImpl.LoggingAspect;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Consultation Service Unit Tests")
class ConsultationServiceTest {

    @Mock
    private ConsultationRepository consultationRepository;
    @Mock
    private UtilisateurRepository utilisateurRepository;
    @Mock
    private RendezVousRepository rendezVousRepository;
    @Mock
    private PrescriptionRepository prescriptionRepository;
    @Mock
    private SalleRepository salleRepository;
    @Mock
    private FactureService factureService;
    @Mock
    private HistoriqueActionService historiqueActionService;
    @Mock
    private LoggingAspect loggingAspect;
    @Mock
    private StatService statService;

    @InjectMocks
    private ConsultationServiceImpl consultationService;

    private Consultation testConsultation;
    private Utilisateur testMedecin;
    private RendezVous testRendezVous;

    @BeforeEach
    void setUp() {
        testConsultation = createMockConsultation();
        testMedecin = createMockUser(2L, "ROLE_MEDECIN");
        testRendezVous = createMockRendezVous();
        testRendezVous.setFacture(createMockFacture());
        testRendezVous.getFacture().setStatutPaiement(StatutPaiement.PAYEE);
        testRendezVous.setSalle(new Salle());
    }

    @Test
    @DisplayName("Should create consultation successfully")
    void testCreateConsultation_Success() {
        when(utilisateurRepository.findById(2L)).thenReturn(Optional.of(testMedecin));
        when(consultationRepository.save(any())).thenReturn(testConsultation);
        when(loggingAspect.currentUserId()).thenReturn(1L);

        Consultation result = consultationService.createConsultation(testConsultation, 2L);

        assertThat(result).isNotNull();
        verify(factureService).generateInvoiceForConsultation(any());
        verify(statService, times(3)).refreshStatDuJour(any()); // and month, year
    }

    @Test
    @DisplayName("Should start consultation linked to RendezVous")
    void testStartConsultation_Success() {
        when(rendezVousRepository.findById(10L)).thenReturn(Optional.of(testRendezVous));
        when(utilisateurRepository.findById(20L)).thenReturn(Optional.of(testMedecin));
        when(consultationRepository.save(any())).thenReturn(testConsultation);

        Consultation result = consultationService.startConsultation(10L, testConsultation, 20L);

        assertThat(result).isNotNull();
        verify(rendezVousRepository, atLeastOnce()).save(any());
        verify(salleRepository, atLeastOnce()).save(any());
    }

    @Test
    @DisplayName("Should throw exception if invoice not paid")
    void testStartConsultation_InvoiceNotPaid() {
        testRendezVous.getFacture().setStatutPaiement(StatutPaiement.EN_ATTENTE);
        when(rendezVousRepository.findById(1L)).thenReturn(Optional.of(testRendezVous));

        assertThatThrownBy(() -> consultationService.startConsultation(1L, testConsultation, 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not paid");
    }

    @Test
    @DisplayName("Should delete consultation and unlink RendezVous")
    void testDeleteConsultation() {
        testConsultation.setRendezVous(testRendezVous);
        when(consultationRepository.findById(100L)).thenReturn(Optional.of(testConsultation));

        consultationService.deleteById(100L);

        assertThat(testRendezVous.getConsultation()).isNull();
        verify(consultationRepository).delete(testConsultation);
    }
}
