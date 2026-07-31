package com.scap.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private String id;

    @NotBlank(message = "Badge number is required")
    private String badgeNumber;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Role is required")
    private String role; // ADMIN, POLICE_OFFICER, INVESTIGATOR, FORENSIC_OFFICER

    private String department;
    private String avatarUrl;
    private String status; // ACTIVE, SUSPENDED
    private String lastLogin;
}
