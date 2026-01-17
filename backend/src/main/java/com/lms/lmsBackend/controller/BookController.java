package com.lms.lmsBackend.controller;

import com.lms.lmsBackend.model.Books;
import com.lms.lmsBackend.services.BooksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BooksService booksService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProduct(@RequestBody Books books) {
        try {
            Books books1 = booksService.addBook(books);
            return new ResponseEntity<>(books1, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/set-fine/{student_id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateFine(@PathVariable Long student_id, @RequestParam float fine) {
        booksService.setFine(student_id, fine);
        return ResponseEntity.ok("Fine updated");
    }

    @GetMapping("/books-all")
    public ResponseEntity<List<Books>> getAllBooks() {
        return new ResponseEntity<>(booksService.getAllBooks(), HttpStatus.OK);
    }

}
