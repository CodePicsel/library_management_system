package com.lms.lmsBackend.repo;

import com.lms.lmsBackend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepo extends JpaRepository<Admin,Long> {
    Admin findByUsername(String username);
}
