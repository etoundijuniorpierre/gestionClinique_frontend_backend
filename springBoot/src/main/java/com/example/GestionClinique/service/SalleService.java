package com.example.GestionClinique.service;

import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;

public interface SalleService {
    void ensureSalleExistsForService(ServiceMedical serviceMedical);

    void initializeAllSalles();
}
