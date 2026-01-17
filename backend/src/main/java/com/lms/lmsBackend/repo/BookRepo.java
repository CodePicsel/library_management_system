package com.lms.lmsBackend.repo;

import com.lms.lmsBackend.model.Books;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookRepo extends JpaRepository<Books,Long> {
    List<Books> findByIsAvailableFalseAndReturnByBefore(LocalDateTime now);
    List<Books> findByIsAvailableTrue();
}
