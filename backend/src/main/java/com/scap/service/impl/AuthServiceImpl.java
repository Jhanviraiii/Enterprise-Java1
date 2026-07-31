package com.scap.service.impl;

import com.scap.dto.AuthRequest;
import com.scap.dto.AuthResponse;
import com.scap.dto.UserDto;
import com.scap.entity.User;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.UserRepository;
import com.scap.security.JwtTokenProvider;
import com.scap.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    public AuthResponse login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getBadgeNumberOrUsername(),
                        authRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByBadgeNumber(authRequest.getBadgeNumberOrUsername())
                .or(() -> userRepository.findByUsername(authRequest.getBadgeNumberOrUsername()))
                .or(() -> userRepository.findByEmail(authRequest.getBadgeNumberOrUsername()))
                .orElseThrow(() -> new ResourceNotFoundException("User", "badgeNumber", authRequest.getBadgeNumberOrUsername()));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .badgeNumber(user.getBadgeNumber())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRoles().isEmpty() ? "POLICE_OFFICER" : user.getRoles().iterator().next().getName())
                .department(user.getDepartment() != null ? user.getDepartment().getName() : "General Police Division")
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .lastLogin(user.getLastLogin().toString())
                .build();

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(userDto)
                .build();
    }

    @Override
    public UserDto getCurrentUser(String badgeNumber) {
        User user = userRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new ResourceNotFoundException("User", "badgeNumber", badgeNumber));

        return UserDto.builder()
                .id(user.getId())
                .badgeNumber(user.getBadgeNumber())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRoles().isEmpty() ? "POLICE_OFFICER" : user.getRoles().iterator().next().getName())
                .department(user.getDepartment() != null ? user.getDepartment().getName() : "General Police Division")
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .lastLogin(user.getLastLogin() != null ? user.getLastLogin().toString() : null)
                .build();
    }
}
