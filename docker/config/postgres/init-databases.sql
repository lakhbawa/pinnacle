-- Runs once, on first start of the shared production Postgres container.
-- Each service keeps its own database inside the single instance.
CREATE DATABASE auth;
CREATE DATABASE users;
CREATE DATABASE outcomes;
CREATE DATABASE notifications;

\c auth
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\c users
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\c outcomes
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\c notifications
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
