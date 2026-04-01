package com.example.demo.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "ticket_history")
public class TicketHistory {

    @Id
    private String id;

    private String ticketId;

    private String status;

    private String changedBy;

    private LocalDateTime changedAt;
}
