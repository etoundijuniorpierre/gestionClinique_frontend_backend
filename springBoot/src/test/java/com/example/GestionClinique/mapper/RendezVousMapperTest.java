package com.example.GestionClinique.mapper;

import com.example.GestionClinique.dto.ResponseDto.RendezVousResponseDto;
import com.example.GestionClinique.model.entity.RendezVous;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static com.example.GestionClinique.testutils.MockDataFactory.createMockRendezVous;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {
        RendezVousMapperImpl.class,
        PatientMapperImpl.class,
        UtilisateurMapperImpl.class,
        FactureMapperImpl.class,
        ConsultationMapperImpl.class
})
@DisplayName("RendezVous Mapper Unit Tests")
class RendezVousMapperTest {

    @Autowired
    private RendezVousMapper rendezVousMapper;

    @Test
    @DisplayName("Should map RendezVous to DTO with nested entities")
    void testToDto() {
        RendezVous rdv = createMockRendezVous();

        RendezVousResponseDto dto = rendezVousMapper.toDto(rdv);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(rdv.getId());
        assertThat(dto.getPatient()).isNotNull();
        assertThat(dto.getMedecin()).isNotNull();
    }
}
