up:
	docker compose up -d --remove-orphans
shellgateway:
	docker compose exec pinnacle-gateway /bin/sh
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