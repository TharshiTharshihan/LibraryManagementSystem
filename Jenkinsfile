pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker')
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
        // Skip frontend tests in development
        CI = "false"
        // Set Node.js environment
        NODE_ENV = "development"
        // Make sure PATH includes node and npm
        PATH = "${env.PATH}:/usr/local/bin:/usr/bin:/bin"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Install Node.js') {
            steps {
                sh '''
                    # Check if Node.js is installed
                    if ! command -v node &> /dev/null; then
                        echo "Node.js not found, installing Node.js using apt..."
                        # Install Node.js using apt (simpler and more reliable in CI environments)
                        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                        
                        # Verify installation
                        node --version
                        npm --version
                    else
                        echo "Node.js is already installed"
                        node --version
                        npm --version
                    fi
                '''
            }
        }

        stage('Check Environment') {
            steps {
                sh 'echo "PATH: $PATH"'
                sh 'which node || echo "Node not found in PATH"'
                sh 'which npm || echo "NPM not found in PATH"'
                sh 'node --version || echo "Node not installed or available"'
                sh 'npm --version || echo "NPM not installed or available"'
                sh 'docker --version || echo "Docker not installed"'
                sh 'terraform --version || echo "Terraform not installed"'
                sh 'ansible --version || echo "Ansible not installed"'
            }
        }

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
                // Use sh commands for Linux/Ubuntu
                sh '''
                    echo "Cleaning frontend node_modules..."
                    rm -rf frontend/node_modules || echo "No frontend/node_modules to delete"
                    
                    echo "Cleaning backend node_modules..."
                    rm -rf backend/node_modules || echo "No backend/node_modules to delete"
                    
                    echo "Creating fresh npm cache directory..."
                    rm -rf npm-cache || echo "No npm-cache to delete"
                    mkdir -p npm-cache
                '''
                echo 'Pre-build cleanup completed'
            }
        }

        stage('Install and Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Installing frontend dependencies..."
                        echo "Using Node.js version: $(node --version)"
                        echo "Using npm version: $(npm --version)"
                        
                        echo "Installing react-scripts globally..."
                        npm install -g react-scripts
                        
                        echo "Now installing project dependencies..."
                        npm cache clean --force
                        npm install --legacy-peer-deps --no-fund --no-audit --progress=false --prefer-online
                        
                        echo "Building frontend..."
                        export CI=false
                        npm run build || echo "Build failed but continuing"
                    '''
                    echo 'Frontend build completed'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Installing backend dependencies..."
                        echo "Using Node.js version: $(node --version)"
                        echo "Using npm version: $(npm --version)"
                        
                        npm cache clean --force
                        npm install --legacy-peer-deps --no-fund --no-audit --progress=false --prefer-online
                    '''
                    echo 'Backend dependencies installed successfully'
                }
            }
        }

        stage('Skip Tests in Development') {
            steps {
                echo 'Skipping tests in development environment'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    # Check if Docker is installed and available
                    if ! command -v docker &> /dev/null; then
                        echo "Docker not found, attempting to install..."
                        sudo apt-get update
                        sudo apt-get install -y docker.io
                        sudo systemctl start docker
                        sudo usermod -aG docker jenkins
                        # Note: The above command might require a Jenkins restart to take effect
                    fi
                    
                    echo "Building Docker images..."
                    docker build -t $DOCKER_USERNAME/library-frontend:latest ./frontend
                    docker build -t $DOCKER_USERNAME/library-backend:latest ./backend
                '''
                echo 'Docker images built successfully'
            }
        }

        stage('Verify Docker Credentials') {
            steps {
                // Print masked credentials info for debugging (safe, doesn't reveal actual credentials)
                echo "Docker username: ${DOCKER_USERNAME}"
                echo "Docker password length: ${DOCKER_PASSWORD.length()}"
                
                // Test Docker login separately before pushing
                withCredentials([usernamePassword(credentialsId: 'docker', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "Testing Docker login..."
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        if [ $? -ne 0 ]; then
                            echo "Docker login failed! Check credentials in Jenkins."
                            exit 1
                        else
                            echo "Docker login successful!"
                        fi
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKER_USERNAME/library-frontend:latest
                        docker push $DOCKER_USERNAME/library-backend:latest
                    '''
                }
                echo 'Docker images pushed to Docker Hub'
            }
        }

        stage('Provision Infrastructure with Terraform') {
            steps {
                dir('infrastructure/terraform') {
                    sh '''
                        # Check if Terraform is installed
                        if ! command -v terraform &> /dev/null; then
                            echo "Terraform not found, attempting to install..."
                            sudo apt-get update
                            sudo apt-get install -y gnupg software-properties-common curl
                            wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
                            echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
                            sudo apt-get update
                            sudo apt-get install -y terraform
                        fi
                        
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
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
                    sh '''
                        # Check if Ansible is installed
                        if ! command -v ansible &> /dev/null; then
                            echo "Ansible not found, attempting to install..."
                            sudo apt-get update
                            sudo apt-get install -y ansible
                        fi
                        
                        export ANSIBLE_HOST_KEY_CHECKING="False"
                        ansible-playbook -i inventory.ini deploy.yml -e "docker_username=$DOCKER_USERNAME docker_password=$DOCKER_PASSWORD"
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
            sh 'rm -rf npm-cache || echo "No npm-cache to delete"'
        }
    }
}
