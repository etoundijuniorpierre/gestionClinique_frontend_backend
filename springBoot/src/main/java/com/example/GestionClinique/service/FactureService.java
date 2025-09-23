package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.Facture;
import com.example.GestionClinique.model.entity.enumElem.ModePaiement;
import com.example.GestionClinique.model.entity.enumElem.StatutPaiement;

import java.util.List;

public interface FactureService {
    void generateInvoiceForRendesVous(Long rendezVousId);
    Facture payerFacture(Long factureId, ModePaiement modePaiement);
    void generateInvoiceForConsultation(Long consultationId);
    List<Facture> findFacturesByStatut(StatutPaiement statutPaiement);
    List<Facture> findAllFacturesIMPAYE();
    Facture findById(Long id);
    void deleteFacture(Long id);
}
