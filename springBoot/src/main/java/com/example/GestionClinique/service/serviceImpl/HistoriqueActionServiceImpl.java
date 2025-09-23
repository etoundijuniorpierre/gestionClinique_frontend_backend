package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.HistoriqueAction;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.repository.HistoriqueActionRepository;
import com.example.GestionClinique.repository.UtilisateurRepository;
import com.example.GestionClinique.service.HistoriqueActionService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class
HistoriqueActionServiceImpl implements HistoriqueActionService {

    private final HistoriqueActionRepository historiqueActionRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    public HistoriqueActionServiceImpl(HistoriqueActionRepository historiqueActionRepository,
                                       UtilisateurRepository utilisateurRepository) {
        this.historiqueActionRepository = historiqueActionRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public HistoriqueAction enregistrerAction(String actionDescription, Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec ID: " + utilisateurId));

        HistoriqueAction action = new HistoriqueAction();
        action.setDate(LocalDate.now());
        action.setAction(actionDescription);
        action.setUtilisateur(utilisateur);
        return historiqueActionRepository.save(action);
    }

    @Override
    public List<HistoriqueAction> findAllHistoriqueActionsDesc() {
        return historiqueActionRepository.findAllByOrderByIdDesc();
    }
}