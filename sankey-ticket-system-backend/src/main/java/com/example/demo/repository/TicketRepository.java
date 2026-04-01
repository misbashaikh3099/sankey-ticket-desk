package com.example.demo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.model.Priority;

import com.example.demo.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByBuyerId(String buyerId);

    List<Ticket> findByVendorId(String vendorId);

    List<Ticket> findByPriority(Priority priority);

    Page<Ticket> findAll(Pageable pageable);

    List<Ticket> findByStatus(String status);

    List<Ticket> findByTitleContainingIgnoreCase(String keyword);

}
