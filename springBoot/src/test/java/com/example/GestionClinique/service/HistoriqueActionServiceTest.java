package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.HistoriqueAction;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.repository.HistoriqueActionRepository;
import com.example.GestionClinique.repository.UtilisateurRepository;
import com.example.GestionClinique.service.serviceImpl.HistoriqueActionServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static com.example.GestionClinique.testutils.MockDataFactory.createMockUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("HistoriqueAction Service Unit Tests")
class HistoriqueActionServiceTest {

    @Mock
    private HistoriqueActionRepository historiqueActionRepository;
    @Mock
    private UtilisateurRepository utilisateurRepository;

    @InjectMocks
    private HistoriqueActionServiceImpl historiqueActionService;

    @Test
    @DisplayName("Should record action successfully")
    void testEnregistrerAction() {
        Utilisateur user = createMockUser();
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(user));
        when(historiqueActionRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        HistoriqueAction result = historiqueActionService.enregistrerAction("TEST_ACTION", 1L);

        assertThat(result.getAction()).isEqualTo("TEST_ACTION");
        assertThat(result.getUtilisateur()).isEqualTo(user);
        verify(historiqueActionRepository).save(any(HistoriqueAction.class));
    }
}
