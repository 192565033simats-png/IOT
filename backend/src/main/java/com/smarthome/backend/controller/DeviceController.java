package com.smarthome.backend.controller;

import com.smarthome.backend.model.Device;
import com.smarthome.backend.repository.DeviceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository repository;

    public DeviceController(DeviceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Device> getDevices() {
        return repository.findAll();
    }
}