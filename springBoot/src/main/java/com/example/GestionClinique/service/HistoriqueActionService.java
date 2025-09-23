package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.HistoriqueAction;
import com.example.GestionClinique.model.entity.Utilisateur;

import java.time.LocalDate;
import java.util.List;

public interface HistoriqueActionService {
    HistoriqueAction enregistrerAction(String actionDescription, Long utilisateurId);
    List<HistoriqueAction> findAllHistoriqueActionsDesc();
}
