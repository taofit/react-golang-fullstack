# 🚀 AWS Copilot Deployment Guide

This document provides a clean, step-by-step workflow for deploying the **Game Catalog** application (Go Backend, React Frontend, and Aurora PostgreSQL) to AWS.

---

## 📋 1. Prerequisites

Before starting, ensure you have the following configured:

- [x] **AWS CLI**: Configured via `aws configure`.
- [x] **AWS Copilot CLI**: [Installation Guide](https://aws.github.io/copilot-cli/docs/getting-started/install/).
- [x] **Docker Desktop**: Must be running for builds.
- [ ] **IAM Permissions**: Your AWS user/role needs permissions for CloudFormation, ECS, RDS, and Secrets Manager.

---

## 🛠 2. Initial Setup (One-Time)

### A. Initialize Application
This creates the logical application container in AWS.
```bash
copilot app init game-catalog
```

### B. Setup Database (Aurora Serverless)
Creates the storage resource accessible by your services.
```bash
# This creates a CloudFormation template in 'copilot/api/addons/'
copilot storage init \
  -n mydbAurora \
  -t Aurora \
  --engine PostgreSQL \
  --lifecycle environment \
  --workload api
```
> [!NOTE]
> If `mydb.yml` already exists in your `addons/` directory, you can skip this step.

### C. Setup External Secrets (IGDB)
Initialize your API keys securely in AWS SSM Parameter Store.
```bash
copilot secret init --name IGDB_CREDS
```
**Value format:** Enter a JSON string when prompted:
```json
{"IGDB_CLIENT_ID": "...", "IGDB_CLIENT_SECRET": "..."}
```

---

## 🚢 3. Service Configuration & Deployment

### Step 1: Initialize Services
Register your backend and frontend services.
```bash
# Register Backend
copilot svc init --name api --svc-type "Load Balanced Web Service" --dockerfile ./backend/Dockerfile

# Register Frontend
copilot svc init --name frontend --svc-type "Load Balanced Web Service" --dockerfile ./frontend/Dockerfile
```

### Step 2: Configure Secrets in Manifest
Ensure `copilot/api/manifest.yml` includes the following mapping so your code can access the DB and IGDB keys:

```yaml
secrets:
  # Pulls the Aurora Secret ARN from CloudFormation outputs
  DB_SECRET: 
    from_cfn: ${COPILOT_APPLICATION_NAME}-${COPILOT_ENVIRONMENT_NAME}-mydbAuroraSecret
  
  # Pulls the JSON bundle from SSM Parameter Store
  IGDB_CREDS: /copilot/${COPILOT_APPLICATION_NAME}/${COPILOT_ENVIRONMENT_NAME}/secrets/IGDB_CREDS
```

### Step 3: Deploy Everything
Create the network environment and push your code.
```bash
# 1. Initialize & Deploy the 'test' environment (VPC, Cluster, DB)
copilot env init --name test --profile default --app game-catalog
copilot env deploy --name test

# 2. Deploy Services
copilot svc deploy --name api --env test
copilot svc deploy --name frontend --env test --env-vars VITE_API_URL=$(make get-api-url)
```
> [!TIP]
> Use the `Makefile` to simplify fetching the dynamic API URL for the frontend build.

---

## 🌱 4. Database Seeding

The seeder runs as a **One-Off Task**. It is recommended to use the `Makefile` to handle the complex secret ARNs automatically.

```bash
# Recommended
make seed
```

<details>
<summary>View Manual Command (Alternative)</summary>

```bash
# 1. Get Secret ARN
DB_ARN=$(aws secretsmanager list-secrets --query "SecretList[?contains(Name, 'mydbAuroraSecret')].ARN" --output text | head -n 1)

# 2. Run Task
copilot task run \
  --app game-catalog --env test -n db-seeder \
  --dockerfile ./backend/Dockerfile --build-context ./backend \
  --env-vars RUN_SEEDER=true \
  --secrets DB_SECRET=$DB_ARN,IGDB_CREDS=/copilot/game-catalog/test/secrets/IGDB_CREDS \
  --follow
```
</details>

---

## 🔍 5. Operations & Monitoring

### Vital Commands
| Command | Result |
| :--- | :--- |
| `copilot svc show` | Get public URLs and service metadata. |
| `copilot svc status` | Check if containers are healthy/running. |
| `copilot svc logs` | Tail application logs (Real-time). |
| `copilot svc exec` | Interactive shell inside your container. |

### Accessing the Web UI
- **Frontend URL**: `copilot svc show --name frontend`
- **Quick Open**: `copilot svc show --name frontend --web`

---

## 🧹 6. Cleanup & Reset

### Clean Slate
If you need to delete everything and start over:
```bash
# Delete all AWS resources and local metadata
copilot app delete --yes
```

### Environment Only
If you want to keep your manifests but wipe the AWS "test" resources (VPC, DB, ECS):
```bash
copilot env delete --name test --yes
```

---

## 🔄 7. Restarting after `app delete`

If you have already deleted the app and want to re-deploy:

1. **Re-initialize**: `copilot app init game-catalog`
2. **Setup DB/Secrets**: (See Section 2 - Storage and Secret Init marks your local files as "remote-tracking")
3. **Re-deploy Env**: `copilot env init` (with `--default-config`) then `copilot env deploy`
4. **Final Sync**: `make deploy-all`