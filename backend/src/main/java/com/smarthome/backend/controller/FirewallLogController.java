package com.smarthome.backend.controller;

import com.smarthome.backend.model.FirewallLog;
import com.smarthome.backend.repository.FirewallLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/firewall-logs")
public class FirewallLogController {

    private final FirewallLogRepository repository;

    public FirewallLogController(FirewallLogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<FirewallLog> getLogs() {
        return repository.findAll();
    }

    @PostMapping
    public FirewallLog createLog(@RequestBody FirewallLog log) {
        return repository.save(log);
    }
}