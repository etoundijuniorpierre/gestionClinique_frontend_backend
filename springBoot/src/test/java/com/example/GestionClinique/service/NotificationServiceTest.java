package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.model.entity.enumElem.NotificationType;
import com.example.GestionClinique.repository.NotificationRepository;
import com.example.GestionClinique.service.serviceImpl.NotificationServiceImpl;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Notification Service Unit Tests")
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private Utilisateur testUser;

    @BeforeEach
    void setUp() {
        testUser = createMockUser();
    }

    @Test
    @DisplayName("Should create message notification")
    void testCreerNotificationPourMessage() {
        Message message = createMockMessage();
        when(notificationRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Notification result = notificationService.creerNotificationPourMessage(message, testUser);

        assertThat(result.getType()).isEqualTo(NotificationType.MESSAGE);
        assertThat(result.getUtilisateur()).isEqualTo(testUser);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should create rendez-vous notification")
    void testCreerNotificationPourRendezVous() {
        RendezVous rdv = createMockRendezVous();
        when(notificationRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Notification result = notificationService.creerNotificationPourRendezVous(rdv, testUser);

        assertThat(result.getType()).isEqualTo(NotificationType.RENDEZVOUS);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should mark as read")
    void testMarkAsRead() {
        Notification notification = createMockNotification();
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));

        notificationService.markAsRead(1L);

        assertThat(notification.isLu()).isTrue();
        verify(notificationRepository).save(notification);
    }
}
