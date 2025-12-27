up:
	docker compose up -d --remove-orphans
shellgateway:
	docker compose exec pinnacle-gateway /bin/sh
protoc:
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. --ts_proto_opt=nestJs=true src/proto/outcomes.proto