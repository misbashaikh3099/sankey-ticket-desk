package com.example.demo.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Comment;
import com.example.demo.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public Comment addComment(Comment comment) {
        comment.setCreatedDate(new Date());
        return commentRepository.save(comment);
    }

    public List<Comment> getComments(String ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }
}