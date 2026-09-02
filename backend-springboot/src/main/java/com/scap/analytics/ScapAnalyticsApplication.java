package com.scap.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ScapAnalyticsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScapAnalyticsApplication.class, args);
        System.out.println("=================================================================");
        System.out.println("  SCAP Spring Boot 3 Enterprise Microservice Engine is ONLINE   ");
        System.out.println("  Cloud DB: Google Cloud Firestore & PostgreSQL (Dual Sync)      ");
        System.out.println("  Swagger UI: http://localhost:8080/swagger-ui.html             ");
        System.out.println("=================================================================");
    }
}
