package com.smarthome.backend.controller;

import com.smarthome.backend.dto.FirewallRequest;
import com.smarthome.backend.service.FirewallEngineService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/firewall")
public class FirewallEngineController {

    private final FirewallEngineService firewallEngineService;

    public FirewallEngineController(FirewallEngineService firewallEngineService) {
        this.firewallEngineService = firewallEngineService;
    }

    @PostMapping("/analyze")
    public Map<String, String> analyzeRequest(
            @RequestBody FirewallRequest request) {

        String result =
                firewallEngineService.analyzeRequest(
                        request.getRequestLine()
                );

        Map<String, String> response = new HashMap<>();

        response.put("requestLine", request.getRequestLine());
        response.put("result", result);

        return response;
    }
}