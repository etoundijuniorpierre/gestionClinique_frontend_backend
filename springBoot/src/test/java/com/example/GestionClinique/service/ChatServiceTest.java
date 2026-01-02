package com.example.GestionClinique.service;

import com.example.GestionClinique.dto.RequestDto.messageRequestDto.MessageRequestDto;
import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.repository.*;
import com.example.GestionClinique.service.serviceImpl.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static com.example.GestionClinique.testutils.MockDataFactory.createMockMessage;
import static com.example.GestionClinique.testutils.MockDataFactory.createMockUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Chat Service Unit Tests")
class ChatServiceTest {

    @Mock
    private ConversationRepository conversationRepository;
    @Mock
    private ConversationParticipantRepository conversationParticipantRepository;
    @Mock
    private MessageRepository messageRepository;
    @Mock
    private HistoriqueMessageRepository historiqueMessageRepository;
    @Mock
    private GroupeRepository groupeRepository;
    @Mock
    private UtilisateurRepository utilisateurRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ChatService chatService;

    private Utilisateur testUser;
    private Conversation testConversation;
    private MessageRequestDto messageRequest;

    @BeforeEach
    void setUp() {
        testUser = createMockUser(1L);
        testConversation = new Conversation();
        testConversation.setId(10L);
        testConversation.setParticipants(Collections.emptyList());

        messageRequest = new MessageRequestDto();
        messageRequest.setConversationId(10L);
        messageRequest.setContenu("Hello World");
    }

    @Test
    @DisplayName("Should send message successfully")
    void testSendMessage_Success() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(conversationRepository.findById(10L)).thenReturn(Optional.of(testConversation));
        when(conversationParticipantRepository.findByConversationIdAndUtilisateurId(10L, 1L))
                .thenReturn(Optional.of(new ConversationParticipant()));
        when(messageRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Message result = chatService.sendMessage(messageRequest, 1L);

        assertThat(result.getContenu()).isEqualTo("Hello World");
        verify(messageRepository).save(any(Message.class));
        verify(conversationRepository).save(testConversation);
    }

    @Test
    @DisplayName("Should throw exception if user not in conversation")
    void testSendMessage_UserNotInConversation() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(conversationRepository.findById(10L)).thenReturn(Optional.of(testConversation));
        when(conversationParticipantRepository.findByConversationIdAndUtilisateurId(10L, 1L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> chatService.sendMessage(messageRequest, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("n'est pas participant");
    }

    @Test
    @DisplayName("Should delete message if author")
    void testDeleteMessage_Success() {
        Message message = createMockMessage();
        message.setExpediteur(testUser);
        when(messageRepository.findById(100L)).thenReturn(Optional.of(message));

        chatService.deleteMessage(100L, 1L);

        verify(messageRepository).delete(message);
        verify(historiqueMessageRepository).save(any());
    }

    @Test
    @DisplayName("Should throw exception if not author")
    void testDeleteMessage_Forbidden() {
        Message message = createMockMessage();
        message.setExpediteur(createMockUser(2L));
        when(messageRepository.findById(100L)).thenReturn(Optional.of(message));

        assertThatThrownBy(() -> chatService.deleteMessage(100L, 1L))
                .isInstanceOf(SecurityException.class);
    }
}
