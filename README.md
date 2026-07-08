# ChronoCraft: Full-Stack Timeline Builder

ChronoCraft is a modern, full-stack web application designed to help users create, manage, and visualize elegant horizontal and vertical historical timelines. It features a React frontend, a FastAPI backend, and a MySQL database, completely automated with enterprise-grade DevOps infrastructure.

## Features
- **Interactive UI:** A glassmorphic/light-mode UI built with React and Vanilla CSS.
- **Dynamic Timelines:** Create events, upload images, and sort them chronologically automatically.
- **Secure Authentication:** JWT-based user authentication and protected REST APIs.
- **DevOps Ready:** Fully containerized with Docker, deployable via Kubernetes, and automated via Jenkins CI/CD.

## Tech Stack
- **Frontend:** React (Vite), Axios, Lucide Icons
- **Backend:** Python, FastAPI, SQLAlchemy, PyMySQL, JWT Authentication
- **Database:** MySQL 8.0
- **DevOps:** Docker, Docker Compose, Kubernetes (K3s), Jenkins, Ansible

---

## 🚀 Local Development Setup

To run the application locally on your machine, you can either use Docker Compose (Recommended) or run the servers manually.

### Option A: Using Docker Compose (Recommended)

1. Ensure you have Docker and Docker Compose installed.
2. From the root directory, run:
   ```bash
   docker compose up --build
   ```
3. The services will be available at:
   - **Frontend:** `http://localhost:5173`
   - **Backend API:** `http://localhost:8000`
   - **Database:** `localhost:3306`

### Option B: Running Manually

**1. Setup MySQL Database**
- Install MySQL and create a database named `timeline_builder`.
- Create a user and password.

**2. Setup Backend (FastAPI)**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create a .env file based on the template
cp .env.example .env
# Edit .env with your local database credentials

uvicorn main:app --reload --port 8000
```

**3. Setup Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠 DevOps & Production Deployment

This project includes a complete Infrastructure-as-Code (IaC) and CI/CD setup for deploying to an AWS EC2 instance.

### 1. Server Provisioning (Ansible)
We use Ansible to prepare a raw Ubuntu EC2 server.
1. Navigate to the `ansible/` directory.
2. Edit `inventory.ini` and replace `<YOUR-EC2-PUBLIC-IP>` with your actual server IP.
3. Run the playbook to install Docker, Kubernetes (K3s), and Jenkins:
   ```bash
   ansible-playbook -i inventory.ini playbook.yml
   ```

### 2. CI/CD Pipeline (Jenkins)
The included `Jenkinsfile` defines a pipeline that automatically builds and deploys your code.
1. Log into your newly installed Jenkins server.
2. Create a new Pipeline job and point it to your GitHub repository.
3. Add your Docker Hub credentials to Jenkins with the ID `dockerhub-credentials`.
4. The pipeline will:
   - Build the Docker images.
   - Push them to your Docker registry.
   - Update the Kubernetes manifests and apply them to the cluster.

### 3. Kubernetes Deployment (Manual Fallback)
If you wish to deploy to Kubernetes manually without Jenkins:
1. Ensure your `kubectl` is pointing to your cluster.
2. Edit `k8s/mysql.yaml` and `k8s/backend.yaml` to replace the placeholder `stringData` passwords with real base64-encoded Kubernetes Secrets.
3. Apply the manifests:
   ```bash
   kubectl apply -f k8s/
   ```

---

## 🔒 Security Notes
- **Never commit `.env` files** or real passwords to version control.
- In production, rely on Kubernetes Secrets to inject sensitive data into the pods.
- The `ansible/playbook.yml` requires SSH access to your target server via a `.pem` key. Do not commit this key.
