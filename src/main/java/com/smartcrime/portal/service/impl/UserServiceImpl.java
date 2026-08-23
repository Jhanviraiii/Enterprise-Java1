package com.smartcrime.portal.service.impl;

import com.smartcrime.portal.dto.UserDto;
import com.smartcrime.portal.exception.ResourceNotFoundException;
import com.smartcrime.portal.model.User;
import com.smartcrime.portal.repository.UserRepository;
import com.smartcrime.portal.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByBadgeNumber(String badgeNumber) {
        return userRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with badge number: " + badgeNumber));
    }

    @Override
    public User createUser(UserDto userDto) {
        User user = new User();
        if (userDto.getId() != null && !userDto.getId().trim().isEmpty()) {
            user.setId(userDto.getId());
        }
        user.setBadgeNumber(userDto.getBadgeNumber());
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setRole(userDto.getRole() != null ? userDto.getRole() : "POLICE_OFFICER");
        user.setDepartment(userDto.getDepartment());
        user.setAvatarUrl(userDto.getAvatarUrl());
        user.setStatus(userDto.getStatus() != null ? userDto.getStatus() : "ACTIVE");
        user.setLastLogin(userDto.getLastLogin());
        return userRepository.save(user);
    }

    @Override
    public User updateUser(String id, UserDto userDto) {
        User existingUser = getUserById(id);
        if (userDto.getName() != null) existingUser.setName(userDto.getName());
        if (userDto.getEmail() != null) existingUser.setEmail(userDto.getEmail());
        if (userDto.getRole() != null) existingUser.setRole(userDto.getRole());
        if (userDto.getDepartment() != null) existingUser.setDepartment(userDto.getDepartment());
        if (userDto.getAvatarUrl() != null) existingUser.setAvatarUrl(userDto.getAvatarUrl());
        if (userDto.getStatus() != null) existingUser.setStatus(userDto.getStatus());
        if (userDto.getLastLogin() != null) existingUser.setLastLogin(userDto.getLastLogin());
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
