package com.example.GestionClinique.service.authService;

import com.example.GestionClinique.configuration.security.jwtConfig.JwtUtil;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.service.HistoriqueActionService;
import com.example.GestionClinique.service.UtilisateurService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import static com.example.GestionClinique.model.entity.enumElem.StatusConnect.DECONNECTE;

@Service
public class CustomLogoutHandler implements LogoutHandler {

    private final JwtUtil jwtUtil;
    private final @Lazy UtilisateurService utilisateurService;
    private final HistoriqueActionService historiqueActionService;

    public CustomLogoutHandler(JwtUtil jwtUtil, @Lazy UtilisateurService utilisateurService, HistoriqueActionService historiqueActionService) {
        this.jwtUtil = jwtUtil;
        this.utilisateurService = utilisateurService;
        this.historiqueActionService = historiqueActionService;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        System.out.println(" DÉCONNEXION DÉTECTÉE - CustomLogoutHandler appelé");
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;

        System.out.println(" AuthHeader: " + (authHeader != null ? "Présent" : "Absent"));
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println(" Pas de token Bearer trouvé");
            return;
        }

        jwt = authHeader.substring(7);
        System.out.println(" Token extrait: " + jwt.substring(0, Math.min(10, jwt.length())) + "...");
        
        try {
            String userEmail = jwtUtil.extractUsername(jwt);
            System.out.println(" Email extrait du token: " + userEmail);

            if (userEmail != null) {
                Utilisateur checkUser = utilisateurService.findUtilisateurByEmail(userEmail);
                System.out.println(" Utilisateur trouvé: " + (checkUser != null ? checkUser.getUsername() : "Non trouvé"));
                
                if (checkUser != null) {
                    System.out.println(" Status AVANT changement: " + checkUser.getStatusConnect());
                    utilisateurService.updateUserConnectStatus(checkUser.getId(), DECONNECTE);
                    System.out.println(" Status changé vers: DECONNECTE");
                    
                    Utilisateur updatedUser = utilisateurService.findUtilisateurByEmail(userEmail);
                    if (updatedUser != null) {
                        System.out.println(" Status APRÈS changement: " + updatedUser.getStatusConnect());
                    }
                } else {
                    System.out.println(" Utilisateur non trouvé en base");
                }
            } else {
                System.out.println(" Email null extrait du token");
            }
        } catch (Exception e) {
            System.err.println(" Erreur lors du traitement du token: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println(" Fin du traitement de déconnexion");
    }
}