package com.smarthome.backend.repository;

import com.smarthome.backend.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, Long> {
}