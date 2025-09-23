package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.model.entity.enumElem.RoleType;
import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;
import com.example.GestionClinique.model.entity.enumElem.StatusConnect;
import com.example.GestionClinique.model.entity.enumElem.StatutRDV;
import jakarta.transaction.Transactional;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface UtilisateurService {
    Utilisateur createUtilisateur(Utilisateur utilisateur);
    Utilisateur updatePhotoProfil(Long userId, MultipartFile photoProfil);
    Resource getPhotoProfil(Long userId);
    Utilisateur findUtilisateurById(Long id);
    List<Utilisateur> findAllUtilisateur();
    Utilisateur updateUtilisateur(Long id, Utilisateur utilisateur);
    void deleteUtilisateur(Long id);
    Utilisateur findUtilisateurByEmail(String email);
    List<Utilisateur> findUtilisateurByRole_RoleType(RoleType roleType);
    Utilisateur updateUtilisateurStatus(Long id, boolean isActive);
    List<RendezVous> findConfirmedRendezVousForMedecinAndDate(Long medecinId, LocalDate date);
    List<Utilisateur> searchUsers(String searchTerm);
    Utilisateur updatePassword(Long utilisateurId, String newPassword, String confirmPassword);
    List<Utilisateur> findUsersWithStatusConnectedByOrderLastConnected();
    List<Utilisateur> findUsersWithStatusDisconnectedByOrderLastDeConnected();
    List<Utilisateur> getAvailableMedecinsByServiceAndTime(ServiceMedical serviceMedical, LocalDate date, LocalTime heure);
    Utilisateur updateUserConnectStatus(Long utilisateurId, StatusConnect statusConnect);
    List<Utilisateur> findAllByIds(List<Long> participantIds);
}
