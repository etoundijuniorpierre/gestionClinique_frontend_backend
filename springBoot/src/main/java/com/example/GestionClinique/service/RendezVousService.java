package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.model.entity.enumElem.StatutRDV;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface RendezVousService {
    RendezVous createRendezVous(RendezVous rendezVous);
    RendezVous findRendezVousById(Long id);
    RendezVous updateRendezVous(Long id, RendezVous rendezVousDetails);
    void deleteRendezVous(Long id);
    List<RendezVous> findAllRendezVous();
    boolean isRendezVousAvailable(LocalDate jour, LocalTime heure, Long medecinId, Long salleId);
    boolean isRendezVousAvailableForUpdate(Long rendezVousId, LocalDate jour, LocalTime heure, Long medecinId, Long salleId);
    RendezVous cancelRendezVous(Long rendezVousId);
    List<RendezVous> findRendezVousByJour(LocalDate jour);
    void cancelRendezVousByJour();
    List<RendezVous> findUtilisateurConfirmedRendezVousByMonth(Long idUtilisateur, int year, int month);
    List<RendezVous> findRendezVousByMonth(int year, int month);
}