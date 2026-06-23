package com.smarthome.backend.service;

import com.smarthome.backend.model.FirewallLog;
import com.smarthome.backend.repository.FirewallLogRepository;
import org.springframework.stereotype.Service;

@Service
public class FirewallEngineService {

    private final FirewallLogRepository firewallLogRepository;
    private final SmartHomeFirewallEngine smartHomeFirewallEngine;
    private final SandboxService sandboxService;

    public FirewallEngineService(
            FirewallLogRepository firewallLogRepository,
            SmartHomeFirewallEngine smartHomeFirewallEngine,
            SandboxService sandboxService) {

        this.firewallLogRepository = firewallLogRepository;
        this.smartHomeFirewallEngine = smartHomeFirewallEngine;
        this.sandboxService = sandboxService;
    }

    public String analyzeRequest(String requestLine) {

        String result =
                smartHomeFirewallEngine.inspectRequest(requestLine);

        if ("SANDBOX_TRIGGERED".equals(result)) {
            sandboxService.launchSandbox("192.168.1.100");
        }

        FirewallLog log = new FirewallLog();

        log.setDeviceName("Smart Device");
        log.setAction(result);
        log.setSourceIp("192.168.1.100");
        log.setDestinationIp("10.0.0.1");
        log.setTimestamp(java.time.LocalDateTime.now().toString());

        firewallLogRepository.save(log);

        return result;
    }
}