package com.example.GestionClinique.controller;

import com.example.GestionClinique.dto.RequestDto.messageRequestDto.MessageRequestDto;
import com.example.GestionClinique.dto.ResponseDto.messageResponseDto.MessageResponseDto;
import com.example.GestionClinique.mapper.MessageMapper;
import com.example.GestionClinique.model.entity.Message;
import com.example.GestionClinique.service.authService.MonUserDetailsCustom;
import com.example.GestionClinique.service.serviceImpl.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final ChatService chatService;
    private final MessageMapper messageMapper;
    private final SimpMessagingTemplate messagingTemplate;

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof MonUserDetailsCustom) {
            return ((MonUserDetailsCustom) authentication.getPrincipal()).getId();
        }
        throw new IllegalStateException("Authenticated user ID not found in security context");
    }

    @MessageMapping("/chat.sendMessage")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public void sendMessage(@Payload MessageRequestDto messageDto) {
        try {
            Long senderId = getAuthenticatedUserId();
            Message message = chatService.sendMessageWebSocket(messageDto, senderId);
            MessageResponseDto messageResponse = messageMapper.toDto(message);
            
            messagingTemplate.convertAndSend("/topic/conversation." + messageDto.getConversationId(), messageResponse);
        } catch (Exception e) {
            throw e;
        }
    }

    @MessageMapping("/chat.updateMessage")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public void updateMessage(@Payload MessageRequestDto messageDto) {
        try {
            Long userId = getAuthenticatedUserId();
            Message message = chatService.updateMessageWebSocket(messageDto.getId(), messageDto.getContenu(), userId);
            MessageResponseDto messageResponse = messageMapper.toDto(message);
            
            messagingTemplate.convertAndSend("/topic/conversation." + messageDto.getConversationId(), messageResponse);
        } catch (Exception e) {
            throw e;
        }
    }

    @MessageMapping("/chat.deleteMessage")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public void deleteMessage(@Payload MessageRequestDto messageDto) {
        try {
            Long userId = getAuthenticatedUserId();
            chatService.deleteMessageWebSocket(messageDto.getId(), userId);
            
            MessageResponseDto response = new MessageResponseDto();
            response.setId(messageDto.getId());
            response.setConversationId(messageDto.getConversationId());
            response.setType("MESSAGE_DELETED");
            messagingTemplate.convertAndSend("/topic/conversation." + messageDto.getConversationId(), response);
        } catch (Exception e) {
            throw e;
        }
    }
}
