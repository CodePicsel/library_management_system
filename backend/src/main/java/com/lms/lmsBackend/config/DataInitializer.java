package com.lms.lmsBackend.config;

import com.lms.lmsBackend.model.Admin;
import com.lms.lmsBackend.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private AdminRepo adminRepo;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if(adminRepo.count() == 0){
            Admin admin = new Admin();
            admin.setUsername("SuperAdmin");
            admin.setPassword(bCryptPasswordEncoder.encode("SuperAdmin@123"));
            admin.setRole("ROLE_ADMIN");
            adminRepo.save(admin);
        }
    }
}
