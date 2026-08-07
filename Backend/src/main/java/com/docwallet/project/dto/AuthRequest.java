package com.docwallet.project.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter@Getter@AllArgsConstructor@NoArgsConstructor
public class AuthRequest {
    @NotBlank(message = "email cannot be blank")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "password must not be blank")
    @Size(min=6 ,message = "password should be at least 6 characters")
    private String password;
}
