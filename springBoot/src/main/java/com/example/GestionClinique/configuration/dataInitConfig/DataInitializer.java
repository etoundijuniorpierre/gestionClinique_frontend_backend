package com.example.GestionClinique.configuration.dataInitConfig;

import com.example.GestionClinique.model.entity.Role;
import com.example.GestionClinique.model.entity.Salle;
import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.model.entity.enumElem.RoleType;
import com.example.GestionClinique.model.entity.enumElem.ServiceMedical;
import com.example.GestionClinique.model.entity.enumElem.StatusConnect;
import com.example.GestionClinique.repository.RoleRepository;
import com.example.GestionClinique.repository.UtilisateurRepository;
import com.example.GestionClinique.service.SalleService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.Optional;

import static com.example.GestionClinique.model.entity.enumElem.RoleType.*;
import static com.example.GestionClinique.model.entity.enumElem.StatutSalle.DISPONIBLE;

@Configuration
public class DataInitializer {

    @Bean
    @Transactional
    public CommandLineRunner initializeData(RoleRepository roleRepository,
            UtilisateurRepository utilisateurRepository,
            SalleService salleService,
            PasswordEncoder passwordEncoder) {
        return args -> {
            initializeRoles(roleRepository);
            initializeAdminUser(utilisateurRepository, roleRepository, passwordEncoder);
            salleService.initializeAllSalles();
        };
    }

    private void initializeRoles(RoleRepository roleRepository) {
        Arrays.stream(RoleType.values()).forEach(roleType -> {
            Optional<Role> existingRole = roleRepository.findFirstByRoleType(roleType);
            if (existingRole.isEmpty()) {
                Role role = new Role();
                role.setRoleType(roleType);
                roleRepository.save(role);
                System.out.println("Created role: " + roleType);
            }
        });
    }

    private void initializeAdminUser(UtilisateurRepository utilisateurRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        boolean adminExists = utilisateurRepository.findByUsername("admin").isPresent();
        if (!adminExists) {
            System.out.println("Creating default admin user...");
            
            LocalDate birthDate = LocalDate.of(1990, 1, 1);
            int age = calculateAge(birthDate);
            
            Role adminRole = roleRepository.findFirstByRoleType(ADMIN)
                    .orElseThrow(() -> new IllegalStateException("ADMIN role not found"));

            Utilisateur admin = new Utilisateur();
            admin.setNom("Admin");
            admin.setPrenom("System");
            admin.setUsername("admin");
            admin.setEmail("admin@clinique.com");
            admin.setDateNaissance(birthDate);
            admin.setAge((long) age);
            admin.setTelephone("+237677850000");
            admin.setAdresse("Yaounde Mimboman Sapeur");
            admin.setGenre("Homme");
            admin.setPassword(passwordEncoder.encode("administrateur"));
            admin.setActif(true);
            admin.setRole(adminRole);
            admin.setStatusConnect(StatusConnect.DECONNECTE);

            utilisateurRepository.save(admin);
            System.out.println("Created default admin user with status DECONNECTE - Age: " + age);
        } else {
            // Vérifier et forcer le status DECONNECTE pour l'admin existant
            Utilisateur existingAdmin = utilisateurRepository.findByUsername("admin").orElse(null);
            if (existingAdmin != null && existingAdmin.getStatusConnect() != StatusConnect.DECONNECTE) {
                System.out.println("⚠️ Admin user exists but status is not DECONNECTE, fixing...");
                existingAdmin.setStatusConnect(StatusConnect.DECONNECTE);
                utilisateurRepository.save(existingAdmin);
                System.out.println("Admin status forced to DECONNECTE");
            } else if (existingAdmin != null) {
                System.out.println("Admin user exists with correct status: " + existingAdmin.getStatusConnect());
            }
        }
    }

    private int calculateAge(LocalDate birthDate) {
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}