package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketResponse {

    private String id;
    private String title;
    private String description;
    private String priority;
    private String status;

    private String buyerId;
    private String vendorId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
