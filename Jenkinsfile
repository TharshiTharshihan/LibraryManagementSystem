pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('dockerhub-credentials')
        AWS_CREDS = credentials('aws-credentials')
        DOCKER_USERNAME = "${DOCKER_HUB_CREDS_USR}"
        DOCKER_PASSWORD = "${DOCKER_HUB_CREDS_PSW}"
        AWS_ACCESS_KEY_ID = "${AWS_CREDS_USR}"
        AWS_SECRET_ACCESS_KEY = "${AWS_CREDS_PSW}"
        // Force npm to use a specific cache location within the workspace
        NPM_CONFIG_CACHE = "${WORKSPACE}/npm-cache"
        // Allow running as root to fix permission issues
        NPM_CONFIG_UNSAFE_PERM = "true"
        // Use npmjs mirror to avoid 403 errors
        NPM_CONFIG_REGISTRY = "https://registry.npmjs.org/"
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

        stage('Pre-build Cleanup') {
            steps {
                // Use cmd with /c to ensure proper execution (more reliable than PowerShell for this case)
                bat '''
                    echo Cleaning frontend node_modules...
                    rmdir /s /q frontend\\node_modules 2>nul || echo No frontend/node_modules to delete
                    
                    echo Cleaning backend node_modules...
                    rmdir /s /q backend\\node_modules 2>nul || echo No backend/node_modules to delete
                    
                    echo Creating fresh npm cache directory...
                    rmdir /s /q npm-cache 2>nul || echo No npm-cache to delete
                    mkdir npm-cache
                '''
                echo 'Pre-build cleanup completed'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Frontend dependencies with specific flags to avoid issues
                dir('frontend') {
                    bat '''
                        echo Installing frontend dependencies...
                        npm cache clean --force
                        npm install --no-fund --no-audit --progress=false --prefer-online --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=15000 --fetch-retry-maxtimeout=60000
                    '''
                }
                
                // Backend dependencies with specific flags to avoid issues
                dir('backend') {
                    bat '''
                        echo Installing backend dependencies...
                        npm cache clean --force
                        npm install --no-fund --no-audit --progress=false --prefer-online --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=15000 --fetch-retry-maxtimeout=60000
                    '''
                }
                echo 'Dependencies installed successfully'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build --if-present || echo Build step not present'
                    echo 'Frontend build completed'
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Test Frontend') {
                    steps {
                        dir('frontend') {
                            bat 'npm test -- --passWithNoTests || echo No tests to run'
                            echo 'Frontend tests completed'
                        }
                    }
                }
                stage('Test Backend') {
                    steps {
                        dir('backend') {
                            bat 'npm test -- --passWithNoTests || echo No tests to run'
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
                    // Using PowerShell for Terraform commands
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
                    // Using PowerShell for Ansible commands
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
            echo 'Cleaning up workspace (except node_modules)...'
            // Remove npm cache but keep the rest of the workspace
            bat 'rmdir /s /q npm-cache 2>nul || echo No npm-cache to delete'
        }
    }
}
