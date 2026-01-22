.PHONY: setup dev build-api build-frontend seed deploy-all

APP_NAME=game-catalog
DB_SECRET_ARN=$(shell aws secretsmanager list-secrets --query "SecretList[?contains(Name, 'mydbAuroraSecret')].ARN" --output text | head -n 1)
IGDB_SECRET_PATH=/copilot/game-catalog/test/secrets/IGDB_CREDS
DB_WORKLOAD_SG=$(shell aws cloudformation list-exports --query "Exports[?Name=='$(APP_NAME)-test-mydbSecurityGroup'].Value" --output text)
# --- LOCAL DEVELOPMENT ---
dev:
	docker-compose up

# --- AWS DEPLOYMENT ---

# Deploy the backend and database infrastructure
deploy-api:
	copilot svc deploy --name api --env test

# Automatically fetch Backend URL and deploy Frontend
deploy-frontend:
	@command -v jq >/dev/null 2>&1 || { echo >&2 "❌ Error: 'jq' is not installed."; exit 1; }
	@echo "🔍 Fetching Backend URL..."
	# We use 'sed' to remove the trailing '/api' that Copilot includes
	$(eval RAW_URL=$(shell copilot svc show -n api --json | jq -r '.routes[0].url' | sed 's/\/api$$//'))
	@echo "🚀 Deploying Frontend with VITE_API_URL: $(RAW_URL)"
	# Inject the variable so the manifest can see it
	export VITE_API_URL=$(RAW_URL) && copilot svc deploy --name frontend --env test

# Run the seeding task on AWS
seed:
	@echo "🌱 Running seeder for $(APP_NAME)..."
	copilot task run \
	  --app $(APP_NAME) \
	  --env test \
	  -n db-seeder \
	  --dockerfile ./backend/Dockerfile \
	  --build-context ./backend \
	  --env-vars RUN_SEEDER=true \
	  --secrets DB_SECRET=$(DB_SECRET_ARN),IGDB_CREDS=$(IGDB_SECRET_PATH) \
	  --security-groups $(DB_WORKLOAD_SG) \
	  --follow

# Full Deployment Sequence
deploy-all: deploy-api deploy-frontend seed
	@echo "✅ Full deployment complete!"

# --- CLEANUP ---
clean-local:
	docker-compose down -v