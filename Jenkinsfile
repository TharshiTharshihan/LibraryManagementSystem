pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('dockerhub-credentials')
        AWS_CREDS = credentials('aws-credentials')
        DOCKER_USERNAME = "${DOCKER_HUB_CREDS_USR}"
        DOCKER_PASSWORD = "${DOCKER_HUB_CREDS_PSW}"
        AWS_ACCESS_KEY_ID = "${AWS_CREDS_USR}"
        AWS_SECRET_ACCESS_KEY = "${AWS_CREDS_PSW}"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scmGit(
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[url: 'https://github.com/TharshiTharshihan/LibraryManagementSystem.git']]
                )
                echo 'Code checkout completed'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build --if-present'
                    echo 'Frontend build completed'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                    echo 'Backend build completed'
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Test Frontend') {
                    steps {
                        dir('frontend') {
                            bat 'npm test -- --passWithNoTests'
                            echo 'Frontend tests completed'
                        }
                    }
                }
                stage('Test Backend') {
                    steps {
                        dir('backend') {
                            bat 'npm test -- --passWithNoTests'
                            echo 'Backend tests completed'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker build -t %DOCKER_USERNAME%/library-frontend:latest ./frontend'
                bat 'docker build -t %DOCKER_USERNAME%/library-backend:latest ./backend'
                echo 'Docker images built successfully'
            }
        }

        stage('Push Docker Images') {
            steps {
                bat 'echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin'
                bat 'docker push %DOCKER_USERNAME%/library-frontend:latest'
                bat 'docker push %DOCKER_USERNAME%/library-backend:latest'
                echo 'Docker images pushed to Docker Hub'
            }
        }

        stage('Provision Infrastructure with Terraform') {
            steps {
                dir('infrastructure/terraform') {
                    powershell '''
                    $env:AWS_ACCESS_KEY_ID = $env:AWS_ACCESS_KEY_ID
                    $env:AWS_SECRET_ACCESS_KEY = $env:AWS_SECRET_ACCESS_KEY
                    terraform init
                    terraform apply -auto-approve
                    '''
                    echo "Infrastructure provisioned successfully"
                }
            }
        }

        stage('Configure Server with Ansible') {
            steps {
                dir('infrastructure/ansible') {
                    powershell '''
                    $env:ANSIBLE_HOST_KEY_CHECKING = "False"
                    ansible-playbook -i inventory.ini deploy.yml -e "docker_username=$env:DOCKER_USERNAME docker_password=$env:DOCKER_PASSWORD"
                    '''
                    echo 'Server configured successfully'
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'CI/CD pipeline failed!'
        }
        always {
            echo 'Cleaning up workspace...'
            // Not deleting workspace as per user's request
        }
    }
}
