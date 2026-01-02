package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.Facture;
import com.example.GestionClinique.model.entity.enumElem.StatutFacture;
import com.example.GestionClinique.service.FactureService;
import com.example.GestionClinique.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FactureController.class)
@DisplayName("Facture Controller Tests")
class FactureControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FactureService factureService;

    private Facture mockFacture;
    private List<Facture> mockFactureList;

    @BeforeEach
    void setUp() {
        mockFacture = createMockFacture();
        mockFactureList = createList(createMockFacture(), 5);
    }

    @Test
    @DisplayName("GET /api/factures - Should return all factures")
    void testGetAllFactures() throws Exception {
        when(factureService.findAll()).thenReturn(mockFactureList);

        mockMvc.perform(get("/api/factures"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(factureService, times(1)).findAll();
    }

    @Test
    @DisplayName("GET /api/factures/{id} - Should return facture by ID")
    void testGetFactureById() throws Exception {
        when(factureService.findById(1L)).thenReturn(mockFacture);

        mockMvc.perform(get("/api/factures/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.numeroFacture", is(notNullValue())));

        verify(factureService, times(1)).findById(1L);
    }

    @Test
    @DisplayName("POST /api/factures - Should create new facture")
    void testCreateFacture() throws Exception {
        Facture newFacture = withoutId(createMockFacture());
        when(factureService.createFacture(any(Facture.class))).thenReturn(mockFacture);

        mockMvc.perform(post("/api/factures")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newFacture)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)));

        verify(factureService, times(1)).createFacture(any(Facture.class));
    }

    @Test
    @DisplayName("PUT /api/factures/{id} - Should update facture")
    void testUpdateFacture() throws Exception {
        when(factureService.updateFacture(anyLong(), any(Facture.class)))
                .thenReturn(mockFacture);

        mockMvc.perform(put("/api/factures/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockFacture)))
                .andExpect(status().isOk());

        verify(factureService, times(1)).updateFacture(anyLong(), any(Facture.class));
    }

    @Test
    @DisplayName("PUT /api/factures/{id}/payer - Should mark as paid")
    void testPayerFacture() throws Exception {
        when(factureService.payerFacture(1L, 50000.0)).thenReturn(mockFacture);

        mockMvc.perform(put("/api/factures/1/payer")
                .param("montant", "50000.0"))
                .andExpect(status().isOk());

        verify(factureService, times(1)).payerFacture(1L, 50000.0);
    }

    @Test
    @DisplayName("GET /api/factures/patient/{id} - Should return by patient")
    void testGetByPatient() throws Exception {
        when(factureService.findByPatient(1L)).thenReturn(mockFactureList);

        mockMvc.perform(get("/api/factures/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(factureService, times(1)).findByPatient(1L);
    }

    @Test
    @DisplayName("GET /api/factures/statut/{statut} - Should return by status")
    void testGetByStatut() throws Exception {
        when(factureService.findByStatut(StatutFacture.PAYEE)).thenReturn(mockFactureList);

        mockMvc.perform(get("/api/factures/statut/PAYEE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(factureService, times(1)).findByStatut(StatutFacture.PAYEE);
    }
}
