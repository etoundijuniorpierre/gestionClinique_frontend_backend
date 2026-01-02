package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.Notification;
import com.example.GestionClinique.service.NotificationService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
@DisplayName("Notification Controller Tests")
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    private Notification mockNotification;
    private List<Notification> mockNotificationList;

    @BeforeEach
    void setUp() {
        mockNotification = createMockNotification();
        mockNotificationList = createList(createMockNotification(), 5);
    }

    @Test
    @DisplayName("GET /api/notifications/utilisateur/{id} - Should return notifications for user")
    void testGetNotificationsByUser() throws Exception {
        when(notificationService.findByUtilisateur(1L)).thenReturn(mockNotificationList);

        mockMvc.perform(get("/api/notifications/utilisateur/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));

        verify(notificationService, times(1)).findByUtilisateur(1L);
    }

    @Test
    @DisplayName("PUT /api/notifications/{id}/read - Should mark notification as read")
    void testMarkAsRead() throws Exception {
        doNothing().when(notificationService).markAsRead(1L);

        mockMvc.perform(put("/api/notifications/1/read"))
                .andExpect(status().isOk());

        verify(notificationService, times(1)).markAsRead(1L);
    }

    @Test
    @DisplayName("DELETE /api/notifications/{id} - Should delete notification")
    void testDeleteNotification() throws Exception {
        doNothing().when(notificationService).deleteNotification(1L);

        mockMvc.perform(delete("/api/notifications/1"))
                .andExpect(status().isNoContent());

        verify(notificationService, times(1)).deleteNotification(1L);
    }

    @Test
    @DisplayName("GET /api/notifications/unread/utilisateur/{id} - Should return unread count")
    void testCountUnread() throws Exception {
        when(notificationService.countUnreadByUtilisateur(1L)).thenReturn(3L);

        mockMvc.perform(get("/api/notifications/unread/utilisateur/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("3"));

        verify(notificationService, times(1)).countUnreadByUtilisateur(1L);
    }
}
