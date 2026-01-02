package com.example.GestionClinique.controller;

import com.example.GestionClinique.configuration.security.jwtConfig.JwtUtil;
import com.example.GestionClinique.dto.dtoConnexion.LoginRequest;
import com.example.GestionClinique.dto.dtoConnexion.LoginResponse;
import com.example.GestionClinique.service.HistoriqueActionService;
import com.example.GestionClinique.service.authService.MonUserDetailsCustom;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.GestionClinique.configuration.utils.Constants.API_NAME;

@Tag(name = "AUTHENTIFICATION", description = "API pour se login dans notre système")
@RequestMapping
@RestController
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final HistoriqueActionService historiqueActionService;

    @PostMapping(path = API_NAME
            + "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Login un utilisateur", description = "Permet à un utilisateur de se connecter au système en fournissant email et mot de passe, et obtient un JWT.")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            MonUserDetailsCustom userDetails = (MonUserDetailsCustom) authentication.getPrincipal();

            if (userDetails == null) {
                System.err.println("ERREUR: UserDetails est null après l'authentification.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authentication failed: UserDetails is null.");
            }

            String jwt = jwtUtil.generateToken(userDetails);
            String photoUrl = userDetails.getPhotoProfilPath() != null
                    ? "/api/utilisateurs/" + userDetails.getId() + "/photo"
                    : null;

            historiqueActionService.enregistrerAction(
                    "Connexion avec le nom d'utilisateur : " + loginRequest.getUsername(),
                    userDetails.getId());

            return ResponseEntity.ok(new LoginResponse(
                    userDetails.getId(),
                    jwt,
                    userDetails.getUsername(),
                    photoUrl,
                    userDetails.getAuthorities()));

        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }
}
