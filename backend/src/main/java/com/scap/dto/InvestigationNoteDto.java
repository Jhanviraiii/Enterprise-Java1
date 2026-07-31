package com.scap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvestigationNoteDto {

    private String id;

    @NotBlank(message = "Case ID is required")
    private String caseId;

    private String timestamp;
    private String authorName;
    private String authorRole;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Category is required")
    private String category;
}
