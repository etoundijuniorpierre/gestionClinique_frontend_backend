package com.example.GestionClinique.mapper;

import com.example.GestionClinique.dto.ResponseDto.PatientResponseDto;
import com.example.GestionClinique.model.entity.Patient;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static com.example.GestionClinique.testutils.MockDataFactory.createMockPatient;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = PatientMapperImpl.class)
@DisplayName("Patient Mapper Unit Tests")
class PatientMapperTest {

    @Autowired
    private PatientMapper patientMapper;

    @Test
    @DisplayName("Should map Patient to DTO")
    void testToDto() {
        Patient patient = createMockPatient(1L, "Nguemo", "Jean");

        PatientResponseDto dto = patientMapper.toDto(patient);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getNom()).isEqualTo("Nguemo");
        assertThat(dto.getPrenom()).isEqualTo("Jean");
    }

    @Test
    @DisplayName("Should return null for null input")
    void testToDto_Null() {
        assertThat(patientMapper.toDto(null)).isNull();
    }
}
