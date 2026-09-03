# 🚔 SCAP — Smart Crime Analytics Portal

[![Java](https://img.shields.io/badge/Java-17-orange.svg?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Cloud Firestore](https://img.shields.io/badge/Database-Google%20Cloud%20Firestore-blue.svg?style=flat-square&logo=googlecloud)](https://cloud.google.com/firestore)
[![PostgreSQL](https://img.shields.io/badge/RDBMS-PostgreSQL-336791.svg?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

An enterprise-grade **Crime Analytics, Cyber Intelligence, and Forensic Evidence Management Platform** built with **Java Spring Boot 3**, **Google Cloud Firestore**, **PostgreSQL**, and a high-performance **Tactical React Dashboard**.

SCAP equips law enforcement, cybercrime investigators, and forensic units with cross-jurisdictional pattern correlation, SHA-256 evidence chain-of-custody verification, real-time IP/BGP radar tracking, and hardware GPS triangulation.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Cloud Database Setup](#-cloud-database-setup)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Spring Boot 3)](#1-backend-setup-spring-boot-3)
  - [Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [API Documentation (Swagger / OpenAPI)](#-api-documentation-swagger--openapi)
- [Security & Chain of Custody](#-security--chain-of-custody)
- [Docker Deployment](#-docker-deployment)
- [GitHub Language Statistics](#-github-language-statistics)
- [License](#-license)

---

## ⚡ Key Features

### 1. 📋 First Information Report (FIR) Management
- Full lifecycle case recording: `REGISTERED` → `INVESTIGATION` → `CHARGESHEET` → `CLOSED`.
- Direct hardware GPS autofill & GIS reverse-geocoding via OpenStreetMap Nominatim.
- Dual persistence: Real-time NoSQL streaming into Google Cloud Firestore alongside relational audit logging in PostgreSQL.

### 2. 🔐 Tamper-Evident Evidence Vault & Chain of Custody
- Cryptographic **SHA-256 hashing** for physical, ballistic, narcotic, and digital evidence.
- Real-time cryptographic integrity verifier against sample re-hashing to detect forensic tampering.
- Immutable custody chain tracking transfers across scenes, forensics labs, and judicial courts.

### 3. 🧠 Multi-Vector Crime Pattern & MO Recognition
- Correlation engine scanning FIR databases for spatial clustering, crime types, weapon commonalities, and time windows.
- Real-time confidence scoring and tactical dispatch recommendations.

### 4. 🛰️ Real-Time IP Geolocation & Hardware GPS Radar
- Dual-tier geolocation: Live hardware satellite fix (`navigator.geolocation`) with automatic fallback to assisted cellular/Wi-Fi positioning.
- BGP Autonomous System Number (ASN), ISP infrastructure categorization, datacenter/VPN/Tor node threat detection.
- Geodesic distance calculation and tactical perimeter checks using the **Haversine Formula**.

### 5. 🗂️ Suspect Dossier & Biometrics Registry
- Tracking persons of interest (POI), known aliases, risk levels (`CRITICAL`, `HIGH`, `MEDIUM`), and active bail statuses.
- Facial biometric hash and fingerprint cross-referencing with linked case files.

### 6. 📊 Interactive Crime Hotspot Heatmaps & Fast Log Analysis
- High-contrast tactical GIS maps displaying incident clusters and patrol routes.
- Cyber forensic log ingestion and brute-force intrusion detection.

---

## 🏛️ Architecture & Tech Stack

```
                                  ┌───────────────────────────────┐
                                  │      Tactical Web UI          │
                                  │   (React 18 + TS + Tailwind)  │
                                  └───────────────┬───────────────┘
                                                  │
                                   REST / JSON    │   WebSockets / HTTP
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │     Spring Boot 3 Backend     │
                                  │        (Java 17 / Maven)      │
                                  └───────┬───────────────┬───────┘
                                          │               │
                     ┌────────────────────┴───┐       ┌───┴───────────────────┐
                     ▼                        ▼       ▼                       ▼
            ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
            │  Google Cloud    │    │    PostgreSQL    │    │  IP & GIS APIs   │
            │    Firestore     │    │   (Cloud SQL)    │    │ (OpenStreetMap)  │
            └──────────────────┘    └──────────────────┘    └──────────────────┘
```

| Layer | Technology | Description |
|---|---|---|
| **Backend Core** | Java 17, Spring Boot 3.2.3 | Modular REST API and microservice backend |
| **Persistence (NoSQL)** | Google Cloud Firestore | Real-time synchronized cloud document database |
| **Persistence (SQL)** | PostgreSQL 15 + Hibernate JPA | Relational case indexing and audit trail |
| **Security & Web** | Spring Security 6, Stateless CORS | Enterprise role-based access control and sanitization |
| **API Docs** | SpringDoc OpenAPI 3, Swagger UI | Interactive endpoint explorer (`/swagger-ui.html`) |
| **Frontend Client** | React 18, TypeScript, Vite | Dark military-grade tactical UI |
| **UI Styling** | Tailwind CSS, Lucide Icons, Motion | Ergonomic layout with responsive spatial components |

---

## 📂 Project Structure

```
.
├── backend-springboot/              # Spring Boot 3 Java Backend Microservice
│   ├── pom.xml                      # Maven dependencies & build configuration
│   ├── Dockerfile                   # Multi-stage container build (Temurin JDK 17)
│   ├── README.md                    # Backend-specific operational guide
│   └── src/main/
│       ├── java/com/scap/analytics/
│       │   ├── ScapAnalyticsApplication.java  # Main entry point
│       │   ├── config/              # Firestore & Spring Security configs
│       │   ├── controller/          # REST Controllers (FIR, Evidence, Intel, Suspect)
│       │   ├── model/               # JPA & Firestore dual-mapped entities
│       │   ├── repository/          # Spring Data JPA repositories
│       │   ├── service/             # Business logic & AI pattern engine
│       │   └── util/                # Cryptographic SHA-256 & Haversine GPS utils
│       └── resources/
│           └── application.yml      # Cloud DB & application settings
├── src/                             # React TypeScript Frontend UI
│   ├── components/                  # Dashboard, FIRs, Evidence, Intel, GPS views
│   ├── types.ts                     # TypeScript domain models
│   └── main.tsx                     # Frontend entry point
├── .gitattributes                   # GitHub Linguist configuration (99%+ Java badge)
├── package.json                     # Frontend build manifest
└── README.md                        # Project documentation
```

---

## ☁️ Cloud Database Setup

This project uses **Google Cloud Firestore** as its primary cloud document database, with optional synchronized fallback to **PostgreSQL**.

### 1. Google Cloud Firestore
Set your Google Cloud project ID in `backend-springboot/src/main/resources/application.yml` or via environment variables:

```bash
export GCP_PROJECT_ID="your-gcp-project-id"
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

### 2. PostgreSQL (Optional / Relational Storage)
If using PostgreSQL or Google Cloud SQL:

```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/scap_db"
export SPRING_DATASOURCE_USERNAME="scap_admin"
export SPRING_DATASOURCE_PASSWORD="your_password"
```

---

## 🚀 Quick Start

### Prerequisites
- **Java**: OpenJDK 17 or higher
- **Maven**: 3.8+
- **Node.js**: 18+ & npm (for frontend dashboard)
- **Docker**: (Optional) for containerized deployment

---

### 1. Backend Setup (Spring Boot 3)

```bash
# Navigate to backend directory
cd backend-springboot

# Compile and package the application
mvn clean package -DskipTests

# Run the Spring Boot microservice
java -jar target/scap-backend-springboot-1.0.0-SNAPSHOT.jar
```

The Java service will start at **`http://localhost:8080`**.

---

### 2. Frontend Setup (React + Vite)

In a separate terminal window:

```bash
# Install dependencies
npm install

# Start the tactical client dashboard
npm run dev
```

The web dashboard will be available at **`http://localhost:3000`**.

---

## 📖 API Documentation (Swagger / OpenAPI)

Interactive Swagger 3 API documentation is automatically exposed when the Spring Boot backend is running:

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

### Primary REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/firs` | Retrieve all registered First Information Reports |
| `POST` | `/api/v1/firs` | Ingest new FIR with GPS coordinates & auto-sync to Cloud DB |
| `GET` | `/api/v1/firs/{id}` | Fetch individual case dossier by ID |
| `GET` | `/api/v1/evidence` | List all forensic evidence in the secure vault |
| `POST` | `/api/v1/evidence` | Ingest new evidence with cryptographic SHA-256 hash |
| `POST` | `/api/v1/evidence/{id}/verify-integrity` | Validate sample hash against original custody record |
| `GET` | `/api/v1/intel/patterns` | Run cross-jurisdictional AI pattern correlation |
| `GET` | `/api/v1/intel/trace-ip` | Geocode and score threats for an IP address |
| `GET` | `/api/v1/suspects` | Retrieve suspect dossiers and biometric indexes |
| `GET` | `/actuator/health` | Service health and cloud database connectivity probe |

---

## 🔒 Security & Chain of Custody

1. **Military-Grade SHA-256 Verification**: Every piece of registered evidence generates an immutable SHA-256 hash (`com.scap.analytics.util.Sha256Util`). The verification API cross-examines incoming evidence specimens against the original block index to prevent forensic tampering in transit.
2. **Stateless Security Architecture**: Powered by Spring Security 6 with permissive CORS policy suitable for multi-jurisdictional agency integrations and isolated microservice topologies.
3. **Sensor-Level Privacy**: Geolocation services support progressive precision downgrade if satellite locks are constrained, protecting sensitive operational sites.

---

## 🐳 Docker Deployment

To build and run the Spring Boot backend using Docker:

```bash
cd backend-springboot

# Build container image
docker build -t scap-backend:1.0 .

# Run container
docker run -p 8080:8080 \
  -e GCP_PROJECT_ID="your-gcp-project-id" \
  scap-backend:1.0
```

---

## 🏷️ GitHub Language Statistics

This repository includes a root `.gitattributes` file configured for **GitHub Linguist**. When published to GitHub, the repository language bar will prominently classify this codebase as **Java (99%+)**, treating the frontend assets as a compiled client interface:

```gitattributes
# .gitattributes
src/** linguist-vendored=true
*.ts linguist-vendored=true
*.tsx linguist-vendored=true
*.java linguist-detectable=true
backend-springboot/** linguist-detectable=true
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
