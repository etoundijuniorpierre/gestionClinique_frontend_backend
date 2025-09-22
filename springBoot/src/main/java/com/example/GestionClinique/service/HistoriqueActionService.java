package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.HistoriqueAction;
import com.example.GestionClinique.model.entity.Utilisateur;

import java.time.LocalDate;
import java.util.List;

public interface HistoriqueActionService {
    HistoriqueAction enregistrerAction(String actionDescription, Long utilisateurId);
    HistoriqueAction enregistrerAction(String actionDescription, Utilisateur utilisateur);
    HistoriqueAction enregistrerAction(String actionDescription);
    List<HistoriqueAction> findAllHistoriqueActionsDesc();
    HistoriqueAction findHistoriqueActionById(Long id);
    List<HistoriqueAction> findHistoriqueActionsByUtilisateurId(Long utilisateurId);
    List<HistoriqueAction> findHistoriqueActionsByUtilisateurName(String utilisateurName);
    List<HistoriqueAction> findHistoriqueActionsByDateRange(LocalDate startDate, LocalDate endDate);
    List<HistoriqueAction> rechercherHistorique(String nom, String prenom, String email, String motCle);
}
