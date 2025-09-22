package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.stats.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

public interface StatService {
    StatDuJour getOrCreateStatDuJour(LocalDate date);
    StatDuJour refreshStatDuJour(LocalDate date);
    StatsMois getOrCreateStatParMois(int month);
    StatsMois refreshStatParMois(int moisNumber);
    StatsSurLannee getOrCreateStatsSurLannee(int year);
    StatsSurLannee refreshStatsSurLannee(int year);
}