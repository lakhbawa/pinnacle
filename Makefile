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

truncate-outcomes-db:
	docker exec -it pinnacle-outcomes-service-db psql -U postgres -d outcomes -c "\
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
	docker exec -it pinnacle-users-service-db psql -U postgres -d users -c "\
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
	docker exec -it pinnacle-auth-service-db psql -U postgres -d auth -c "\
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
	docker exec -it pinnacle-notifications-service-db psql -U postgres -d notifications -c "\
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
	@echo "All databases truncated successfully!"

# Seed commands
seed-auth-db:
	cd backend/services/nestjs-services && npm run db:seed:auth


seed-outcomes-db:
	cd backend/services/nestjs-services && npm run db:seed:outcomes


seed-all-db: seed-auth-db seed-outcomes-db

reset-and-seed-all: truncate-all-db seed-all-db