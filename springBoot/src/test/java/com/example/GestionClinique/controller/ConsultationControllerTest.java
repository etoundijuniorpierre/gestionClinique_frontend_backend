package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.Consultation;
import com.example.GestionClinique.service.ConsultationService;
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

import java.time.LocalDate;
import java.util.List;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ConsultationController.class)
@DisplayName("Consultation Controller Tests")
class ConsultationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ConsultationService consultationService;

    private Consultation mockConsultation;
    private List<Consultation> mockConsultationList;

    @BeforeEach
    void setUp() {
        mockConsultation = createMockConsultation();
        mockConsultationList = createList(createMockConsultation(), 5);
    }

    @Test
    @DisplayName("GET /api/consultations - Should return all consultations")
    void testGetAllConsultations() throws Exception {
        when(consultationService.findAll()).thenReturn(mockConsultationList);

        mockMvc.perform(get("/api/consultations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].motif", is(notNullValue())));

        verify(consultationService, times(1)).findAll();
    }

    @Test
    @DisplayName("GET /api/consultations/{id} - Should return consultation by ID")
    void testGetConsultationById() throws Exception {
        when(consultationService.findById(1L)).thenReturn(mockConsultation);

        mockMvc.perform(get("/api/consultations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.motif", is(mockConsultation.getMotif())));

        verify(consultationService, times(1)).findById(1L);
    }

    @Test
    @DisplayName("GET /api/consultations/{id} - Should return 404 when not found")
    void testGetConsultationById_NotFound() throws Exception {
        when(consultationService.findById(999L))
                .thenThrow(new ResourceNotFoundException("Consultation", "id", 999L));

        mockMvc.perform(get("/api/consultations/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/consultations - Should create new consultation")
    void testCreateConsultation() throws Exception {
        Consultation newConsultation = withoutId(createMockConsultation());
        when(consultationService.createConsultation(any(Consultation.class))).thenReturn(mockConsultation);

        mockMvc.perform(post("/api/consultations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newConsultation)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)));

        verify(consultationService, times(1)).createConsultation(any(Consultation.class));
    }

    @Test
    @DisplayName("PUT /api/consultations/{id} - Should update consultation")
    void testUpdateConsultation() throws Exception {
        when(consultationService.updateConsultation(anyLong(), any(Consultation.class)))
                .thenReturn(mockConsultation);

        mockMvc.perform(put("/api/consultations/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockConsultation)))
                .andExpect(status().isOk());

        verify(consultationService, times(1)).updateConsultation(anyLong(), any(Consultation.class));
    }

    @Test
    @DisplayName("DELETE /api/consultations/{id} - Should delete consultation")
    void testDeleteConsultation() throws Exception {
        doNothing().when(consultationService).deleteConsultation(1L);

        mockMvc.perform(delete("/api/consultations/1"))
                .andExpect(status().isNoContent());

        verify(consultationService, times(1)).deleteConsultation(1L);
    }

    @Test
    @DisplayName("GET /api/consultations/patient/{id} - Should return by patient")
    void testGetByPatient() throws Exception {
        when(consultationService.findByPatient(1L)).thenReturn(mockConsultationList);

        mockMvc.perform(get("/api/consultations/patient/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(consultationService, times(1)).findByPatient(1L);
    }

    @Test
    @DisplayName("GET /api/consultations/medecin/{id} - Should return by medecin")
    void testGetByMedecin() throws Exception {
        when(consultationService.findByMedecin(1L)).thenReturn(mockConsultationList);

        mockMvc.perform(get("/api/consultations/medecin/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(consultationService, times(1)).findByMedecin(1L);
    }

    @Test
    @DisplayName("GET /api/consultations/date - Should return by date range")
    void testGetByDateRange() throws Exception {
        LocalDate start = LocalDate.now();
        LocalDate end = LocalDate.now();
        when(consultationService.findByDateRange(start, end)).thenReturn(mockConsultationList);

        mockMvc.perform(get("/api/consultations/date")
                .param("start", start.toString())
                .param("end", end.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(consultationService, times(1)).findByDateRange(start, end);
    }
}
