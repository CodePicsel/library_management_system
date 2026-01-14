package com.lms.lmsBackend.services;

import com.lms.lmsBackend.dto.AdminDto;
import com.lms.lmsBackend.model.Admin;
import com.lms.lmsBackend.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService{
    @Autowired
    private AdminRepo adminRepo;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public Admin register(AdminDto adminDto){
        Admin admin = new Admin();
        admin.setUsername(adminDto.getUsername());

        // Encode the raw password from the DTO
        admin.setPassword(bCryptPasswordEncoder.encode(adminDto.getPassword()));

        admin.setRole("ROLE_ADMIN");
        return adminRepo.save(admin);
    }

    @Autowired
    private AuthenticationManager authenticationManager;

    public String login(Admin admin) {
        try {
            // This triggers the DaoAuthenticationProvider -> MyAdminDetailsService
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(admin.getUsername(), admin.getPassword())
            );

            if (authentication.isAuthenticated()) {
                return "Login Success";
            }
            return "Failed";

        } catch (BadCredentialsException e) {
            return "Invalid username or password";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
