package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.model.Priority;
import com.example.demo.model.Ticket;
import com.example.demo.model.User;
import com.example.demo.repository.TicketRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public Map<String, Long> getTicketStats() {
        List<Ticket> tickets = ticketRepository.findAll();

        Map<String, Long> stats = new HashMap<>();
        stats.put("total",      (long) tickets.size());
        stats.put("open",       count(tickets, "OPEN"));
        stats.put("assigned",   count(tickets, "ASSIGNED"));
        stats.put("inProgress", count(tickets, "IN_PROGRESS"));
        stats.put("resolved",   count(tickets, "RESOLVED"));
        stats.put("closed",     count(tickets, "CLOSED"));
        return stats;
    }

    public Map<String, Long> getPriorityStats() {
        List<Ticket> tickets = ticketRepository.findAll();

        Map<String, Long> stats = new HashMap<>();

        stats.put("low",      countByPriority(tickets, Priority.LOW));
        stats.put("medium",   countByPriority(tickets, Priority.MEDIUM));
        stats.put("high",     countByPriority(tickets, Priority.HIGH));
        stats.put("critical", countByPriority(tickets, Priority.CRITICAL));
        return stats;
    }


    public Map<String, Long> vendorPerformance() {
        List<Ticket> tickets = ticketRepository.findAll();
        Map<String, Long> performance = new HashMap<>();

        tickets.stream()
                .filter(t -> t.getVendorId() != null)
                .forEach(t -> {
                    // FIX: was returning vendorId as key — now resolves to human-readable name
                    String vendorName = userRepository.findById(t.getVendorId())
                            .map(User::getName)
                            .orElse(t.getVendorId()); // fallback to ID if user deleted
                    performance.merge(vendorName, 1L, Long::sum);
                });

        return performance;
    }

    public Map<String, Double> getSlaReport() {
        List<Ticket> tickets = ticketRepository.findAll();

        double avgResolution = tickets.stream()
                .filter(t -> t.getResolutionTimeHours() != null)
                .mapToLong(Ticket::getResolutionTimeHours)
                .average()
                .orElse(0);

        Map<String, Double> sla = new HashMap<>();
        sla.put("averageResolutionHours", avgResolution);
        return sla;
    }

    private long count(List<Ticket> tickets, String status) {
        return tickets.stream().filter(t -> status.equals(t.getStatus())).count();
    }

    private long countByPriority(List<Ticket> tickets, Priority priority) {
        return tickets.stream().filter(t -> priority == t.getPriority()).count();
    }
}