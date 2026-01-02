package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.model.entity.enumElem.RoleName;
import com.example.GestionClinique.service.UtilisateurService;
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

@WebMvcTest(UtilisateurController.class)
@DisplayName("Utilisateur Controller Tests")
class UtilisateurControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UtilisateurService utilisateurService;

    private Utilisateur mockUser;
    private List<Utilisateur> mockUserList;

    @BeforeEach
    void setUp() {
        mockUser = createMockUser();
        mockUserList = createList(createMockUser(), 3);
    }

    @Test
    @DisplayName("GET /api/utilisateurs - Should return all users")
    void testGetAllUsers() throws Exception {
        when(utilisateurService.findAll()).thenReturn(mockUserList);

        mockMvc.perform(get("/api/utilisateurs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));

        verify(utilisateurService, times(1)).findAll();
    }

    @Test
    @DisplayName("GET /api/utilisateurs/{id} - Should return user by ID")
    void testGetUserById() throws Exception {
        when(utilisateurService.findById(1L)).thenReturn(mockUser);

        mockMvc.perform(get("/api/utilisateurs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.email", is(mockUser.getEmail())));

        verify(utilisateurService, times(1)).findById(1L);
    }

    @Test
    @DisplayName("POST /api/utilisateurs - Should create new user")
    void testCreateUser() throws Exception {
        Utilisateur newUser = withoutId(createMockUser());
        when(utilisateurService.createUtilisateur(any(Utilisateur.class))).thenReturn(mockUser);

        mockMvc.perform(post("/api/utilisateurs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)));

        verify(utilisateurService, times(1)).createUtilisateur(any(Utilisateur.class));
    }

    @Test
    @DisplayName("PUT /api/utilisateurs/{id} - Should update user")
    void testUpdateUser() throws Exception {
        when(utilisateurService.updateUtilisateur(anyLong(), any(Utilisateur.class)))
                .thenReturn(mockUser);

        mockMvc.perform(put("/api/utilisateurs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockUser)))
                .andExpect(status().isOk());

        verify(utilisateurService, times(1)).updateUtilisateur(anyLong(), any(Utilisateur.class));
    }

    @Test
    @DisplayName("DELETE /api/utilisateurs/{id} - Should delete user")
    void testDeleteUser() throws Exception {
        doNothing().when(utilisateurService).deleteUtilisateur(1L);

        mockMvc.perform(delete("/api/utilisateurs/1"))
                .andExpect(status().isNoContent());

        verify(utilisateurService, times(1)).deleteUtilisateur(1L);
    }

    @Test
    @DisplayName("GET /api/utilisateurs/role/{role} - Should return by role")
    void testGetByRole() throws Exception {
        when(utilisateurService.findByRole(RoleName.ROLE_MEDECIN)).thenReturn(mockUserList);

        mockMvc.perform(get("/api/utilisateurs/role/ROLE_MEDECIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));

        verify(utilisateurService, times(1)).findByRole(RoleName.ROLE_MEDECIN);
    }

    @Test
    @DisplayName("PUT /api/utilisateurs/{id}/password - Should update password")
    void testUpdatePassword() throws Exception {
        doNothing().when(utilisateurService).updatePassword(1L, "newPass");

        mockMvc.perform(put("/api/utilisateurs/1/password")
                .param("password", "newPass"))
                .andExpect(status().isOk());

        verify(utilisateurService, times(1)).updatePassword(1L, "newPass");
    }
}
