package com.smartcrime.portal.controller;

import com.smartcrime.portal.dto.ApiResponse;
import com.smartcrime.portal.model.User;
import com.smartcrime.portal.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestParam(required = false, defaultValue = "BADGE-101") String badgeNumber) {
        User user = userService.getUserByBadgeNumber(badgeNumber);
        return ResponseEntity.ok(ApiResponse.success("Authenticated user profile retrieved", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(@RequestParam String badgeNumber) {
        User user = userService.getUserByBadgeNumber(badgeNumber);
        return ResponseEntity.ok(ApiResponse.success("Login successful", user));
    }
}
