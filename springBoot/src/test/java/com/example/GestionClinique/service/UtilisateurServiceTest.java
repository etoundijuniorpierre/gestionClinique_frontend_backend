package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.model.entity.enumElem.RoleType;
import com.example.GestionClinique.repository.RendezVousRepository;
import com.example.GestionClinique.repository.RoleRepository;
import com.example.GestionClinique.repository.UtilisateurRepository;
import com.example.GestionClinique.service.photoService.FileStorageServiceImpl;
import com.example.GestionClinique.service.serviceImpl.LoggingAspect;
import com.example.GestionClinique.service.serviceImpl.UtilisateurServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Utilisateur Service Unit Tests")
class UtilisateurServiceTest {

    @Mock
    private UtilisateurRepository utilisateurRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private RendezVousRepository rendezVousRepository;
    @Mock
    private FileStorageServiceImpl fileStorageService;
    @Mock
    private HistoriqueActionService historiqueActionService;
    @Mock
    private LoggingAspect loggingAspect;

    @InjectMocks
    private UtilisateurServiceImpl utilisateurService;

    private Utilisateur testUser;
    private Role testRole;

    @BeforeEach
    void setUp() {
        testUser = createMockUser();
        testUser.setPassword("password123");
        testUser.setDateNaissance(LocalDate.of(1990, 1, 1));
        testRole = new Role();
        testRole.setId(1L);
        testRole.setRoleType(RoleType.ADMIN);
        testUser.setRole(testRole);
    }

    @Test
    @DisplayName("Should create user successfully")
    void testCreateUser_Success() {
        when(utilisateurRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(roleRepository.findById(any())).thenReturn(Optional.of(testRole));
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(utilisateurRepository.save(any())).thenReturn(testUser);

        Utilisateur result = utilisateurService.createUtilisateur(testUser);

        assertThat(result).isNotNull();
        assertThat(result.getAge()).isGreaterThan(0);
        verify(utilisateurRepository).save(any(Utilisateur.class));
    }

    @Test
    @DisplayName("Should throw exception if email exists")
    void testCreateUser_EmailExists() {
        when(utilisateurRepository.findByEmail(any())).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> utilisateurService.createUtilisateur(testUser))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    @DisplayName("Should throw exception if password too short")
    void testCreateUser_PasswordShort() {
        testUser.setPassword("123");
        when(utilisateurRepository.findByEmail(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> utilisateurService.createUtilisateur(testUser))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("au moins 8 caractères");
    }

    @Test
    @DisplayName("Should update password successfully")
    void testUpdatePassword_Success() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(utilisateurRepository.save(any())).thenReturn(testUser);

        Utilisateur result = utilisateurService.updatePassword(1L, "newPassword123", "newPassword123");

        assertThat(result).isNotNull();
        verify(utilisateurRepository).save(testUser);
    }

    @Test
    @DisplayName("Should throw exception if passwords don't match")
    void testUpdatePassword_NoMatch() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> utilisateurService.updatePassword(1L, "pass1", "pass2"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("ne correspondent pas");
    }
}
