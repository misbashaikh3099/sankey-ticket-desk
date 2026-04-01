package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String generateReply(String title, String description, List<Map<String, String>> messages) {

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama-3.1-8b-instant");

        List<Map<String, String>> apiMessages = new ArrayList<>();


        apiMessages.add(Map.of(
                "role", "system",
                "content", "You are a professional support agent. Answer directly, short and accurate."
        ));


        apiMessages.add(Map.of(
                "role", "user",
                "content", "Ticket: " + title + "\nIssue: " + description
        ));

        apiMessages.addAll(messages);

        body.put("messages", apiMessages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, request, Map.class);

        List choices = (List) response.getBody().get("choices");
        Map first = (Map) choices.get(0);
        Map message = (Map) first.get("message");

        return message.get("content").toString();
    }
}