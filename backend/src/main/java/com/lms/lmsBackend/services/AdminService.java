package com.lms.lmsBackend.services;

import com.lms.lmsBackend.model.Admin;
import com.lms.lmsBackend.repo.AdminRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService{
    @Autowired
    private AdminRepo adminRepo;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public Admin register(Admin admin){
        System.out.println("saved");
        admin.setPassword(bCryptPasswordEncoder.encode(admin.getPassword()));
        Admin saved = adminRepo.save(admin);
        return saved;
    }

}
