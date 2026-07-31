package com.scap.service;

import com.scap.dto.UserDto;
import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(String id);
    UserDto createUser(UserDto userDto);
    UserDto updateUser(String id, UserDto userDto);
    void deleteUser(String id);
}
