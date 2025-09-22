package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.stats.*;
import com.example.GestionClinique.model.entity.enumElem.StatutRDV;
import com.example.GestionClinique.repository.*;
import com.example.GestionClinique.service.StatService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;

@Service
@AllArgsConstructor
public class StatServiceImpl implements StatService {

    private final StatDuJourRepository statDuJourRepository;
    private final StatsSurLanneeRepository statsSurLanneeRepository;
    private final RendezVousRepository rendezVousRepository;
    private final PatientRepository patientRepository;
    private final ConsultationRepository consultationRepository;
    private final FactureRepository factureRepository;
    private final StatsMoisRepository statsMoisRepository;

    @Override
    @Transactional
    public StatDuJour getOrCreateStatDuJour(LocalDate date) {
        return statDuJourRepository.findByJour(date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .orElseGet(() -> calculateAndSaveStatDuJour(date));
    }

    @Transactional
    @Override
    public StatDuJour refreshStatDuJour(LocalDate date) {
        StatDuJour recalculated = calculateStatDuJour(date);

        return statDuJourRepository.findByJour(date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .map(existing -> {
                    existing.setNbrRendezVousCONFIRME(recalculated.getNbrRendezVousCONFIRME());
                    existing.setNbrRendezANNULE(recalculated.getNbrRendezANNULE());
                    existing.setNbrPatientEnrg(recalculated.getNbrPatientEnrg());
                    existing.setNbrConsultation(recalculated.getNbrConsultation());
                    existing.setRevenu(recalculated.getRevenu());
                    return statDuJourRepository.save(existing);
                })
                .orElseGet(() -> statDuJourRepository.save(recalculated));
    }

    private StatDuJour calculateStatDuJour(LocalDate date) {
        StatDuJour stat = new StatDuJour();
        stat.setJour(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
        stat.setNbrRendezVousCONFIRME(rendezVousRepository.countByJourAndStatut(date, StatutRDV.CONFIRME));
        stat.setNbrRendezANNULE(rendezVousRepository.countByJourAndStatut(date, StatutRDV.ANNULE));
        stat.setNbrPatientEnrg(patientRepository.countByDateEnregistrement(date));
        stat.setNbrConsultation(consultationRepository.countByDateConsultation(date));
        stat.setRevenu(factureRepository.sumMontantTotalByDateFacture(date));
        return stat;
    }

    private StatDuJour calculateAndSaveStatDuJour(LocalDate date) {
        return statDuJourRepository.save(calculateStatDuJour(date));
    }

    @Override
    @Transactional
    public StatsMois getOrCreateStatParMois(int moisNumber) {
        String moisNom = Month.of(moisNumber).getDisplayName(TextStyle.FULL, Locale.FRENCH).toUpperCase();
        return statsMoisRepository.findByMois(moisNom)
                .orElseGet(() -> statsMoisRepository.save(calculateStatsForMonth(moisNumber)));
    }

    @Transactional
    @Override
    public StatsMois refreshStatParMois(int moisNumber) {
        StatsMois recalculated = calculateStatsForMonth(moisNumber);
        String moisNom = recalculated.getMois();

        return statsMoisRepository.findByMois(moisNom)
                .map(existing -> {
                    existing.setNbrRendezVousCONFIRME(recalculated.getNbrRendezVousCONFIRME());
                    existing.setNbrRendezANNULE(recalculated.getNbrRendezANNULE());
                    existing.setNbrPatientEnrg(recalculated.getNbrPatientEnrg());
                    existing.setNbrConsultation(recalculated.getNbrConsultation());
                    existing.setRevenu(recalculated.getRevenu());
                    return statsMoisRepository.save(existing);
                })
                .orElseGet(() -> statsMoisRepository.save(recalculated));
    }

    private StatsMois calculateStatsForMonth(int monthNumber) {
        StatsMois stats = new StatsMois();
        stats.setMois(Month.of(monthNumber).getDisplayName(TextStyle.FULL, Locale.FRENCH).toUpperCase());
        stats.setNbrRendezVousCONFIRME(rendezVousRepository.countByStatusAndMonth(StatutRDV.CONFIRME, monthNumber));
        stats.setNbrRendezANNULE(rendezVousRepository.countByStatusAndMonth(StatutRDV.ANNULE, monthNumber));
        stats.setNbrPatientEnrg(patientRepository.countByMonth(monthNumber));
        stats.setNbrConsultation(consultationRepository.countByMonth(monthNumber));
        stats.setRevenu(factureRepository.sumRevenueByMonth(monthNumber));
        return stats;
    }

    @Override
    @Transactional
    public StatsSurLannee getOrCreateStatsSurLannee(int year) {
        String anneeStr = String.valueOf(year);
        return statsSurLanneeRepository.findByAnnee(anneeStr)
                .orElseGet(() -> statsSurLanneeRepository.save(calculateStatsSurLannee(year)));
    }

    @Transactional
    @Override
    public StatsSurLannee refreshStatsSurLannee(int year) {
        StatsSurLannee recalculated = calculateStatsSurLannee(year);
        String anneeStr = String.valueOf(year);

        return statsSurLanneeRepository.findByAnnee(anneeStr)
                .map(existing -> {
                    existing.setNbrRendezVousCONFIRME(recalculated.getNbrRendezVousCONFIRME());
                    existing.setNbrRendezANNULE(recalculated.getNbrRendezANNULE());
                    existing.setNbrPatientEnrg(recalculated.getNbrPatientEnrg());
                    existing.setNbrConsultation(recalculated.getNbrConsultation());
                    existing.setRevenu(recalculated.getRevenu());
                    return statsSurLanneeRepository.save(existing);
                })
                .orElseGet(() -> statsSurLanneeRepository.save(recalculated));
    }

    private StatsSurLannee calculateStatsSurLannee(int year) {
        StatsSurLannee stat = new StatsSurLannee();
        stat.setAnnee(String.valueOf(year));
        stat.setNbrRendezVousCONFIRME(rendezVousRepository.countByAnneeAndStatut(year, StatutRDV.CONFIRME));
        stat.setNbrRendezANNULE(rendezVousRepository.countByAnneeAndStatut(year, StatutRDV.ANNULE));
        stat.setNbrPatientEnrg(patientRepository.countByYearEnregistrement(year));
        stat.setNbrConsultation(consultationRepository.countByYearConsultation(year));
        stat.setRevenu(factureRepository.sumMontantTotalByYearFacture(year));
        return stat;
    }
}