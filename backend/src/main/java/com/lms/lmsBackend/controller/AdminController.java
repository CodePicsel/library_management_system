package com.lms.lmsBackend.controller;

import com.lms.lmsBackend.dto.AdminDto;
import com.lms.lmsBackend.model.Admin;
import com.lms.lmsBackend.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public Admin register(@RequestBody AdminDto adminDto) {
        return adminService.register(adminDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin){
        String success = adminService.login(admin);
        System.out.println("Welcome To Admin DashBoard");
        if("Login Success".equals(success)){
            return ResponseEntity.ok("Login Successful");
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(success);
        }
    }
}
