# Library Book Management System

A complete Library Book Management System with a MERN stack architecture (MongoDB, Express.js, React, Node.js) and a fully automated CI/CD pipeline.

## Project Structure

- **Frontend**: React application with modern UI
- **Backend**: Node.js API server with Express
- **Database**: MongoDB 
- **Infrastructure**: Terraform and Ansible configurations
- **CI/CD**: Jenkins pipeline with GitHub webhook integration

## Features

- Containerized application components using Docker
- Automated CI/CD pipeline with Jenkins
- Infrastructure as Code using Terraform
- Configuration Management with Ansible
- Deployment to AWS EC2

## Local Development Setup

### Prerequisites
- Node.js (v14+)
- Docker and Docker Compose
- MongoDB (if running without Docker)

### Running Locally
1. Clone the repository:
   ```
   git clone https://github.com/TharshiTharshihan/LibraryManagementSystem.git
   cd LibraryManagementSystem
   ```

2. Start all services using Docker Compose:
   ```
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

## CI/CD Pipeline

### Pipeline Workflow

1. **Code Checkout**: Pull code from GitHub repository
2. **Build**: Compile and build frontend and backend applications
3. **Test**: Run automated tests for frontend and backend
4. **Docker Image Creation**: Build Docker images for each component
5. **Docker Image Push**: Push images to Docker Hub
6. **Infrastructure Provisioning**: Create AWS EC2 instance using Terraform
7. **Configuration**: Configure server using Ansible
8. **Deployment**: Deploy the application on AWS

### Jenkins Setup

1. Install required Jenkins plugins:
   - Git Integration
   - Docker Pipeline
   - Credentials
   - Pipeline
   - PowerShell

2. Configure Jenkins Credentials:
   - Docker Hub credentials (ID: `dockerhub`)
   - AWS credentials (ID: `aws-credentials`)

3. Create a new Pipeline job in Jenkins:
   - Pipeline script from SCM
   - SCM: Git
   - Repository URL: https://github.com/TharshiTharshihan/LibraryManagementSystem.git
   - Script Path: Jenkinsfile

### GitHub Webhook Setup

Refer to the [GitHub Webhook Setup Guide](github-webhook-setup.md) for instructions on configuring the GitHub webhook to automatically trigger the CI/CD pipeline on code pushes.

## Deployment Architecture

### AWS Infrastructure
- **EC2 Instance**: t2.micro running Ubuntu 20.04 LTS
- **Security Groups**: Allowing ports 22 (SSH), 80 (HTTP), 3000 (Frontend), 5000 (Backend), 27017 (MongoDB)
- **Networking**: Public subnet with internet access

### Container Structure
- Frontend container (React)
- Backend container (Node.js)
- MongoDB container

### Data Persistence
- MongoDB data is stored in a Docker volume for persistence

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.
