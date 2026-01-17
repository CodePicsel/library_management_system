package com.lms.lmsBackend.services;

import com.lms.lmsBackend.model.Books;
import com.lms.lmsBackend.model.Student;
import com.lms.lmsBackend.repo.BookRepo;
import com.lms.lmsBackend.repo.StudentRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BooksService {

    @Autowired
    private BookRepo bookRepo;

    @Autowired
    private StudentRepo studentRepo;

    // Only Admin can add
    public Books addBook(Books books) throws IOException {
        return bookRepo.save(books);
    }

    // Only Admin can set fines
    public void setFine(Long studentId, float amount) {
        Student student = studentRepo.findById(studentId).get();
        student.setFine(amount);
        studentRepo.save(student);
    }

    @Transactional
    public String rentBook(Long book_id, String username) {
        Books books1 = bookRepo.findById(book_id).orElseThrow();
        Student student = studentRepo.findByUsername(username);

        if (books1.isAvailable()) {
            books1.setAvailable(false);
            books1.setCurrentHolder(student);

            // SET THE TIMESTAMPS
            LocalDateTime now = LocalDateTime.now();
            books1.setBorrowedAt(now);

            // Setting return time to 14 days from today
            books1.setReturnBy(now.plusDays(14));

            bookRepo.save(books1);
            return "Rented! Return by: " + books1.getReturnBy();
        }
        return "Book Unavailable";
    }
    public void checkAndApplyFines(Long bookId) {
        Books book2 = bookRepo.findById(bookId).orElseThrow();

        if (!book2.isAvailable() && LocalDateTime.now().isAfter(book2.getReturnBy())) {
            // Calculate days overdue
            long daysOverdue = ChronoUnit.DAYS.between(book2.getReturnBy(), LocalDateTime.now());

            // Logic: 10 rupees per day
            float totalFine = daysOverdue * 10.0f;

            Student student = book2.getCurrentHolder();
            student.setFine(totalFine);
            studentRepo.save(student);
        }
    }
    //Listing All Books On Device Which are Available
    public List<Books> getAllBooks() {
        return bookRepo.findByIsAvailableTrue();
    }

    @Transactional
    public String returnBook(Long bookId) {
        Books book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.isAvailable()) {
            return "This book is already in the library.";
        }

        // 1. Calculate Fine if Overdue
        if (LocalDateTime.now().isAfter(book.getReturnBy())) {
            long daysLate = ChronoUnit.DAYS.between(book.getReturnBy(), LocalDateTime.now());
            float fineAmount = daysLate * 5.0f; // Example: 5 rupees per day

            Student student = book.getCurrentHolder();
            student.setFine(student.getFine() + fineAmount);
            studentRepo.save(student);
        }

        // 2. Reset Book Status
        book.setCurrentHolder(null);
        book.setAvailable(true);
        book.setBorrowedAt(null);
        book.setReturnBy(null);

        bookRepo.save(book);

        return "Book returned successfully!";
    }
}
