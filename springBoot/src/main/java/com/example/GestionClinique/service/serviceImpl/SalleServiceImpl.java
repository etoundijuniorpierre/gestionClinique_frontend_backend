package com.example.GestionClinique.service.serviceImpl;

import com.example.GestionClinique.model.entity.Salle;
import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;
import com.example.GestionClinique.model.entity.enumElem.StatutSalle;
import com.example.GestionClinique.repository.SalleRepository;
import com.example.GestionClinique.service.SalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Transactional
public class SalleServiceImpl implements SalleService {

    private final SalleRepository salleRepository;

    @Override
    public void ensureSalleExistsForService(ServiceMedical serviceMedical) {
        if (salleRepository.findByServiceMedical(serviceMedical) == null) {
            Salle salle = new Salle();
            salle.setNumeroSalle("Salle-" + serviceMedical.name());
            salle.setServiceMedical(serviceMedical);
            salle.setStatutSalle(StatutSalle.DISPONIBLE);
            salleRepository.save(salle);
            System.out.println("Created salle for service: " + serviceMedical);
        }
    }

    @Override
    public void initializeAllSalles() {
        Arrays.stream(ServiceMedical.values()).forEach(this::ensureSalleExistsForService);
    }
}
