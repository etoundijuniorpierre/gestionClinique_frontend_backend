package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.HistoriqueAction;
import com.example.GestionClinique.service.HistoriqueActionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HistoriqueActionController.class)
@DisplayName("HistoriqueAction Controller Tests")
class HistoriqueActionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HistoriqueActionService historiqueActionService;

    private HistoriqueAction mockAction;

    @BeforeEach
    void setUp() {
        mockAction = new HistoriqueAction();
        mockAction.setId(1L);
        mockAction.setAction("LOGIN");
    }

    @Test
    @DisplayName("GET /api/historique - Should return all actions")
    void testGetAllActions() throws Exception {
        when(historiqueActionService.findAll()).thenReturn(List.of(mockAction));

        mockMvc.perform(get("/api/historique"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("GET /api/historique/utilisateur/{id} - Should return by user")
    void testGetByUser() throws Exception {
        when(historiqueActionService.findByUtilisateur(1L)).thenReturn(List.of(mockAction));

        mockMvc.perform(get("/api/historique/utilisateur/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }
}
