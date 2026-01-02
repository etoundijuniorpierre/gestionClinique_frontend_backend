package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.enumElem.StatutRDV;
import com.example.GestionClinique.model.entity.stats.StatDuJour;
import com.example.GestionClinique.repository.*;
import com.example.GestionClinique.service.serviceImpl.StatServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Stat Service Unit Tests")
class StatServiceTest {

    @Mock
    private StatDuJourRepository statDuJourRepository;
    @Mock
    private StatsSurLanneeRepository statsSurLanneeRepository;
    @Mock
    private RendezVousRepository rendezVousRepository;
    @Mock
    private PatientRepository patientRepository;
    @Mock
    private ConsultationRepository consultationRepository;
    @Mock
    private FactureRepository factureRepository;
    @Mock
    private StatsMoisRepository statsMoisRepository;

    @InjectMocks
    private StatServiceImpl statService;

    @Test
    @DisplayName("Should get existing stat du jour")
    void testGetOrCreateStatDuJour_Existing() {
        StatDuJour existing = new StatDuJour();
        when(statDuJourRepository.findByJour(anyString())).thenReturn(Optional.of(existing));

        StatDuJour result = statService.getOrCreateStatDuJour(LocalDate.now());

        assertThat(result).isEqualTo(existing);
        verify(statDuJourRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should create and save stat du jour if missing")
    void testGetOrCreateStatDuJour_New() {
        when(statDuJourRepository.findByJour(anyString())).thenReturn(Optional.empty());
        when(statDuJourRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        StatDuJour result = statService.getOrCreateStatDuJour(LocalDate.now());

        assertThat(result).isNotNull();
        verify(statDuJourRepository).save(any());
    }

    @Test
    @DisplayName("Should refresh stat du jour with correct counts")
    void testRefreshStatDuJour() {
        LocalDate now = LocalDate.now();
        when(rendezVousRepository.countByJourAndStatut(now, StatutRDV.CONFIRME)).thenReturn(5L);
        when(statDuJourRepository.findByJour(anyString())).thenReturn(Optional.empty());
        when(statDuJourRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        StatDuJour result = statService.refreshStatDuJour(now);

        assertThat(result.getNbrRendezVousCONFIRME()).isEqualTo(5L);
    }
}
