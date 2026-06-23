package com.smarthome.backend.controller;

import com.smarthome.backend.model.SandboxSession;
import com.smarthome.backend.repository.SandboxSessionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sandbox-sessions")
public class SandboxSessionController {

    private final SandboxSessionRepository repository;

    public SandboxSessionController(SandboxSessionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SandboxSession> getSessions() {
        return repository.findAll();
    }

    @PostMapping
    public SandboxSession createSession(
            @RequestBody SandboxSession session) {
        return repository.save(session);
    }
}