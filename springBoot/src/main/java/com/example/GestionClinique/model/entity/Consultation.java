package com.example.GestionClinique.model.entity;

import com.example.GestionClinique.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table
public class Consultation extends BaseEntity {

    @Column
    private Float poids;

    @Column
    private Float taille;

    @Column
    private Float temperature;

    @Column
    private String tensionArterielle;

    @Column(nullable = false)
    private String motifs;

    @Column(columnDefinition = "TEXT")
    private String compteRendu;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnostic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_medical_id", nullable = true)
    private DossierMedical dossierMedical;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medecin_id", nullable = false)
    private Utilisateur medecin;

    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Prescription> prescriptions = new ArrayList<>();

    @OneToOne(mappedBy = "consultation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Facture facture;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rendez_vous_id", unique = true, nullable = true)
    private RendezVous rendezVous;
}
