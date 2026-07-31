package com.scap.controller;

import com.scap.dto.AuthRequest;
import com.scap.dto.AuthResponse;
import com.scap.dto.UserDto;
import com.scap.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(authService.login(authRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestParam String badgeNumber) {
        return ResponseEntity.ok(authService.getCurrentUser(badgeNumber));
    }
}
