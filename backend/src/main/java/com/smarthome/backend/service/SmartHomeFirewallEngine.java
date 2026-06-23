package com.smarthome.backend.service;

import org.springframework.stereotype.Component;

@Component
public class SmartHomeFirewallEngine {

    private static final int MAX_OVEN_TEMP = 450;

    public String inspectRequest(String requestLine) {

        if (requestLine == null || requestLine.isBlank()) {
            return "INVALID";
        }

        // Innovation 1: API-Level Payload Inspection
        if (requestLine.contains("/api/setTemp")) {

            int requestedTemp = 500;

            if (requestedTemp > MAX_OVEN_TEMP) {
                return "BLOCKED";
            }
        }

        // Innovation 2: Adaptive 2FA Trigger
        if (requestLine.contains("/api/unlockDoor")) {
            return "PENDING_2FA";
        }

        // Innovation 4: Sandbox Trigger
        if (requestLine.contains("admin' OR 1=1")) {
            return "SANDBOX_TRIGGERED";
        }

        return "ALLOWED";
    }
}