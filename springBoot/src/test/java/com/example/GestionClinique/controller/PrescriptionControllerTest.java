package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.Prescription;
import com.example.GestionClinique.service.PrescriptionService;
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

@WebMvcTest(PrescriptionController.class)
@DisplayName("Prescription Controller Tests")
class PrescriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PrescriptionService prescriptionService;

    private Prescription mockPrescription;
    private List<Prescription> mockPrescriptionList;

    @BeforeEach
    void setUp() {
        mockPrescription = createMockPrescription();
        mockPrescriptionList = createList(createMockPrescription(), 3);
    }

    @Test
    @DisplayName("GET /api/prescriptions/{id} - Should return by ID")
    void testGetById() throws Exception {
        when(prescriptionService.findById(1L)).thenReturn(mockPrescription);

        mockMvc.perform(get("/api/v1/prescriptions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("GET /api/prescriptions/consultation/{id} - Should return by consultation")
    void testGetByConsultation() throws Exception {
        when(prescriptionService.findPrescriptionByConsultationId(1L)).thenReturn(mockPrescriptionList);

        mockMvc.perform(get("/api/v1/prescriptions/consultation/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }
}
