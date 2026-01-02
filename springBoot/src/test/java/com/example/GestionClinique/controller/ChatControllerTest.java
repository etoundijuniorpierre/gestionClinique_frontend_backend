package com.example.GestionClinique.controller;

import com.example.GestionClinique.model.entity.Message;
import com.example.GestionClinique.service.ChatService;
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
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChatController.class)
@DisplayName("Chat Controller Tests")
class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ChatService chatService;

    private Message mockMessage;
    private List<Message> mockMessageList;

    @BeforeEach
    void setUp() {
        mockMessage = createMockMessage();
        mockMessageList = List.of(mockMessage);
    }

    @Test
    @DisplayName("GET /api/chat/messages - Should return messages between users")
    void testGetMessages() throws Exception {
        when(chatService.getMessages(1L, 2L)).thenReturn(mockMessageList);

        mockMvc.perform(get("/api/chat/messages")
                .param("user1", "1")
                .param("user2", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("POST /api/chat/send - Should send message")
    void testSendMessage() throws Exception {
        when(chatService.sendMessage(any())).thenReturn(mockMessage);

        mockMvc.perform(post("/api/chat/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockMessage)))
                .andExpect(status().isOk());
    }
}
