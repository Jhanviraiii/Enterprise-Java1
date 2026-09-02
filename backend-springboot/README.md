# SCAP Spring Boot Backend Microservice

This module is an enterprise-grade **Spring Boot 3** microservice built for the **Smart Crime Analytics Portal (SCAP)** with native Cloud Database integration (Google Cloud Firestore and PostgreSQL/Cloud SQL).

---

## 🏛️ Architecture Highlights

- **Framework**: Spring Boot 3.2.3 (Java 17)
- **Cloud Database (NoSQL)**: Google Cloud Firestore (`google-cloud-firestore`)
- **Cloud Relational DB (SQL)**: Spring Data JPA + PostgreSQL (HikariCP Connection Pool)
- **API Documentation**: OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
- **Monitoring & Observability**: Spring Boot Actuator (`/actuator/health`)

---

## 🚀 Getting Started

### 1. Prerequisites
- **JDK 17** or higher
- **Maven 3.8+**
- GCP Service Account Key (for Cloud Firestore) or Google Application Default Credentials

### 2. Build & Run

```bash
cd backend-springboot

# Package the runnable jar
mvn clean package -DskipTests

# Run the Spring Boot application
java -jar target/scap-backend-springboot-1.0.0-SNAPSHOT.jar
```

The service will start on port `8080`.

### 3. API Endpoints

- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`
- **FIR Management**: `http://localhost:8080/api/v1/firs`
- **Health Probe**: `http://localhost:8080/api/v1/firs/health`
- **Actuator Health**: `http://localhost:8080/actuator/health`
