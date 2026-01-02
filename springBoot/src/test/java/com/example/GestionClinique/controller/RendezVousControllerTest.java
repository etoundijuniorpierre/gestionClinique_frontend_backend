package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.RendezVous;
import com.example.GestionClinique.model.entity.enumElem.StatutRDV;
import com.example.GestionClinique.service.RendezVousService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RendezVousController.class)
@DisplayName("RendezVous Controller Tests")
class RendezVousControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RendezVousService rendezVousService;

    private RendezVous mockRendezVous;
    private List<RendezVous> mockRendezVousList;

    @BeforeEach
    void setUp() {
        mockRendezVous = createMockRendezVous();
        mockRendezVousList = createMockRendezVousList(5);
    }

    @Test
    @DisplayName("GET /api/rendez-vous - Should return all rendez-vous")
    void testGetAllRendezVous() throws Exception {
        when(rendezVousService.findAll()).thenReturn(mockRendezVousList);

        mockMvc.perform(get("/api/rendez-vous"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].statut", is("CONFIRME")));

        verify(rendezVousService, times(1)).findAll();
    }

    @Test
    @DisplayName("GET /api/rendez-vous/{id} - Should return rendez-vous by ID")
    void testGetRendezVousById() throws Exception {
        when(rendezVousService.findById(1L)).thenReturn(mockRendezVous);

        mockMvc.perform(get("/api/rendez-vous/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.statut", is("CONFIRME")));

        verify(rendezVousService, times(1)).findById(1L);
    }

    @Test
    @DisplayName("POST /api/rendez-vous - Should create new rendez-vous")
    void testCreateRendezVous() throws Exception {
        RendezVous newRdv = withoutId(createMockRendezVous());
        when(rendezVousService.createRendezVous(any(RendezVous.class))).thenReturn(mockRendezVous);

        mockMvc.perform(post("/api/rendez-vous")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newRdv)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)));

        verify(rendezVousService, times(1)).createRendezVous(any(RendezVous.class));
    }

    @Test
    @DisplayName("PUT /api/rendez-vous/{id} - Should update rendez-vous")
    void testUpdateRendezVous() throws Exception {
        when(rendezVousService.updateRendezVous(anyLong(), any(RendezVous.class)))
                .thenReturn(mockRendezVous);

        mockMvc.perform(put("/api/rendez-vous/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockRendezVous)))
                .andExpect(status().isOk());

        verify(rendezVousService, times(1)).updateRendezVous(anyLong(), any(RendezVous.class));
    }

    @Test
    @DisplayName("DELETE /api/rendez-vous/{id} - Should delete rendez-vous")
    void testDeleteRendezVous() throws Exception {
        doNothing().when(rendezVousService).deleteRendezVous(1L);

        mockMvc.perform(delete("/api/rendez-vous/1"))
                .andExpect(status().isNoContent());

        verify(rendezVousService, times(1)).deleteRendezVous(1L);
    }

    @Test
    @DisplayName("PUT /api/rendez-vous/{id}/status - Should update status")
    void testUpdateStatus() throws Exception {
        when(rendezVousService.updateStatus(1L, StatutRDV.TERMINE)).thenReturn(mockRendezVous);

        mockMvc.perform(put("/api/rendez-vous/1/status")
                .param("statut", "TERMINE"))
                .andExpect(status().isOk());

        verify(rendezVousService, times(1)).updateStatus(1L, StatutRDV.TERMINE);
    }

    @Test
    @DisplayName("PUT /api/rendez-vous/{id}/cancel - Should cancel rendez-vous")
    void testCancelRendezVous() throws Exception {
        doNothing().when(rendezVousService).cancelRendezVous(1L);

        mockMvc.perform(put("/api/rendez-vous/1/cancel"))
                .andExpect(status().isOk());

        verify(rendezVousService, times(1)).cancelRendezVous(1L);
    }

    @Test
    @DisplayName("GET /api/rendez-vous/patient/{id} - Should return rendez-vous by patient")
    void testGetByPatient() throws Exception {
        when(rendezVousService.findByPatient(1L)).thenReturn(mockRendezVousList);

        mockMvc.perform(get("/api/rendez-vous/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(rendezVousService, times(1)).findByPatient(1L);
    }

    @Test
    @DisplayName("GET /api/rendez-vous/medecin/{id} - Should return rendez-vous by medecin")
    void testGetByMedecin() throws Exception {
        when(rendezVousService.findByMedecin(1L)).thenReturn(mockRendezVousList);

        mockMvc.perform(get("/api/rendez-vous/medecin/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(rendezVousService, times(1)).findByMedecin(1L);
    }

    @Test
    @DisplayName("GET /api/rendez-vous/date - Should return rendez-vous by date range")
    void testGetByDateRange() throws Exception {
        LocalDate start = LocalDate.now();
        LocalDate end = LocalDate.now().plusDays(7);
        when(rendezVousService.findByDateRange(start, end)).thenReturn(mockRendezVousList);

        mockMvc.perform(get("/api/rendez-vous/date")
                .param("start", start.toString())
                .param("end", end.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(rendezVousService, times(1)).findByDateRange(start, end);
    }

    @Test
    @DisplayName("GET /api/rendez-vous/today - Should return today's rendez-vous")
    void testGetTodayRendezVous() throws Exception {
        when(rendezVousService.findByDate(LocalDate.now())).thenReturn(mockRendezVousList);

        mockMvc.perform(get("/api/rendez-vous/today"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(rendezVousService, times(1)).findByDate(LocalDate.now());
    }

    @Test
    @DisplayName("GET /api/rendez-vous/statut/{statut} - Should return by status")
    void testGetByStatut() throws Exception {
        when(rendezVousService.findByStatut(StatutRDV.CONFIRME)).thenReturn(mockRendezVousList);

        mockMvc.perform(get("/api/rendez-vous/statut/CONFIRME"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(rendezVousService, times(1)).findByStatut(StatutRDV.CONFIRME);
    }

    @Test
    @DisplayName("Should validate date is in future")
    void testValidateFutureDate() throws Exception {
        RendezVous pastRdv = createMockRendezVous();
        pastRdv.setJour(LocalDate.now().minusDays(1));

        mockMvc.perform(post("/api/rendez-vous")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pastRdv)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should prevent double booking")
    void testPreventDoubleBooking() throws Exception {
        when(rendezVousService.createRendezVous(any()))
                .thenThrow(new BusinessException("Time slot already booked"));

        mockMvc.perform(post("/api/rendez-vous")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockRendezVous)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle invalid status")
    void testInvalidStatus() throws Exception {
        mockMvc.perform(put("/api/rendez-vous/1/status")
                .param("statut", "INVALID"))
                .andExpect(status().isBadRequest());
    }
}
