package com.lms.lmsBackend.repo;

import com.lms.lmsBackend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AdminRepo extends JpaRepository<Admin,Long> {
    Admin findByUsername(String username);
}
