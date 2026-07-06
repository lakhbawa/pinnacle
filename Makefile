up:
	docker compose up -d --remove-orphans
shellgateway:
	docker compose exec pinnacle-gateway /bin/sh
shellserviceoutcomes:
	docker compose exec pinnacle-outcomes-service sh

shellservicenotifications:
	docker compose exec pinnacle-notifications-service sh

shellserviceusers:
	docker compose exec pinnacle-users-service sh

shellserviceauth:
	docker compose exec pinnacle-auth-service sh

protoc:
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. --ts_proto_opt=nestJs=true src/proto/outcomes.proto

start-outcomes:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev outcomes-service

start-users:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev users-service

start-auth:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev auth-service

start-notifications:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev notifications-service

start-monolith:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev monolith

start-gateway:
	docker compose up -d --remove-orphans
start-frontend:
	cd frontend && \
	npm run dev

start-observer:
	docker compose -f docker-compose-observability.yml up -d --remove-orphans

COMPOSE_PROJECT := $(shell basename $(CURDIR))

truncate-outcomes-db:
	docker compose exec pinnacle-outcomes-service-db psql -U postgres -d outcomes -c "\
		DO \$$\$$ \
		DECLARE \
			r RECORD; \
		BEGIN \
			FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP \
				EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; \
			END LOOP; \
		END \$$\$$;"
	@echo "✅ All tables in outcomes database truncated"

truncate-users-db:
	docker compose exec pinnacle-users-service-db psql -U postgres -d users -c "\
		DO \$$\$$ \
		DECLARE \
			r RECORD; \
		BEGIN \
			FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP \
				EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; \
			END LOOP; \
		END \$$\$$;"
	@echo "✅ All tables in users database truncated"

truncate-auth-db:
	docker compose exec pinnacle-auth-service-db psql -U postgres -d auth -c "\
		DO \$$\$$ \
		DECLARE \
			r RECORD; \
		BEGIN \
			FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP \
				EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; \
			END LOOP; \
		END \$$\$$;"
	@echo "✅ All tables in auth database truncated"

truncate-notifications-db:
	docker compose exec pinnacle-notifications-service-db psql -U postgres -d notifications -c "\
		DO \$$\$$ \
		DECLARE \
			r RECORD; \
		BEGIN \
			FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP \
				EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; \
			END LOOP; \
		END \$$\$$;"
	@echo "✅ All tables in notifications database truncated"

truncate-all-db: truncate-auth-db truncate-users-db truncate-outcomes-db truncate-notifications-db
	@echo "🎉 All databases truncated successfully!"

# ==========================================================================
# Prisma migrations
# Each service owns its own schema + DB, so migrations run INSIDE that
# service's container (its .env supplies the correct DATABASE_URL, and the
# DB hostname only resolves on the docker network). Requires `make up` first.
# ==========================================================================

# Apply committed migrations (use in CI / staging / production)
migrate-auth:
	docker compose exec pinnacle-auth-service npm run prisma:migrate:deploy:auth
	@echo "✅ Auth migrations applied"

migrate-users:
	docker compose exec pinnacle-users-service npm run prisma:migrate:deploy:users
	@echo "✅ Users migrations applied"

migrate-outcomes:
	docker compose exec pinnacle-outcomes-service npm run prisma:migrate:deploy:outcomes
	@echo "✅ Outcomes migrations applied"

migrate-notifications:
	docker compose exec pinnacle-notifications-service npm run prisma:migrate:deploy:notifications
	@echo "✅ Notifications migrations applied"

migrate-all: migrate-auth migrate-users migrate-outcomes migrate-notifications
	@echo "🎉 All migrations applied successfully!"

# Show migration status for every service
migrate-status:
	docker compose exec pinnacle-auth-service npm run prisma:migrate:status:auth
	docker compose exec pinnacle-users-service npm run prisma:migrate:status:users
	docker compose exec pinnacle-outcomes-service npm run prisma:migrate:status:outcomes
	docker compose exec pinnacle-notifications-service npm run prisma:migrate:status:notifications

# Create + apply a new migration during development.
# Usage: make migrate-dev-outcomes NAME=add_some_field
migrate-dev-auth:
	docker compose exec pinnacle-auth-service npm run prisma:migrate:dev:auth -- --name $(NAME)
migrate-dev-users:
	docker compose exec pinnacle-users-service npm run prisma:migrate:dev:users -- --name $(NAME)
migrate-dev-outcomes:
	docker compose exec pinnacle-outcomes-service npm run prisma:migrate:dev:outcomes -- --name $(NAME)
migrate-dev-notifications:
	docker compose exec pinnacle-notifications-service npm run prisma:migrate:dev:notifications -- --name $(NAME)

seed-auth-db:
	docker compose exec pinnacle-auth-service npm run db:seed:auth
	@echo "✅ Auth database seeded"


seed-outcomes-db:
	docker compose exec pinnacle-outcomes-service npm run db:seed:outcomes
	@echo "✅ Outcomes database seeded"


seed-all-db: seed-auth-db seed-outcomes-db
	@echo "🎉 All databases seeded successfully!"

# Production reset and seed
reset-and-seed-all: truncate-all-db seed-all-db
	@echo "All databases reset and seeded in production!"