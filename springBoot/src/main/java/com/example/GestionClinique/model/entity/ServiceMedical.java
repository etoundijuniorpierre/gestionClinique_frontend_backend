package com.example.GestionClinique.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.GestionClinique.model.BaseEntity;

@Entity
@Table(name = "services_medicaux")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ServiceMedical extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String nomService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medecin_responsable_id")
    private Utilisateur medecinResponsable;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "service_medical_medecins",
        joinColumns = @JoinColumn(name = "service_medical_id"),
        inverseJoinColumns = @JoinColumn(name = "medecin_id")
    )
    private List<Utilisateur> medecins = new ArrayList<>();
}
