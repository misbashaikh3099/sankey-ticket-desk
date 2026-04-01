package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String title;
    private String description;

    private Priority priority;
    // LOW | MEDIUM | HIGH | CRITICAL

    private String status;


    private String buyerId;
    private String vendorId;

    private List<String> attachments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    private String resolutionNotes;
    private Long resolutionTimeHours;


    private String resolveReason;
}