package com.lms.lmsBackend.controller;

import com.lms.lmsBackend.dto.StudentDto;
import com.lms.lmsBackend.model.Student;
import com.lms.lmsBackend.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @PostMapping("/register")
    public Student register(@RequestBody StudentDto studentDto){
        return studentService.register(studentDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Student student){
        String success = studentService.login(student);
        if ("Login Successful".equals(success)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(success);
        }
    }
}
