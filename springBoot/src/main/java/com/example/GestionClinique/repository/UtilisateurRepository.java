package com.example.GestionClinique.repository;

import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.model.entity.enumElem.RoleType;
import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;
import com.example.GestionClinique.model.entity.enumElem.StatusConnect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByUsername(String username);

    Optional<Utilisateur> findByEmail(String email);

    List<Utilisateur> findByNom(String nom);

    List<Utilisateur> findByStatusConnect(StatusConnect status);

    List<Utilisateur> findByResponsableServiceMedicalTrue();

    List<Utilisateur> findUtilisateurByRole_RoleType(RoleType roleType);

    List<Utilisateur> findByRole_RoleType(RoleType roleType);

    @Query("SELECT u FROM Utilisateur u WHERE " +
                    "LOWER(u.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                    "LOWER(u.prenom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                    "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                    "LOWER(u.serviceMedical) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Utilisateur> searchByTerm(@Param("searchTerm") String searchTerm);

    List<Utilisateur> findByStatusConnectOrderByLastLoginDateDesc(StatusConnect status);

    List<Utilisateur> findByStatusConnectOrderByLastLogoutDateDesc(StatusConnect status);

    List<Utilisateur> findByServiceMedical(ServiceMedical serviceMedical);

    List<Utilisateur> findMedecinsByServiceMedicalWithoutRendezVousAt(ServiceMedical serviceMedical, LocalDate date, LocalTime heure);

    @Modifying
    @Query("UPDATE Utilisateur u SET u.actif = :isActive WHERE u.id = :id")
    void updateActifStatus(@Param("id") Long id, @Param("isActive") boolean isActive);

    @Modifying
    @Query("UPDATE Utilisateur u SET u.statusConnect = :status, u.lastLoginDate = :loginDate WHERE u.id = :id")
    void updateLogin(@Param("id") Long id,
                    @Param("status") StatusConnect status,
                    @Param("loginDate") LocalDateTime loginDate);

    @Modifying
    @Query("UPDATE Utilisateur u SET u.statusConnect = :status, u.lastLogoutDate = :logoutDate WHERE u.id = :id")
    void updateLogout(@Param("id") Long id,
                    @Param("status") StatusConnect status,
                    @Param("logoutDate") LocalDateTime logoutDate);

    @Modifying
    @Query("UPDATE Utilisateur u SET u.photoProfil = :photoPath WHERE u.id = :id")
    void updatePhotoProfil(@Param("id") Long id, @Param("photoPath") String photoPath);
}
