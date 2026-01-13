package com.lms.lmsBackend.controller;

import com.lms.lmsBackend.model.Admin;
import com.lms.lmsBackend.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public Admin register(@RequestBody Admin admin){
        return adminService.register(admin);
    }
}
