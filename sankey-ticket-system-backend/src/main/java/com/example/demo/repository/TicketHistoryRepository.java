package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.model.TicketHistory;

import java.util.List;

public interface TicketHistoryRepository extends MongoRepository<TicketHistory,String> {

    List<TicketHistory> findByTicketId(String ticketId);
}