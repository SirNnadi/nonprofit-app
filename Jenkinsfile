pipeline {
    agent any

    environment {
        AWS_REGION      = 'us-east-1'
        ECR_REGISTRY    = credentials('ecr-registry')
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') {
                            sh 'docker build -t nonprofit-backend .'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'docker build -t nonprofit-frontend .'
                        }
                    }
                }
            }
        }

        stage('Push to ECR') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-credentials') {
                    sh '''
                        aws ecr get-login-password --region $AWS_REGION | \
                            docker login --username AWS --password-stdin $ECR_REGISTRY

                        docker tag nonprofit-backend  $ECR_REGISTRY/nonprofit-backend:$IMAGE_TAG
                        docker tag nonprofit-frontend $ECR_REGISTRY/nonprofit-frontend:$IMAGE_TAG

                        docker push $ECR_REGISTRY/nonprofit-backend:$IMAGE_TAG
                        docker push $ECR_REGISTRY/nonprofit-frontend:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d --remove-orphans'
            }
        }
    }

    post {
        always {
            node {
                sh '''
                    docker rmi nonprofit-backend  || true
                    docker rmi nonprofit-frontend || true
                '''
            }
        }
    }
}
