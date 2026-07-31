package com.scap.service.impl;

import com.scap.dto.UserDto;
import com.scap.entity.Role;
import com.scap.entity.User;
import com.scap.exception.DuplicateRecordException;
import com.scap.exception.ResourceNotFoundException;
import com.scap.repository.RoleRepository;
import com.scap.repository.UserRepository;
import com.scap.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToDto(user);
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        if (userRepository.existsByBadgeNumber(userDto.getBadgeNumber())) {
            throw new DuplicateRecordException("User with badge number " + userDto.getBadgeNumber() + " already exists.");
        }

        Role role = roleRepository.findByName(userDto.getRole())
                .orElseGet(() -> roleRepository.save(Role.builder().name(userDto.getRole()).description("System Role").build()));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .badgeNumber(userDto.getBadgeNumber())
                .username(userDto.getBadgeNumber().toLowerCase())
                .name(userDto.getName())
                .email(userDto.getEmail())
                .passwordHash(passwordEncoder.encode("Password@123"))
                .status(userDto.getStatus() != null ? userDto.getStatus() : "ACTIVE")
                .avatarUrl(userDto.getAvatarUrl())
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    @Override
    public UserDto updateUser(String id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        if (userDto.getStatus() != null) user.setStatus(userDto.getStatus());
        if (userDto.getAvatarUrl() != null) user.setAvatarUrl(userDto.getAvatarUrl());

        if (userDto.getRole() != null) {
            Role role = roleRepository.findByName(userDto.getRole())
                    .orElseGet(() -> roleRepository.save(Role.builder().name(userDto.getRole()).description("System Role").build()));
            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .badgeNumber(user.getBadgeNumber())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRoles().isEmpty() ? "POLICE_OFFICER" : user.getRoles().iterator().next().getName())
                .department(user.getDepartment() != null ? user.getDepartment().getName() : "General Operations")
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .lastLogin(user.getLastLogin() != null ? user.getLastLogin().toString() : null)
                .build();
    }
}
