package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Comment;
import com.example.demo.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{ticketId}/comments")
    public Comment addComment(
            @PathVariable String ticketId,
            @RequestBody Comment comment) {

        comment.setTicketId(ticketId);

        return commentService.addComment(comment);
    }

    @GetMapping("/{ticketId}/comments")
    public List<Comment> getComments(@PathVariable String ticketId) {

        return commentService.getComments(ticketId);
    }
}
