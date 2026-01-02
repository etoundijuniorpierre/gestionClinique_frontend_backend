package com.example.GestionClinique.exception;

import com.example.GestionClinique.controller.PatientController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for GlobalExceptionHandler
 * Tests exception handling across the application
 */
@WebMvcTest(controllers = { GlobalExceptionHandler.class })
@DisplayName("Global Exception Handler Tests")
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PatientController patientController;

    @Test
    @DisplayName("Should handle ResourceNotFoundException with 404 status")
    void testHandleResourceNotFoundException() throws Exception {
        // Given
        when(patientController.getPatientById(anyLong()))
                .thenThrow(new ResourceNotFoundException("Patient", "id", 999L));

        // When & Then
        mockMvc.perform(get("/api/patients/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Patient not found with id: '999'"));
    }

    @Test
    @DisplayName("Should handle BusinessException with 400 status")
    void testHandleBusinessException() throws Exception {
        // Given
        when(patientController.getPatientById(anyLong()))
                .thenThrow(new BusinessException("Invalid patient data"));

        // When & Then
        mockMvc.perform(get("/api/patients/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Business Error"))
                .andExpect(jsonPath("$.message").value("Invalid patient data"));
    }

    @Test
    @DisplayName("Should handle generic Exception with 500 status")
    void testHandleGenericException() throws Exception {
        // Given
        when(patientController.getPatientById(anyLong()))
                .thenThrow(new RuntimeException("Unexpected error"));

        // When & Then
        mockMvc.perform(get("/api/patients/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred. Please try again later."));
    }

    @Test
    @DisplayName("Should include timestamp and path in error response")
    void testErrorResponseStructure() throws Exception {
        // Given
        when(patientController.getPatientById(anyLong()))
                .thenThrow(new ResourceNotFoundException("Patient", "id", 1L));

        // When & Then
        mockMvc.perform(get("/api/patients/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/patients/1"))
                .andExpect(jsonPath("$.status").exists())
                .andExpect(jsonPath("$.error").exists())
                .andExpect(jsonPath("$.message").exists());
    }
}
