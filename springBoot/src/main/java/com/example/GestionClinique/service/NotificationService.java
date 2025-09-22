package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.Message;
import com.example.GestionClinique.model.entity.Notification;
import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.model.entity.Utilisateur;

import java.util.List;

public interface NotificationService {
    Notification creerNotificationPourMessage(Message message, Utilisateur destinataire);
    Notification creerNotificationPourRendezVous(RendezVous rendezVous, Utilisateur utilisateur);
    List<Notification> getNotificationsByUtilisateur(Utilisateur utilisateur);
    List<Notification> getUnreadNotifications(Utilisateur utilisateur);
    void markAsRead(Long notificationId);
}
