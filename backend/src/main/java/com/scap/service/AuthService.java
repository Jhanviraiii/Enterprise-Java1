package com.scap.service;

import com.scap.dto.AuthRequest;
import com.scap.dto.AuthResponse;
import com.scap.dto.UserDto;

public interface AuthService {
    AuthResponse login(AuthRequest authRequest);
    UserDto getCurrentUser(String badgeNumber);
}
