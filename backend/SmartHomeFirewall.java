import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Core Java Engine acting as the Reverse Proxy and Rule Evaluator.
 * It listens for incoming traffic aimed at IoT devices, evaluates the payload
 * against the rules, and decides whether to forward, block, or send to the sandbox.
 */
public class SmartHomeFirewall {
    
    private static final int PROXY_PORT = 8080;
    // In a full implementation, this would be loaded from device_profiles.json using Jackson/Gson
    private static Map<String, Integer> ovenThresholds = new HashMap<>();

    public static void main(String[] args) {
        System.out.println("[System] Starting IoT Smart Home Firewall Gateway...");
        
        // Load configurations (Mocked for this example)
        ovenThresholds.put("max_temp", 450);
        
        ExecutorService executor = Executors.newFixedThreadPool(10);
        
        try (ServerSocket serverSocket = new ServerSocket(PROXY_PORT)) {
            System.out.println("[System] Firewall listening on port " + PROXY_PORT);
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                executor.submit(() -> handleRequest(clientSocket));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleRequest(Socket clientSocket) {
        try (
            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)
        ) {
            String requestLine = in.readLine();
            if (requestLine == null) return;
            
            System.out.println("\n[Traffic Detected] " + requestLine);
            
            // Extract the target device (Mock logic)
            String targetDevice = "smart_oven_01"; // Simulated parsed target
            
            // 1. API-Level Payload Inspection (Innovation 1)
            if (requestLine.contains("/api/setTemp")) {
                // Simulate reading a JSON payload: {"temp": 500}
                int requestedTemp = 500; 
                System.out.println("[Inspection] Command to set temp to " + requestedTemp);
                
                if (requestedTemp > ovenThresholds.get("max_temp")) {
                    System.out.println("[ALERT] Firewall Blocked Action: Temperature exceeds safe threshold of 450!");
                    out.println("HTTP/1.1 403 Forbidden\r\n\r\n{\"error\":\"Blocked by IoT Firewall: Threshold exceeded\"}");
                    return;
                }
            }

            // 2. 2FA Adaptive Trigger (Innovation 2)
            if (requestLine.contains("/api/unlockDoor")) {
                boolean isFromTrustedNetwork = false; // Simulate external internet request
                if (!isFromTrustedNetwork) {
                    System.out.println("[2FA Triggered] High-risk external command detected. Holding packet.");
                    System.out.println("[System] Sending push notification to homeowner...");
                    // Logic to hold thread until user approves via app would go here
                    out.println("HTTP/1.1 401 Unauthorized\r\n\r\n{\"status\":\"pending_2fa\"}");
                    return;
                }
            }

            // 3. Deception Sandbox Redirect (Innovation 4)
            boolean isMaliciousSignature = requestLine.contains("admin' OR 1=1"); // Simple SQLi check
            if (isMaliciousSignature) {
                System.out.println("[Sandbox Triggered] Malicious signature detected. Redirecting to Python Sandbox.");
                triggerPythonSandbox("192.168.1.100"); // Redirect hacker IP to python script
                out.println("HTTP/1.1 200 OK\r\n\r\n"); // Send fake OK from Java while python handles the rest
                return;
            }

            // If all checks pass, forward to actual IoT device (Proxy Logic)
            System.out.println("[Allowed] Traffic passed security checks. Forwarding to IoT device.");
            out.println("HTTP/1.1 200 OK\r\n\r\n{\"status\":\"success\"}");

        } catch (IOException e) {
            System.err.println("Connection error: " + e.getMessage());
        }
    }

    /**
     * Integrates with Python by executing the Python sandbox script.
     */
    private static void triggerPythonSandbox(String attackerIp) {
        try {
            // Call the Python script to spin up the realistic fake device
            ProcessBuilder pb = new ProcessBuilder("python3", "IoTSandbox.py", "--target", attackerIp);
            pb.inheritIO();
            pb.start();
        } catch (IOException e) {
            System.err.println("Failed to start Python Sandbox: " + e.getMessage());
        }
    }
}