pipeline {
    agent any

    stages {
      

        stage('Checkout Code') {
            steps {
                bat 'git config --global --add safe.directory "D:/6th semester/DEvOps/Library_Book_Management"'
                bat '''
                if exist "D:\\6th semester\\DEvOps\\Library_Book_Management\\.git" (
                    cd /d "D:\\6th semester\\DEvOps\\Library_Book_Management"
                    git reset --hard
                    git pull origin main
                ) else (
                    git clone "https://github.com/TharshiTharshihan/LibraryManagementSystem.git" "D:\\6th semester\\DEvOps\\Library_Book_Management"
                )
                '''
            }
        }

        stage('Build and Deploy Containers') {
            steps {
                bat "cd /d D:\\6th semester\\DEvOps\\Library_Book_Management"
                bat "docker compose down"
                bat "docker compose build"
                bat "docker compose up -d --build"
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
