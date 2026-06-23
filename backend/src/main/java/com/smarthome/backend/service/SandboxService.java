package com.smarthome.backend.service;

import com.smarthome.backend.model.SandboxSession;
import com.smarthome.backend.repository.SandboxSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SandboxService {

    private final SandboxSessionRepository sandboxSessionRepository;

    public SandboxService(
            SandboxSessionRepository sandboxSessionRepository) {

        this.sandboxSessionRepository = sandboxSessionRepository;
    }

    public void launchSandbox(String attackerIp) {

        try {

            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    "IoTSandbox.py",
                    "--target",
                    attackerIp
            );

            pb.start();

            SandboxSession session = new SandboxSession();

            session.setDeviceName("Sandbox Device");
            session.setAction("Threat Analysis");
            session.setStatus("Running");
            session.setTimestamp(
                    LocalDateTime.now().toString()
            );

            sandboxSessionRepository.save(session);

        } catch (Exception e) {

            SandboxSession session = new SandboxSession();

            session.setDeviceName("Sandbox Device");
            session.setAction("Threat Analysis");
            session.setStatus("Failed");
            session.setTimestamp(
                    LocalDateTime.now().toString()
            );

            sandboxSessionRepository.save(session);

            e.printStackTrace();
        }
    }
}