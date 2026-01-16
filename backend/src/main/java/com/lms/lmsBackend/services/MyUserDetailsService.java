package com.lms.lmsBackend.services;

import com.lms.lmsBackend.config.AdminPrincipal;
import com.lms.lmsBackend.config.StudentPrincipal;
import com.lms.lmsBackend.model.Admin;
import com.lms.lmsBackend.model.Student;
import com.lms.lmsBackend.repo.AdminRepo;
import com.lms.lmsBackend.repo.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private StudentRepo studentRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Student student = studentRepo.findByUsername(username);
        Admin admin = adminRepo.findByUsername(username);
        if (admin != null) {
            return new AdminPrincipal(admin);
        }
        if (student != null) {
            return new StudentPrincipal(student);
        }
        throw new UsernameNotFoundException("Username Not Found" +username);
    }
}
