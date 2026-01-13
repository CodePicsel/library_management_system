package com.lms.lmsBackend.services;

import com.lms.lmsBackend.config.AdminPrincipal;
import com.lms.lmsBackend.model.Admin;
import com.lms.lmsBackend.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyAdminDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepo adminRepo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin Not Found"));
        return new AdminPrincipal(admin);
    }
}
