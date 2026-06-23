package com.smarthome.backend.dto;

public class FirewallRequest {

    private String requestLine;

    public FirewallRequest() {
    }

    public String getRequestLine() {
        return requestLine;
    }

    public void setRequestLine(String requestLine) {
        this.requestLine = requestLine;
    }
}