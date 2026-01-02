package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.DossierMedical;
import com.example.GestionClinique.service.DossierMedicalService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DossierMedicalController.class)
@DisplayName("DossierMedical Controller Tests")
class DossierMedicalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DossierMedicalService dossierMedicalService;

    private DossierMedical mockDossier;

    @BeforeEach
    void setUp() {
        mockDossier = createMockDossierMedical();
    }

    @Test
    @DisplayName("GET /api/dossiers/patient/{id} - Should return by patient")
    void testGetByPatient() throws Exception {
        when(dossierMedicalService.findByPatient(1L)).thenReturn(mockDossier);

        mockMvc.perform(get("/api/dossiers/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.patient.id", is(1)));

        verify(dossierMedicalService, times(1)).findByPatient(1L);
    }

    @Test
    @DisplayName("POST /api/dossiers - Should create dossier")
    void testCreateDossier() throws Exception {
        when(dossierMedicalService.create(any())).thenReturn(mockDossier);

        mockMvc.perform(post("/api/dossiers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockDossier)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("PUT /api/dossiers/{id} - Should update dossier")
    void testUpdateDossier() throws Exception {
        when(dossierMedicalService.update(anyLong(), any())).thenReturn(mockDossier);

        mockMvc.perform(put("/api/dossiers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockDossier)))
                .andExpect(status().isOk());
    }
}
