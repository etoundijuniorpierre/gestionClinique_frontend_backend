package com.example.GestionClinique.repository;

import com.example.GestionClinique.model.entity.ServiceMedical;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceMedicalRepository extends JpaRepository<ServiceMedical, Long> {

    Optional<ServiceMedical> findByNomService(String nomService);

    boolean existsByNomService(String nomService);

    @Query("SELECT sm FROM ServiceMedical sm LEFT JOIN FETCH sm.medecins LEFT JOIN FETCH sm.medecinResponsable WHERE sm.id = :id")
    Optional<ServiceMedical> findByIdWithMedecins(@Param("id") Long id);

    @Query("SELECT sm FROM ServiceMedical sm LEFT JOIN FETCH sm.medecins LEFT JOIN FETCH sm.medecinResponsable")
    List<ServiceMedical> findAllWithMedecins();

    @Query("SELECT sm FROM ServiceMedical sm WHERE sm.medecinResponsable.id = :medecinId")
    List<ServiceMedical> findByMedecinResponsableId(@Param("medecinId") Long medecinId);
}
