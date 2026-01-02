package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.model.entity.enumElem.*;
import com.example.GestionClinique.repository.ConsultationRepository;
import com.example.GestionClinique.repository.FactureRepository;
import com.example.GestionClinique.repository.RendezVousRepository;
import com.example.GestionClinique.service.serviceImpl.FactureServiceImpl;
import com.example.GestionClinique.service.serviceImpl.LoggingAspect;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Facture Service Unit Tests")
class FactureServiceTest {

    @Mock
    private FactureRepository factureRepository;
    @Mock
    private RendezVousRepository rendezVousRepository;
    @Mock
    private ConsultationRepository consultationRepository;
    @Mock
    private LoggingAspect loggingAspect;
    @Mock
    private HistoriqueActionService historiqueActionService;
    @Mock
    private StatService statService;

    @InjectMocks
    private FactureServiceImpl factureService;

    private Facture testFacture;
    private RendezVous testRendezVous;

    @BeforeEach
    void setUp() {
        testFacture = createMockFacture();
        testRendezVous = createMockRendezVous();
        testRendezVous.getMedecin().setServiceMedical(new ServiceMedical());
        testRendezVous.getMedecin().getServiceMedical().setMontant(50000.0);
    }

    @Test
    @DisplayName("Should generate invoice for RendezVous")
    void testGenerateInvoiceForRendezVous_Success() {
        when(rendezVousRepository.findById(1L)).thenReturn(Optional.of(testRendezVous));
        when(factureRepository.findByRendezVousId(1L)).thenReturn(Optional.empty());
        when(factureRepository.save(any())).thenReturn(testFacture);

        factureService.generateInvoiceForRendesVous(1L);

        verify(factureRepository).save(any(Facture.class));
        verify(rendezVousRepository).save(any(RendezVous.class));
    }

    @Test
    @DisplayName("Should throw exception if invoice already exists")
    void testGenerateInvoiceForRendezVous_AlreadyExists() {
        when(rendezVousRepository.findById(1L)).thenReturn(Optional.of(testRendezVous));
        when(factureRepository.findByRendezVousId(1L)).thenReturn(Optional.of(testFacture));

        assertThatThrownBy(() -> factureService.generateInvoiceForRendesVous(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    @DisplayName("Should pay invoice successfully")
    void testPayerFacture_Success() {
        testFacture.setStatutPaiement(StatutPaiement.IMPAYEE);
        testFacture.setRendezVous(testRendezVous);
        when(factureRepository.findById(100L)).thenReturn(Optional.of(testFacture));
        when(rendezVousRepository.findById(any())).thenReturn(Optional.of(testRendezVous));

        Facture result = factureService.payerFacture(100L, ModePaiement.CB);

        assertThat(result.getStatutPaiement()).isEqualTo(StatutPaiement.PAYEE);
        assertThat(testRendezVous.getStatut()).isEqualTo(StatutRDV.CONFIRME);
        verify(factureRepository).save(testFacture);
    }

    @Test
    @DisplayName("Should throw exception if already paid")
    void testPayerFacture_AlreadyPaid() {
        testFacture.setStatutPaiement(StatutPaiement.PAYEE);
        when(factureRepository.findById(1L)).thenReturn(Optional.of(testFacture));

        assertThatThrownBy(() -> factureService.payerFacture(1L, ModePaiement.ESPECES))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already marked as PAID");
    }
}
