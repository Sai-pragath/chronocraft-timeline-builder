pipeline {
    agent any

    environment {
        // NOTE: These should be configured as Jenkins Credentials, not hardcoded!
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_USER = 'saipragath' // Replace this
        
        BACKEND_IMAGE = "${DOCKER_USER}/chronocraft-backend"
        FRONTEND_IMAGE = "${DOCKER_USER}/chronocraft-frontend"
        IMAGE_TAG = "${env.BUILD_ID}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${BACKEND_IMAGE}:${IMAGE_TAG}")
                        docker.build("${BACKEND_IMAGE}:latest")
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${FRONTEND_IMAGE}:${IMAGE_TAG}")
                        docker.build("${FRONTEND_IMAGE}:latest")
                    }
                }
            }
        }

        stage('Push Images to Registry') {
            steps {
                script {
                    // For Docker Hub, the registry URL must be empty so Jenkins uses the default index.docker.io
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        docker.image("${BACKEND_IMAGE}:${IMAGE_TAG}").push()
                        docker.image("${BACKEND_IMAGE}:latest").push()
                        
                        docker.image("${FRONTEND_IMAGE}:${IMAGE_TAG}").push()
                        docker.image("${FRONTEND_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Ensure kubectl is configured on the Jenkins worker or use a Jenkins K8s plugin
                script {
                    // Update image tags dynamically in the K8s manifests before applying
                    sh """
                        sed -i 's|image: chronocraft-backend:latest|image: ${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}|g' k8s/backend.yaml
                        sed -i 's|image: chronocraft-frontend:latest|image: ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}|g' k8s/frontend.yaml
                        kubectl apply -f k8s/
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment Pipeline Completed Successfully!'
        }
        failure {
            echo 'Deployment Pipeline Failed!'
        }
    }
}
