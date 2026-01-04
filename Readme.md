Pinnacle is Outcome Driven Project management software that focuses on doing the right things and prevents 
you to get to focus on low impact things. Prioritization is at heart the pinnacle. Workflow is very opinionated to keep yourself focused

## System Design 
[https://www.tldraw.com/p/Tz-EJdJEB6hq8Z-nOMSjH?d=v-130.0.2552.1324.page](https://www.tldraw.com/p/Tz-EJdJEB6hq8Z-nOMSjH?d=v-25.-664.8132.4219.page)

![System Design](/architecture/system-design-v2.png)


### Ideal Request Cycle after Development:
Client Request -> NextJs -> API Gateway (Go + Gin) -> NestJs microservices

### Current Tech Stack:
- **API**: - NestJs + NodeJs + TypeScript
- **Frontend**: NextJs / ReactJs + Typescript
- **DB**: Postgres, Redis

### Notes:
- NestJS runs on 4000
  - Boards Service
    - 4010
  - Lists Service
    - 4020
  - Issues Service
    - 4030
  - API Gateway:
    - 4050
  - Outcomes:
    - 4040
- NextJS runs on 3000


npx protoc \
  --ts_proto_out=. \
  --ts_proto_opt=nestJs=true \
  ./proto/outcomes.proto


npx prisma init --datasource-provider postgresql


### Steps for Adding new microservice - Self Guide:
- Create New NestJs app using command `nest generate app {object:plural}-service`
- create directory proto within the service directory
- create file named {object:plural}.proto
- Write the service definitions, check example apps/outcomes/proto/outcomes.proto
- Run `npx protoc \
  --ts_proto_out=. \
  --ts_proto_opt=nestJs=true \
  ./proto/{object:plural}.proto`
- Move Generate .ts files to /nestjs-services/libs/common/src/types
  - Update ./types/index.ts file to include the newly created definitions
- Come back to ./nestjs-services
- Run following command to generate resource: `nest generate res {object:plural}`
  - You may chose to create CRUD by responding yes, we are going to refactor the naming conventions later though to adhere to gRPC standards
  - Go to apps/{object:plural}-service/src/{object:plural}
    - Open Controller file
    - Add Controller methods decorator at start of controller example: "@outcomes.OutcomeServiceControllerMethods()"
    - Implement the interface eg: implements outcomes.OutcomeServiceController
    - Refactor the names to use RPC method name conventions:
      - Example:
        - ```service OutcomeService {
    rpc CreateOutcome(CreateOutcomeRequest) returns (Outcome);
    rpc GetOutcome(GetOutcomeRequest) returns (Outcome);
    rpc UpdateOutcome(UpdateOutcomeRequest) returns (Outcome);
    rpc DeleteOutcome(DeleteOutcomeRequest) returns (google.protobuf.Empty);
    rpc ListOutcomes(ListOutcomesRequest) returns (ListOutcomesResponse);
  }```
  - Go to apps/{object:plural}-service/src/{object:plural} again
  - Run `npx prisma init --datasource-provider postgresql` to setup prisma with postgres connection
  - Setup connection within `prisma.config.ts` file
  - Open .env file within micro-service directory and update DB connection variable
  - Copy `apps/monolith/src/prisma.service.ts` into current microservice respective path
  - COnfigure the custom .env file location in current service taking inspiration from `apps/monolith/src/monolith.module.ts`
  - Make sure the path is correct here
  - Design schema definitions within `prisma/schema.prisma`
  - RUN `prisma migrate dev` to generate models and syncing db
  - Run `prisma migrate reset` if faced with any db schema issue and then run migrate dev again
  - Run 'npx prisma generate` to generate definitions
  - Open tsconfig.lib.json in microservice root and add `"paths": {
      "@prisma/client": ["./generated/prisma"]
    }` in compiler options, check `apps/outcomes-service/tsconfig.app.json` for inspiration
  - Open service file from module created within service
  - Copy code from `apps/monolith/src/projects/projects.service.ts` for reference
  - Refactor the code to make it specific for current module prisma definitions
  - Open Controller of same module
  - Refactor the controller to use the service we just designed
    - Take inspiration from `apps/monolith/src/projects/projects.service.ts` if required
  - Go to main.ts file of service and refactor the code to serve it as GRPC service, 
  - Go to `backend/services/nestjs-services/nest-cli.json` and update `assets, entryFile, sourceRoot` variables of microservice project
  - move `backend/services/nestjs-services/apps/{object:plural}-service/proto` to `backend/services/nestjs-services/proto`
  - go to `backend/services/nestjs-services` and run `npm run start:dev outcomes-service`
    - Start fixing issues you encounter
    - 
  - ### Integrating Service in API Gateway
    - Copy the .proto file from `backend/services/nestjs-services/apps/{object:plural}-service/proto` into
      - into `backend/gateway/proto/*.proto`
    - Refactor the proto file to add REST endpoint definitions
    - Go inside container using `make shellgateway`
    - Run "buf generate"
    - make sure go package name is correct in proto files
    - go to cmd/api/main
      - Make changes to main file, taking inspiration from previous code
    - Test like this: curl http://localhost:4700/api/v1/outcomes  
