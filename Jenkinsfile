pipeline {
    agent any
    
    tools {
        // Use the NodeJS-22 tool you configured in Manage Jenkins > Tools
        nodejs 'NodeJS-22'
    }
    
    stages {
        // Stage 1: Checkout
        // Pulls the latest code from GitHub onto the Jenkins agent.
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checked out successfully'
            }
        }

        // Stage 2: Install Dependencies
        // npm ci is used instead of npm install in pipelines.
        // It is faster and installs exactly what is in package-lock.json
        // which makes builds more reliable and consistent.
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                echo 'Dependencies installed'
            }
        }

        // Stage 3: Lint
        // Runs ESLint to check your code style.
        // If any linting rules are broken this stage fails
        // and the pipeline stops -- nothing gets deployed.
        stage('Lint') {
            steps {
                sh 'npm run lint'
                echo 'Linting passed'
            }
        }

        // Stage 4: Security Scan
        // Runs npm audit to check dependencies for known vulnerabilities.
        // The --audit-level=high flag means the stage only fails
        // if a HIGH or CRITICAL vulnerability is found.
        // Low and moderate issues produce a warning but do not stop the pipeline.
        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high'
                echo 'Security scan passed'
            }
        }

        // Stage 5: Test
        // Runs the full Jest test suite.
        // If any single test fails this stage fails
        // and the broken code is never deployed.
        stage('Test') {
            steps {
                sh 'npm test'
                echo 'All tests passed'
            }
        }

        // Stage 6: Build
        // Prepares the app for production.
        // In this project it confirms the app is ready.
        // In larger projects this would compile or bundle your code.
        stage('Build') {
            steps {
                sh 'npm run build'
                echo 'Build complete'
            }
        }

        // Stage 7: Deploy
        // This stage only runs if ALL previous stages passed.
        // It copies the new code to the app directory,
        // reinstalls production dependencies,
        // and restarts the service to load the new code.
        stage('Deploy') {
            steps {
                sh '''
                    cp -r . /var/www/todoapp/
                    cd /var/www/todoapp
                    npm ci --omit=dev
                    sudo systemctl restart todoapp
                    sudo systemctl status todoapp --no-pager
                '''
                echo 'Deployment complete'
            }
        }
    }

    // Post section -- runs after the pipeline finishes
    // regardless of whether it passed or failed.
    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo 'All stages passed -- app deployed successfully'
        }
        failure {
            echo 'Pipeline failed -- check the stage logs above for details'
        }
    }
}
