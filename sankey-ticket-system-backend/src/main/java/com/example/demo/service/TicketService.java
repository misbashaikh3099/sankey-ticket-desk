package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CreateTicketRequest;
import com.example.demo.dto.TicketResponse;
import com.example.demo.model.Priority;
import com.example.demo.model.Ticket;
import com.example.demo.model.TicketHistory;
import com.example.demo.model.User;
import com.example.demo.repository.TicketHistoryRepository;
import com.example.demo.repository.TicketRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final UserRepository userRepository;

    private static final Map<String, Set<String>> ALLOWED_TRANSITIONS = Map.of(
            "OPEN",        Set.of("ASSIGNED"),
            "ASSIGNED",    Set.of("IN_PROGRESS"),
            "IN_PROGRESS", Set.of("RESOLVED"),
            "RESOLVED",    Set.of("CLOSED"),
            "CLOSED",      Set.of()
    );

    private String currentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private String currentUserRole() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();
    }

    private User currentUser() {
        String email = currentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    public TicketResponse createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(Priority.valueOf(request.getPriority()));
        ticket.setBuyerId(request.getBuyerId());
        ticket.setAttachments(request.getAttachments());
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        saveHistory(saved.getId(), "OPEN");
        return toResponse(saved);
    }

    public List<Ticket> getTicketsByBuyer(String buyerId) {
        String role = currentUserRole();
        if (role.equals("ROLE_BUYER")) {
            String callerId = currentUser().getId();
            if (!callerId.equals(buyerId)) {
                throw new RuntimeException("You can only view your own tickets");
            }
        }
        return ticketRepository.findByBuyerId(buyerId);
    }

    public Ticket updateStatus(String ticketId, String newStatus, String resolveReason) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        String role = currentUserRole();

        if (role.equals("ROLE_VENDOR")) {
            String callerId = currentUser().getId();
            if (!callerId.equals(ticket.getVendorId())) {
                throw new RuntimeException("You can only update tickets assigned to you");
            }
        }

        if (role.equals("ROLE_BUYER")) {
            String callerId = currentUser().getId();
            if (!callerId.equals(ticket.getBuyerId())) {
                throw new RuntimeException("You can only update your own tickets");
            }
            if (!"CLOSED".equals(newStatus)) {
                throw new RuntimeException("Buyers can only close resolved tickets");
            }
        }

        String currentStatus = ticket.getStatus();
        Set<String> allowed = ALLOWED_TRANSITIONS.getOrDefault(currentStatus, Set.of());
        if (!allowed.contains(newStatus)) {
            throw new RuntimeException(
                    "Invalid status transition: " + currentStatus + " → " + newStatus +
                            ". Allowed next statuses: " + allowed
            );
        }

        if ("RESOLVED".equals(newStatus) && (resolveReason == null || resolveReason.isBlank())) {
            throw new RuntimeException("A resolve reason is required when resolving a ticket");
        }

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());

        if ("RESOLVED".equals(newStatus)) {
            ticket.setResolvedAt(LocalDateTime.now());
            ticket.setResolveReason(resolveReason);
            long hours = ChronoUnit.HOURS.between(ticket.getCreatedAt(), LocalDateTime.now());
            ticket.setResolutionTimeHours(hours);
        }

        Ticket updated = ticketRepository.save(ticket);
        saveHistory(ticketId, newStatus);
        return updated;
    }

    public Ticket assignVendor(String ticketId, String vendorId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        ticket.setVendorId(vendorId);
        ticket.setStatus("ASSIGNED");
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updated = ticketRepository.save(ticket);
        saveHistory(ticketId, "ASSIGNED");
        return updated;
    }

    public List<Ticket> getTicketsByVendor(String vendorId) {
        return ticketRepository.findByVendorId(vendorId);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    public List<Ticket> getTicketsByPriority(String priority) {
        Priority p = Priority.valueOf(priority.toUpperCase());
        return ticketRepository.findByPriority(p);
    }

    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    public Page<Ticket> getTickets(int page, int size) {
        return ticketRepository.findAll(PageRequest.of(page, size));
    }

    public List<TicketHistory> getTicketHistory(String ticketId) {
        return ticketHistoryRepository.findByTicketId(ticketId);
    }

    public List<Ticket> searchTickets(String keyword) {
        return ticketRepository.findByTitleContainingIgnoreCase(keyword);
    }

    private void saveHistory(String ticketId, String status) {
        TicketHistory history = new TicketHistory();
        history.setTicketId(ticketId);
        history.setStatus(status);
        history.setChangedAt(LocalDateTime.now());
        history.setChangedBy(currentUserEmail());
        ticketHistoryRepository.save(history);
    }

    private TicketResponse toResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setPriority(ticket.getPriority() != null ? ticket.getPriority().name() : null);
        response.setStatus(ticket.getStatus());
        response.setBuyerId(ticket.getBuyerId());
        response.setVendorId(ticket.getVendorId());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        return response;
    }
}