up:
	docker compose up -d --remove-orphans
shellgateway:
	docker compose exec pinnacle-gateway /bin/sh
shellserviceoutcomes:
	docker compose exec pinnacle-outcomes-service  sh -c "cd /app/apps/outcomes-service && sh"
shellservicenotifications:
	docker compose exec pinnacle-notifications-service  sh -c "cd /app/apps/notifications-service && sh"
shellserviceusers:
	docker compose exec pinnacle-users-service  sh -c "cd /app/apps/users-service && sh"
shellserviceauth:
	docker compose exec pinnacle-auth-service  sh -c "cd /app/apps/auth-service && sh"
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

# Production truncate commands (use docker compose exec instead of docker exec)
truncate-outcomes-db-prod:
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

truncate-users-db-prod:
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

truncate-auth-db-prod:
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

truncate-notifications-db-prod:
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

truncate-all-db-prod: truncate-auth-db-prod truncate-users-db-prod truncate-outcomes-db-prod truncate-notifications-db-prod
	@echo "🎉 All databases truncated successfully!"

# Production seed commands (run inside containers)
seed-auth-db-prod:
	docker compose exec pinnacle-auth-service npm run seed:auth
	@echo "✅ Auth database seeded"

seed-users-db-prod:
	docker compose exec pinnacle-users-service npm run seed:users
	@echo "✅ Users database seeded"

seed-outcomes-db-prod:
	docker compose exec pinnacle-outcomes-service npm run seed:outcomes
	@echo "✅ Outcomes database seeded"

seed-notifications-db-prod:
	docker compose exec pinnacle-notifications-service npm run seed:notifications
	@echo "✅ Notifications database seeded"

seed-all-db-prod: seed-auth-db-prod seed-users-db-prod seed-outcomes-db-prod seed-notifications-db-prod
	@echo "🎉 All databases seeded successfully!"

# Production reset and seed
reset-and-seed-all-prod: truncate-all-db-prod seed-all-db-prod
	@echo "🎉 All databases reset and seeded in production!"