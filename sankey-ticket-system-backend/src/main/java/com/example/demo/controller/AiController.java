package com.example.demo.controller;

import com.example.demo.service.AiService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/reply")
    public String generateReply(@RequestBody Map<String, Object> request) {

        String title = request.get("title").toString();
        String description = request.get("description").toString();
        List<Map<String, String>> messages =
                (List<Map<String, String>>) request.get("messages");

        return aiService.generateReply(title, description, messages);
    }
}