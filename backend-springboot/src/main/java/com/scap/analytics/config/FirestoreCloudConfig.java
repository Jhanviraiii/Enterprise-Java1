package com.scap.analytics.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class FirestoreCloudConfig {

    @Value("${spring.cloud.gcp.project-id:ai-studio-smartcrimeanalyt-89518bcc-d268-4cfd-bf0b-dd373d0c1316}")
    private String projectId;

    @Value("${spring.cloud.gcp.firestore.database-id:(default)}")
    private String databaseId;

    @Bean
    public Firestore firestore() throws IOException {
        FirestoreOptions.Builder builder = FirestoreOptions.newBuilder()
                .setProjectId(projectId);

        if (!"(default)".equals(databaseId) && !databaseId.isEmpty()) {
            builder.setDatabaseId(databaseId);
        }

        try {
            builder.setCredentials(GoogleCredentials.getApplicationDefault());
        } catch (Exception e) {
            // Default credential fallback for container environment
            System.out.println("Using environment GCP default credentials for Firestore.");
        }

        return builder.build().getService();
    }
}
