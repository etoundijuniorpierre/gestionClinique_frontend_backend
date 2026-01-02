package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.Message;
import com.example.GestionClinique.model.entity.Notification;
import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.repository.NotificationRepository;
import com.example.GestionClinique.service.NotificationService;
import com.example.GestionClinique.mapper.NotificationMapper;
import com.example.GestionClinique.dto.ResponseDto.NotificationResponseDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.example.GestionClinique.model.entity.enumElem.NotificationType.MESSAGE;
import static com.example.GestionClinique.model.entity.enumElem.NotificationType.RENDEZVOUS;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationMapper notificationMapper;

    @Transactional
    public Notification creerNotificationPourMessage(Message message, Utilisateur destinataire) {
        Notification notification = new Notification();
        notification.setType(MESSAGE);
        notification.setMessage(message);
        notification.setUtilisateur(destinataire);
        notification.setContenu("Nouveau message de " + message.getExpediteur().getNom());
        notification.setLu(false);
        notification.setDateCreation(LocalDateTime.now());
        Notification savedNotification = notificationRepository.save(notification);
        
        // Push notification via WebSocket
        pushNotification(savedNotification);
        
        return savedNotification;
    }

    @Transactional
    public Notification creerNotificationPourRendezVous(RendezVous rendezVous, Utilisateur utilisateur) {
        Notification notification = new Notification();
        notification.setType(RENDEZVOUS);
        notification.setRendezVous(rendezVous);
        notification.setUtilisateur(utilisateur);
        notification.setContenu("Nouveau rendez-vous prévu le " + rendezVous.getJour() + " à " + rendezVous.getHeure());
        notification.setLu(false);
        notification.setDateCreation(LocalDateTime.now());
        Notification savedNotification = notificationRepository.save(notification);
        
        // Push notification via WebSocket
        pushNotification(savedNotification);
        
        return savedNotification;
    }

    private void pushNotification(Notification notification) {
        try {
            NotificationResponseDto dto = notificationMapper.toDto(notification);
            String username = notification.getUtilisateur().getUsername();
            if (username != null) {
                messagingTemplate.convertAndSendToUser(username, "/queue/notifications", dto);
                System.out.println("Notification poussée à l'utilisateur: " + username);
            }
        } catch (Exception e) {
            System.err.println("Erreur lors du push de la notification: " + e.getMessage());
            // On ne bloque pas la transaction si le push échoue
        }
    }

    public List<Notification> getNotificationsByUtilisateur(Utilisateur utilisateur) {
        return notificationRepository.findByUtilisateurOrderByDateCreationDesc(utilisateur);
    }

    public List<Notification> getUnreadNotifications(Utilisateur utilisateur) {
        return notificationRepository.findByUtilisateurAndLuFalseOrderByDateCreationDesc(utilisateur);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        notification.setLu(true);
        notificationRepository.save(notification);
    }
}
