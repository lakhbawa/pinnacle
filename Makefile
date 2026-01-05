up:
	docker compose up -d --remove-orphans
shellgateway:
	docker compose exec pinnacle-gateway /bin/sh
protoc:
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. --ts_proto_opt=nestJs=true src/proto/outcomes.proto

start-outcome:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev outcomes-service

start-user:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev users-service

start-auth:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev auth-service

start-monolith:
	docker compose up -d --remove-orphans
	cd backend/services/nestjs-services && \
	npm run start:dev monolith



start-gateway:
	docker compose up -d --remove-orphans
start-frontend:
	cd frontend && \
	npm run dev