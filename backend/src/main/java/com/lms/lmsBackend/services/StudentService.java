package com.lms.lmsBackend.services;

import com.lms.lmsBackend.dto.StudentDto;
import com.lms.lmsBackend.model.Student;
import com.lms.lmsBackend.repo.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class StudentService  {
    @Autowired
    private StudentRepo studentRepo;

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public Student register(StudentDto studentDto){
        Student student = new Student();
        student.setUsername(studentDto.getUsername());
        student.setPassword(bCryptPasswordEncoder.encode(studentDto.getPassword()));
        student.setEmail(studentDto.getEmail());
        student.setRole("ROLE_STUDENT");
        return studentRepo.save(student);
    }
    @Autowired
    AuthenticationManager authenticationManager;
    public String login(Student student){
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(student.getUsername(),student.getPassword())
            );
            if (authentication.isAuthenticated()) {
                return "Login Successful";
            }
            return "Login Failed";
        } catch (BadCredentialsException e) {
            return  "Invalid Username or password";
        } catch (Exception e) {
            return "Error" +e.getMessage();
        }
    }

}
