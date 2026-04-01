package com.example.demo.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CreateTicketRequest;
import com.example.demo.dto.TicketResponse;
import com.example.demo.dto.UpdateStatusRequest;
import com.example.demo.model.Ticket;
import com.example.demo.model.TicketHistory;
import com.example.demo.service.TicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public TicketResponse createTicket(@Valid @RequestBody CreateTicketRequest request) {
        return ticketService.createTicket(request);
    }

    @GetMapping("/buyer/{buyerId}")
    public List<Ticket> getBuyerTickets(@PathVariable String buyerId) {
        // Service layer verifies the caller owns this buyerId
        return ticketService.getTicketsByBuyer(buyerId);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }


    @PutMapping("/{ticketId}/assign/{vendorId}")
    public Ticket assignVendor(
            @PathVariable String ticketId,
            @PathVariable String vendorId) {
        return ticketService.assignVendor(ticketId, vendorId);
    }

    @GetMapping("/vendor/{vendorId}")
    public List<Ticket> getVendorTickets(@PathVariable String vendorId) {
        return ticketService.getTicketsByVendor(vendorId);
    }


    @PutMapping("/{ticketId}/status/{status}")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String ticketId,
            @PathVariable String status,
            @RequestBody(required = false) UpdateStatusRequest body) {

        String resolveReason = body != null ? body.getResolveReason() : null;
        Ticket updated = ticketService.updateStatus(ticketId, status, resolveReason);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable String id) {
        return ticketService.getTicketById(id);
    }

    @GetMapping("/priority/{priority}")
    public List<Ticket> getTicketsByPriority(@PathVariable String priority) {
        return ticketService.getTicketsByPriority(priority);
    }

    @GetMapping("/page")
    public Page<Ticket> getTickets(
            @RequestParam int page,
            @RequestParam int size) {
        return ticketService.getTickets(page, size);
    }

    @GetMapping("/status/{status}")
    public List<Ticket> getTicketsByStatus(@PathVariable String status) {
        return ticketService.getTicketsByStatus(status);
    }

    @GetMapping("/{ticketId}/history")
    public List<TicketHistory> getHistory(@PathVariable String ticketId) {
        return ticketService.getTicketHistory(ticketId);
    }

    @GetMapping("/search")
    public List<Ticket> searchTickets(@RequestParam String keyword) {
        return ticketService.searchTickets(keyword);
    }
}