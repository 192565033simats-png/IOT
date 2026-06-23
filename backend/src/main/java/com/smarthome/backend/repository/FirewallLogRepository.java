package com.smarthome.backend.repository;

import com.smarthome.backend.model.FirewallLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FirewallLogRepository
        extends JpaRepository<FirewallLog, Long> {
}