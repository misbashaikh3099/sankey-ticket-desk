//package com.example.demo.controller;
//
//import java.util.Map;
//
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.example.demo.service.ReportService;
//
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/reports")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
//public class ReportController {
//
//    private final ReportService reportService;
//
//    @GetMapping("/tickets")
//    public Map<String, Long> getTicketStats() {
//        return reportService.getTicketStats();
//    }
//
//    @GetMapping("/vendors/performance")
//    public Map<String, Long> vendorPerformance() {
//        return reportService.vendorPerformance();
//    }
//
//    @GetMapping("/sla")
//    public Map<String, Double> getSlaReport() {
//        return reportService.getSlaReport();
//    }
//
//    @GetMapping("/priority")
//    public Map<String, Long> getPriorityStats() {
//        return reportService.getPriorityStats();
//    }
//}
package com.example.demo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.ReportService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;


    @GetMapping("/stats")
    public Map<String, Long> getTicketStats() {
        return reportService.getTicketStats();
    }


    @GetMapping("/priority")
    public Map<String, Long> getPriorityStats() {
        return reportService.getPriorityStats();
    }


    @GetMapping("/vendor-performance")
    public Map<String, Long> getVendorPerformance() {
        return reportService.vendorPerformance();
    }


    @GetMapping("/sla")
    public Map<String, Double> getSlaReport() {
        return reportService.getSlaReport();
    }
}