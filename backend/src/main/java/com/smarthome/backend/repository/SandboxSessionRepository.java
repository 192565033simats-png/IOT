package com.smarthome.backend.repository;

import com.smarthome.backend.model.SandboxSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SandboxSessionRepository
        extends JpaRepository<SandboxSession, Long> {
}