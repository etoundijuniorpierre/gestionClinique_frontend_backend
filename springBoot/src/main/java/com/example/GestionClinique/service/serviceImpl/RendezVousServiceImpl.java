package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.Facture;
import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.model.entity.Salle;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.model.entity.enumElem.StatutPaiement;
import com.example.GestionClinique.model.entity.enumElem.StatutRDV;
import com.example.GestionClinique.repository.FactureRepository;
import com.example.GestionClinique.repository.RendezVousRepository;
import com.example.GestionClinique.repository.SalleRepository;
import com.example.GestionClinique.repository.UtilisateurRepository;
import com.example.GestionClinique.service.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ConcurrentModificationException;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RendezVousServiceImpl implements RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final SalleRepository salleRepository;
    private final FactureService factureService;
    private final HistoriqueActionService historiqueActionService;
    private final LoggingAspect loggingAspect;
    private final FactureRepository factureRepository;
    private final NotificationService notificationService;
    private final StatService statService;

    @Override
    @Transactional
    public RendezVous createRendezVous(RendezVous rendezVous) {
        if (rendezVous.getServiceMedical() != null) {
            Salle salle = salleRepository.findByServiceMedical(rendezVous.getServiceMedical());
            rendezVous.setSalle(salle);
        }

        if (rendezVous.getSalle() == null) {
            throw new IllegalArgumentException("La salle doit être spécifiée directement ou via le service médical");
        }

        if (!isRendezVousAvailable(
                rendezVous.getJour(),
                rendezVous.getHeure(),
                rendezVous.getMedecin().getId(),
                rendezVous.getSalle().getId())) {
            throw new RuntimeException("Le créneau horaire est déjà pris pour ce médecin ou cette salle.");
        }

        if (rendezVous.getStatut() == null) {
            rendezVous.setStatut(StatutRDV.EN_ATTENTE);
        }

        RendezVous saveRendezVous = rendezVousRepository.save(rendezVous);
        notificationService.creerNotificationPourRendezVous(saveRendezVous, saveRendezVous.getMedecin());
        factureService.generateInvoiceForRendesVous(saveRendezVous.getId());

        historiqueActionService.enregistrerAction(
                String.format("Création RDV ID: %d pour patient ID: %d",
                        saveRendezVous.getId(), saveRendezVous.getPatient().getId()),
                loggingAspect.currentUserId()
        );

        statService.refreshStatDuJour(LocalDate.now());
        statService.refreshStatParMois(LocalDate.now().getMonthValue());
        statService.refreshStatsSurLannee(LocalDate.now().getYear());

        return saveRendezVous;
    }

    @Override
    @Transactional
    public RendezVous findRendezVousById(Long id) {
        return rendezVousRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("RendezVous not found with ID: " + id));
    }

    @Override
    public RendezVous updateRendezVous(Long id, RendezVous rendezVous) {
        RendezVous existingRendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rendez-vous non trouvé avec l'ID: " + id));

        if (existingRendezVous.getStatut() == StatutRDV.TERMINE || existingRendezVous.getStatut() == StatutRDV.ANNULE) {
            throw new IllegalStateException("Impossible de modifier un rendez-vous " + existingRendezVous.getStatut().name().toLowerCase());
        }

        if (rendezVous.getHeure() != null) {
            existingRendezVous.setHeure(rendezVous.getHeure());
        }
        if (rendezVous.getJour() != null) {
            existingRendezVous.setJour(rendezVous.getJour());
        }
        if (rendezVous.getNotes() != null) {
            existingRendezVous.setNotes(rendezVous.getNotes());
        }

        if (rendezVous.getMedecin() != null && !rendezVous.getMedecin().equals(existingRendezVous.getMedecin().getId())) {
            Utilisateur newMedecin = utilisateurRepository.findById(rendezVous.getMedecin().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Médecin non trouvé avec l'ID: " + rendezVous.getMedecin()));
            existingRendezVous.setMedecin(newMedecin);
        }

        if (rendezVous.getServiceMedical() != null && !rendezVous.getServiceMedical().equals(existingRendezVous.getServiceMedical())) {
            existingRendezVous.setServiceMedical(rendezVous.getServiceMedical());
            Salle nouvelleSalle = salleRepository.findByServiceMedical(rendezVous.getServiceMedical());
            existingRendezVous.setSalle(nouvelleSalle);
        }

        if (!isRendezVousAvailableForUpdate(
                existingRendezVous.getId(),
                existingRendezVous.getJour(),
                existingRendezVous.getHeure(),
                existingRendezVous.getMedecin().getId(),
                existingRendezVous.getSalle().getId())) {
            throw new ConcurrentModificationException("Le créneau horaire est déjà pris pour ce médecin ou cette salle");
        }

        historiqueActionService.enregistrerAction(
                String.format("Mise à jour prescription ID: %d", id),
                loggingAspect.currentUserId()
        );

        return rendezVousRepository.save(existingRendezVous);
    }

    @Override
    public void deleteRendezVous(Long id) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("RendezVous not found with ID: " + id));
        if (rendezVous.getConsultation() != null) {
            throw new IllegalStateException("Cannot delete a rendez-vous that already has an associated consultation.");
        }
        if (rendezVous.getJour().isBefore(LocalDate.now())) {
            throw new IllegalStateException("Cannot delete a past rendez-vous. Consider cancelling or archiving instead.");
        }
        historiqueActionService.enregistrerAction(
                String.format("Suppression rendezVous ID: %d", id),
                loggingAspect.currentUserId()
        );
        rendezVousRepository.delete(rendezVous);
    }

    @Override
    @Transactional
    public List<RendezVous> findAllRendezVous() {
        return rendezVousRepository.findAll();
    }

    @Override
    @Transactional
    public boolean isRendezVousAvailable(LocalDate jour, LocalTime heure, Long medecinId, Long salleId) {
        Optional<RendezVous> existingMedecinRv = rendezVousRepository.findByJourAndHeureAndMedecinId(jour, heure, medecinId);
        if (existingMedecinRv.isPresent()) {
            return false;
        }

        Optional<RendezVous> existingSalleRv = rendezVousRepository.findByJourAndHeureAndSalleId(jour, heure, salleId);
        if (existingSalleRv.isPresent()) {
            return false;
        }
        return true;
    }

    @Transactional
    @Override
    public boolean isRendezVousAvailableForUpdate(Long rendezVousId, LocalDate jour, LocalTime heure, Long medecinId, Long salleId) {
        Optional<RendezVous> existingMedecinRv = rendezVousRepository.findByJourAndHeureAndMedecinId(jour, heure, medecinId);
        if (existingMedecinRv.isPresent() && !existingMedecinRv.get().getId().equals(rendezVousId)) {
            return false;
        }

        Optional<RendezVous> existingSalleRv = rendezVousRepository.findByJourAndHeureAndSalleId(jour, heure, salleId);
        if (existingSalleRv.isPresent() && !existingSalleRv.get().getId().equals(rendezVousId)) {
            return false;
        }
        return true;
    }

    @Override
    public RendezVous cancelRendezVous(Long rendezVousId) {
        RendezVous rendezVous = rendezVousRepository.findById(rendezVousId)
                .orElseThrow(() -> new IllegalArgumentException("RendezVous not found with ID: " + rendezVousId));

        if (rendezVous.getStatut() == StatutRDV.ANNULE || rendezVous.getStatut() == StatutRDV.ENCOURS) {
            throw new IllegalStateException("Cannot cancel a rendez-vous that is already " + rendezVous.getStatut().name().toLowerCase() + ".");
        }
        if (rendezVous.getJour().isBefore(LocalDate.now()) || (rendezVous.getJour().isEqual(LocalDate.now()) && rendezVous.getHeure().isBefore(LocalTime.now()))) {
            throw new IllegalStateException("Cannot cancel a past rendez-vous.");
        }

        rendezVous.setStatut(StatutRDV.ANNULE);
        RendezVous updatedRendezVous = rendezVousRepository.save(rendezVous);

        historiqueActionService.enregistrerAction(
                String.format("Annulation RDV ID: %d", rendezVousId),
                loggingAspect.currentUserId()
        );

        statService.refreshStatDuJour(LocalDate.now());
        statService.refreshStatParMois(LocalDate.now().getMonthValue());
        statService.refreshStatsSurLannee(LocalDate.now().getYear());

        return updatedRendezVous;
    }

    @Override
    @Transactional
    public List<RendezVous> findRendezVousByJour(LocalDate jour) {
        return rendezVousRepository.findByJour(jour);
    }

    @Override
    @Transactional
    public void cancelRendezVousByJour() {
        LocalDate today = LocalDate.now();
        List<RendezVous> rendezVousList = rendezVousRepository.findByJourBefore(today);

        if (rendezVousList.isEmpty()) {
            return;
        }

        for (RendezVous rendezVous : rendezVousList) {
            if (rendezVous.getStatut() == StatutRDV.EN_ATTENTE) {
                rendezVous.setStatut(StatutRDV.ANNULE);
                rendezVousRepository.save(rendezVous);

                Optional<Facture> factureOptional = factureRepository.findByRendezVousId(rendezVous.getId());
                factureOptional.ifPresent(facture -> {
                    if (facture.getStatutPaiement() == StatutPaiement.IMPAYEE) {
                        factureService.deleteFacture(facture.getId());
                    }
                });
            }
        }

        statService.refreshStatDuJour(LocalDate.now());
        statService.refreshStatParMois(LocalDate.now().getMonthValue());
        statService.refreshStatsSurLannee(LocalDate.now().getYear());
    }

    @Override
    public List<RendezVous> findUtilisateurConfirmedRendezVousByMonth(Long idUtilisateur, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        return rendezVousRepository.findConfirmedByUtilisateurAndMonth(idUtilisateur, StatutRDV.CONFIRME, startDate, endDate);
    }

    @Override
    public List<RendezVous> findRendezVousByMonth(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        return rendezVousRepository.findByJourBetween(startDate, endDate);
    }
}