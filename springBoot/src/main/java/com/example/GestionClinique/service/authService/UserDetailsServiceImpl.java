package com.example.GestionClinique.service.authService;

import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.model.entity.enumElem.StatusConnect;
import com.example.GestionClinique.repository.UtilisateurRepository;
import com.example.GestionClinique.service.HistoriqueActionService;
import com.example.GestionClinique.service.UtilisateurService;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    private final HistoriqueActionService historiqueActionService;
    @Lazy
    private final UtilisateurService utilisateurService;

    public UserDetailsServiceImpl(UtilisateurRepository utilisateurRepository,
            HistoriqueActionService historiqueActionService,
            @Lazy UtilisateurService utilisateurService) {
        this.utilisateurRepository = utilisateurRepository;
        this.historiqueActionService = historiqueActionService;
        this.utilisateurService = utilisateurService;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utilisateur non trouvé avec le nom d'utilisateur : " + username));

        if (!utilisateur.getActif()) {
            throw new UsernameNotFoundException(
                    "Utilisateur avec le nom d'utilisateur : " + username + " est désactivé.");
        }

        UserDetails userDetails = new MonUserDetailsCustom(
                utilisateur.getId(),
                utilisateur.getUsername(),
                utilisateur.getPassword(),
                utilisateur.getPhotoProfil(),
                true,
                true,
                true,
                true,
                utilisateur.getAuthorities());

        utilisateurService.updateUserConnectStatus(utilisateur.getId(), StatusConnect.CONNECTE);

        return userDetails;
    }
}