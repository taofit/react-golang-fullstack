# 🚀 AWS Copilot Deployment Guide

This document outlines the end-to-end process for deploying the Game Catalog application (Backend, Frontend, and Aurora Database) to AWS using the Copilot CLI.

## 📋 Prerequisites

- **AWS CLI** configured with `aws configure`.
- **AWS Copilot CLI** installed.
- **Docker Desktop** running.

---

## 🛠 1. Project Initialization

First, verify that your project is initialized as an application.

```bash
# Initialize the application
copilot app init game-catalog
```

---

## 🗄 2. Infrastructure Setup

### A. Database (Aurora Serverless)
Create the database storage which will be accessible by your services.(if mydb.yml is already in the copilot/api/addons/ directory, you can skip this step)

```bash
# Create the database storage
copilot storage init \                                                                                
  -n mydbAurora \
  -t Aurora \
  --engine PostgreSQL \
  --lifecycle environment \
  --workload api
```
*   **Result:** Creates a CloudFormation template in `copilot/api/addons/`.
*   **Secret:** AWS automatically creates a secret in Secrets Manager containing the DB connection details.

### B. Secret Management (IGDB Credentials)
Store your IGDB API keys securely using SSM Parameter Store.

```bash
# Initialize the IGDB secret bundle
copilot secret init --name IGDB_CREDS
```
**Prompt:** When asked for the value, enter a JSON string with your credentials:
```json
{"IGDB_CLIENT_ID": "your_client_id", "IGDB_CLIENT_SECRET": "your_client_secret"}
```

---

## 🚢 3. Service Deployment

### A. Initialize the API Service
Define the Backend service type and Dockerfile location.

```bash
copilot svc init --name api --svc-type "Load Balanced Web Service" --dockerfile ./backend/Dockerfile
```

**Configuration Check:** Ensure `copilot/api/manifest.yml` includes the following secrets configuration:

```yaml
secrets:
  # Pulls the DB ARN from the CloudFormation Output
  DB_SECRET: 
    from_cfn: ${COPILOT_APPLICATION_NAME}-${COPILOT_ENVIRONMENT_NAME}-mydbAuroraSecret
  
  # Pulls the JSON bundle from SSM
  IGDB_CREDS: /copilot/${COPILOT_APPLICATION_NAME}/${COPILOT_ENVIRONMENT_NAME}/secrets/IGDB_CREDS
```

### B. Deploy the Environment & Services
Create the environment (VPC, Cluster) and deploy the services.

```bash
# 1. Create the 'test' environment
copilot env init --name test --profile default --app game-catalog


# 2. Deploy the environment resources (Database, Network)
copilot env deploy --name test

# 3. Deploy the API service
copilot svc deploy --name api --env test

# 4. Register the Frontend
copilot svc init --name frontend --svc-type "Load Balanced Web Service" --dockerfile ./frontend/Dockerfile
```

---

## 🌱 4. Database Seeding

The database seeder is designed to run as a **One-Off Task** to avoid running indefinitely. We use a `Makefile` to simplify fetching the dynamic AWS secrets required for this task.

### Run the Seeder via Makefile (Recommended)

```bash
make seed
```

### Manual Command (Under the hood)
If you need to run it manually without the Makefile:

```bash
# 1. Get the DB Secret ARN
DB_ARN=$(aws secretsmanager list-secrets --query "SecretList[?contains(Name, 'mydbAuroraSecret')].ARN" --output text | head -n 1)

# 2. Run the task
copilot task run \
  --app game-catalog \
  --env test \
  -n db-seeder \
  --dockerfile ./backend/Dockerfile \
  --build-context ./backend \
  --env-vars RUN_SEEDER=true \
  --secrets DB_SECRET=$DB_ARN,IGDB_CREDS=/copilot/game-catalog/test/secrets/IGDB_CREDS \
  --follow
```

---

## 🔍 5. Operational Monitoring

Once deployed, use these commands to verify everything is healthy.

| Command | Purpose |
| :--- | :--- |
| `copilot svc status` | Check if your API is "Running" or "Failing". |
| `copilot svc logs` | View the Go application logs (check for DB connection success). |
| `copilot svc show` | Get the public URL of your API. |

---

## 🏁 Summary Checklist

- [ ] **Code**: Ensure Go code can parse `IGDB_CREDS` as JSON.
- [ ] **Storage**: Run `copilot storage init` (Creates the DB).
- [ ] **Secrets**: Run `copilot secret init` (Creates IGDB keys).
- [ ] **Manifest**: Map `DB_SECRET` and `IGDB_CREDS` in `manifest.yml`.
- [ ] **Deploy**: Run `copilot svc deploy`.
- [ ] **Seed**: Run `make seed`.

# Restart process after running `copilot app delete`
##  1. Initialize the Application
This re-registers the game-catalog name in your AWS account.

```Bash
copilot app init game-catalog
```
## 2. Deploy the Environment (The Heavy Lifter)
This step builds the network (VPC), the ECS Cluster, and importantly, it detects your copilot/environments/addons/mydb.yml file and builds the Aurora database.

```Bash
copilot env init --name test --profile default --default-config

copilot env deploy --name test

Wait Time: This will take about 10–12 minutes because of the RDS cluster creation.
```
## 3. Re-register Services (Mapping Metadata)
Since `copilot app delete` wiped the remote metadata, you must tell AWS that your local services exist. These commands will detect your existing manifests and skip creating new ones.

```Bash
copilot svc init --name api --svc-type "Load Balanced Web Service" --dockerfile ./backend/Dockerfile

copilot svc init --name frontend --svc-type "Load Balanced Web Service" --dockerfile ./frontend/Dockerfile
```
## 4. Setup Secrets
Re-add your external credentials into AWS Secrets Manager.

```Bash
copilot secret init --name IGDB_CREDS
```
## 5. Final Deployment & Seeding
Now that the "handshake" between your local files and AWS is complete, use your Makefile to push the code and populate the database.

```Bash
make deploy-all
```
## 6. to check URLs for project

- user facing website:
```Bash

copilot svc show --name frontend

Look for the Routes section in the output. It will look something like: http://game-Publi-XXXXXXXXX.us-east-1.elb.amazonaws.com
```
- backend service
```Bash
copilot svc show --name api
```
- Open it directly in your Browser
```Bash
copilot svc show --name frontend --web
```