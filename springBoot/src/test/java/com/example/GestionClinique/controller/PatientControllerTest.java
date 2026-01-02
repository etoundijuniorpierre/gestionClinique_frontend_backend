package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.Patient;
import com.example.GestionClinique.service.PatientService;
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

/**
 * Controller tests for PatientController
 * Tests all REST endpoints with centralized mock data
 */
@WebMvcTest(PatientController.class)
@DisplayName("Patient Controller Tests")
class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PatientService patientService;

    private Patient mockPatient;
    private List<Patient> mockPatientList;

    @BeforeEach
    void setUp() {
        mockPatient = createMockPatient();
        mockPatientList = createMockPatientList(5);
    }

    @Test
    @DisplayName("GET /api/patients - Should return all patients")
    void testGetAllPatients() throws Exception {
        // Given
        when(patientService.findAllPatients()).thenReturn(mockPatientList);

        // When & Then
        mockMvc.perform(get("/api/patients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].nom", is("Patient1")))
                .andExpect(jsonPath("$[0].email", containsString("@email.com")));

        verify(patientService, times(1)).findAllPatients();
    }

    @Test
    @DisplayName("GET /api/patients/{id} - Should return patient by ID")
    void testGetPatientById() throws Exception {
        // Given
        when(patientService.findById(1L)).thenReturn(mockPatient);

        // When & Then
        mockMvc.perform(get("/api/patients/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nom", is("Nguemo")))
                .andExpect(jsonPath("$.prenom", is("Jean")))
                .andExpect(jsonPath("$.email", is("nguemo.jean@email.com")));

        verify(patientService, times(1)).findById(1L);
    }

    @Test
    @DisplayName("GET /api/patients/{id} - Should return 404 when patient not found")
    void testGetPatientById_NotFound() throws Exception {
        // Given
        when(patientService.findById(anyLong()))
                .thenThrow(new ResourceNotFoundException("Patient", "id", 999L));

        // When & Then
        mockMvc.perform(get("/api/patients/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("Patient not found")));

        verify(patientService, times(1)).findById(999L);
    }

    @Test
    @DisplayName("POST /api/patients - Should create new patient")
    void testCreatePatient() throws Exception {
        // Given
        Patient newPatient = withoutId(createMockPatient());
        when(patientService.createPatient(any(Patient.class))).thenReturn(mockPatient);

        // When & Then
        mockMvc.perform(post("/api/patients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newPatient)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nom", is("Nguemo")));

        verify(patientService, times(1)).createPatient(any(Patient.class));
    }

    @Test
    @DisplayName("POST /api/patients - Should return 400 for invalid data")
    void testCreatePatient_InvalidData() throws Exception {
        // Given
        Patient invalidPatient = new Patient(); // Missing required fields

        // When & Then
        mockMvc.perform(post("/api/patients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidPatient)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/patients/{id} - Should update patient")
    void testUpdatePatient() throws Exception {
        // Given
        Patient updatedPatient = createMockPatient(1L, "UpdatedNom", "UpdatedPrenom");
        when(patientService.updatePatient(anyLong(), any(Patient.class)))
                .thenReturn(updatedPatient);

        // When & Then
        mockMvc.perform(put("/api/patients/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedPatient)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom", is("UpdatedNom")))
                .andExpect(jsonPath("$.prenom", is("UpdatedPrenom")));

        verify(patientService, times(1)).updatePatient(anyLong(), any(Patient.class));
    }

    @Test
    @DisplayName("PUT /api/patients/{id} - Should return 404 when updating non-existent patient")
    void testUpdatePatient_NotFound() throws Exception {
        // Given
        when(patientService.updatePatient(anyLong(), any(Patient.class)))
                .thenThrow(new ResourceNotFoundException("Patient", "id", 999L));

        // When & Then
        mockMvc.perform(put("/api/patients/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockPatient)))
                .andExpect(status().isNotFound());

        verify(patientService, times(1)).updatePatient(anyLong(), any(Patient.class));
    }

    @Test
    @DisplayName("DELETE /api/patients/{id} - Should delete patient")
    void testDeletePatient() throws Exception {
        // Given
        doNothing().when(patientService).deletePatient(1L);

        // When & Then
        mockMvc.perform(delete("/api/patients/1"))
                .andExpect(status().isNoContent());

        verify(patientService, times(1)).deletePatient(1L);
    }

    @Test
    @DisplayName("DELETE /api/patients/{id} - Should return 404 when deleting non-existent patient")
    void testDeletePatient_NotFound() throws Exception {
        // Given
        doThrow(new ResourceNotFoundException("Patient", "id", 999L))
                .when(patientService).deletePatient(999L);

        // When & Then
        mockMvc.perform(delete("/api/patients/999"))
                .andExpect(status().isNotFound());

        verify(patientService, times(1)).deletePatient(999L);
    }

    @Test
    @DisplayName("GET /api/patients/search?nom={nom} - Should search patients by name")
    void testSearchPatientsByNom() throws Exception {
        // Given
        List<Patient> searchResults = List.of(mockPatient);
        when(patientService.findPatientByNom("Nguemo")).thenReturn(searchResults);

        // When & Then
        mockMvc.perform(get("/api/patients/search")
                .param("nom", "Nguemo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nom", is("Nguemo")));

        verify(patientService, times(1)).findPatientByNom("Nguemo");
    }

    @Test
    @DisplayName("GET /api/patients/search?nom={nom} - Should return empty list when no matches")
    void testSearchPatientsByNom_NoResults() throws Exception {
        // Given
        when(patientService.findPatientByNom("NonExistent")).thenReturn(List.of());

        // When & Then
        mockMvc.perform(get("/api/patients/search")
                .param("nom", "NonExistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(patientService, times(1)).findPatientByNom("NonExistent");
    }

    @Test
    @DisplayName("Should handle content type validation")
    void testContentTypeValidation() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/patients")
                .contentType(MediaType.TEXT_PLAIN)
                .content("invalid content"))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    @DisplayName("Should handle malformed JSON")
    void testMalformedJson() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/patients")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{invalid json"))
                .andExpect(status().isBadRequest());
    }
}
