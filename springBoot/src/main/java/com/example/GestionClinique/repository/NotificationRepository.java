package com.example.GestionClinique.repository;

import com.example.GestionClinique.model.entity.Notification;
import com.example.GestionClinique.model.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUtilisateurOrderByDateCreationDesc(Utilisateur utilisateur);
    List<Notification> findByUtilisateurAndLuFalseOrderByDateCreationDesc(Utilisateur utilisateur);
}
