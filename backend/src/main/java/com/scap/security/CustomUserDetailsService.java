package com.scap.security;

import com.scap.entity.User;
import com.scap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrBadgeNumber) throws UsernameNotFoundException {
        User user = userRepository.findByBadgeNumber(usernameOrBadgeNumber)
                .or(() -> userRepository.findByUsername(usernameOrBadgeNumber))
                .or(() -> userRepository.findByEmail(usernameOrBadgeNumber))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with badge/username/email: " + usernameOrBadgeNumber));

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        return UserPrincipal.create(user);
    }
}
