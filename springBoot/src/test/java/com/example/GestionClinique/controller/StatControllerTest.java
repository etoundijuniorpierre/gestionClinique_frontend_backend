package com.example.GestionClinique.controller;

import com.example.GestionClinique.service.StatService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StatController.class)
@DisplayName("Stat Controller Tests")
class StatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StatService statService;

    @Test
    @DisplayName("GET /api/stats/dashboard - Should return dashboard stats")
    void testGetDashboardStats() throws Exception {
        Map<String, Object> stats = Map.of(
                "totalPatients", 100,
                "totalMedecins", 5);
        when(statService.getDashboardStats()).thenReturn(stats);

        mockMvc.perform(get("/api/stats/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPatients", is(100)))
                .andExpect(jsonPath("$.totalMedecins", is(5)));
    }

    @Test
    @DisplayName("GET /api/stats/revenue/monthly - Should return monthly revenue")
    void testGetMonthlyRevenue() throws Exception {
        Map<String, Double> revenue = Map.of("January", 5000.0);
        when(statService.getMonthlyRevenue()).thenReturn(revenue);

        mockMvc.perform(get("/api/stats/revenue/monthly"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.January", is(5000.0)));
    }
}
