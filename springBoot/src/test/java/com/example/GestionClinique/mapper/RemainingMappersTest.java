package com.example.GestionClinique.mapper;

import com.example.GestionClinique.dto.ResponseDto.*;
import com.example.GestionClinique.model.entity.*;
import com.example.GestionClinique.model.entity.stats.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static com.example.GestionClinique.testutils.MockDataFactory.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {
        ConsultationMapperImpl.class,
        ConversationMapperImpl.class,
        DossierMedicalMapperImpl.class,
        FactureMapperImpl.class,
        GroupeMapperImpl.class,
        HistoriqueActionMapperImpl.class,
        MessageMapperImpl.class,
        NotificationMapperImpl.class,
        PrescriptionMapperImpl.class,
        RoleMapperImpl.class,
        StatMapperImpl.class,
        UtilisateurMapperImpl.class,
        PatientMapperImpl.class
})
@DisplayName("Remaining Mappers Unit Tests")
class RemainingMappersTest {

    @Autowired
    private ConsultationMapper consultationMapper;
    @Autowired
    private ConversationMapper conversationMapper;
    @Autowired
    private DossierMedicalMapper dossierMedicalMapper;
    @Autowired
    private FactureMapper factureMapper;
    @Autowired
    private HistoriqueActionMapper historiqueActionMapper;
    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private NotificationMapper notificationMapper;
    @Autowired
    private PrescriptionMapper prescriptionMapper;
    @Autowired
    private StatMapper statMapper;

    @Test
    @DisplayName("ConsultationMapper should map correctly")
    void testConsultationMapper() {
        Consultation entity = createMockConsultation();
        ConsultationResponseDto dto = consultationMapper.toDto(entity);
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(entity.getId());
    }

    @Test
    @DisplayName("FactureMapper should map correctly")
    void testFactureMapper() {
        Facture entity = createMockFacture();
        FactureResponseDto dto = factureMapper.toDto(entity);
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(entity.getId());
    }

    @Test
    @DisplayName("NotificationMapper should map correctly")
    void testNotificationMapper() {
        Notification entity = createMockNotification();
        NotificationResponseDto dto = notificationMapper.toDto(entity);
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(entity.getId());
    }

    @Test
    @DisplayName("PrescriptionMapper should map correctly")
    void testPrescriptionMapper() {
        Prescription entity = createMockPrescription();
        PrescriptionResponseDto dto = prescriptionMapper.toDto(entity);
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(entity.getId());
    }

    @Test
    @DisplayName("StatMapper should map StatDuJour correctly")
    void testStatMapper() {
        StatDuJour entity = new StatDuJour();
        entity.setJour("2026-01-01");
        entity.setRevenu(1000.0);
        StatDuJourResponseDto dto = statMapper.toDto(entity);
        assertThat(dto).isNotNull();
        assertThat(dto.getRevenu()).isEqualTo(1000.0);
    }
}
