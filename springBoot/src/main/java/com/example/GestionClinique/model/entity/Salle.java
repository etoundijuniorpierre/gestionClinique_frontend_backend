package com.example.GestionClinique.model.entity;

import com.example.GestionClinique.model.BaseEntity;
import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;
import com.example.GestionClinique.model.entity.enumElem.StatutSalle;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table
public class Salle extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String numeroSalle;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private ServiceMedical serviceMedical;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private StatutSalle statutSalle;

    @OneToMany(mappedBy = "salle", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RendezVous> rendezVous = new ArrayList<>();
}