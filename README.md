
# Social Media Platform (Microservices with Spring Boot)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1%2B-brightgreen)](https://spring.io/)
[![Docker](https://img.shields.io/badge/Docker-20.10%2B-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellowgreen)](LICENSE)

**Educational project** demonstrating a social media platform built with Spring Boot microservices. Currently in active development.

## 📌 Overview

A learning-focused implementation featuring:
- JWT-based authentication & TLS-secured internal communication
- Event-driven architecture with Kafka
- Containerized services using Docker
- CI/CD pipeline with Jenkins

![Architecture Diagram]([INSERT_YOUR_ARCHITECTURE_IMAGE_URL_HERE])

## 🛠️ Core Services

**Implemented:**
- **User Service**: Account management & profiles
- **Auth Service**: JWT token generation/validation
- **Post Service**: Content creation & management
- **Config Service**: Centralized configuration
- **Discovery Service**: Service registration
- **Gateway**: API routing & load balancing
- **Media Service**: File storage (MinIO)

**In Development:**
- Message Service (direct messaging)
- Notification Service (real-time alerts)

## 🔧 Tech Stack

**Infrastructure:**
- Docker Compose (local development)
- Kubernetes (production deployment - WIP)
- AWS EC2 (future hosting)

**Data Stores:**
- MySQL (relational data)
- MongoDB (NoSQL data)
- Redis (caching)
- MinIO (object storage)

**Communication:**
- HTTP/REST for external APIs
- Kafka for event streaming
- TLS for inter-service security

## 🚀 Getting Started

### Prerequisites
- Docker 20.10+ & Docker Compose
- (Optional) Minikube for Kubernetes testing

### Quick Start (Docker Compose)
```bash
# Start all services and dependencies
docker-compose up --build
```

### Kubernetes Deployment (Local)
```bash
cd k8s/
kubectl apply -f .
```

## 📚 API Documentation
Access OpenAPI specs at:
- `http://localhost:[GATEWAY_PORT]/swagger-ui.html` (after startup)

## 🔄 CI/CD Pipeline
- Jenkins automation for:
    - Container builds
    - Integration testing
    - Kubernetes deployment (WIP)

## 🚧 Development Status
```plaintext
✅ Completed Services: 7/9
🛠 In Progress: Message & Notification Services
🔜 Planned: Grafana monitoring, AWS deployment
```

## 🤝 Contributing
This educational project welcomes:
- Bug reports
- Architecture suggestions
- Documentation improvements

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit changes following existing code standards
4. Open a Pull Request with detailed description

## 📄 License
Distributed under MIT License - see [LICENSE](LICENSE) for details.

## 🔜 Roadmap
- [ ] Grafana dashboard integration
- [ ] AWS EC2 deployment guide
- [ ] End-to-end encryption for messages
- [ ] Load testing results


**Recommendations:**
1. Add your architecture diagram image link
2. Include port numbers in API documentation section
3. Add Jenkins pipeline status badge when ready
4. Create `k8s/` directory with manifest files
5. Add service-specific READMEs later as mentioned

This structure emphasizes the educational nature while showing technical depth. Let me know if you want to adjust any sections!