#!/bin/bash

# ============================================
# update-env.sh
# Updates DATABASE_URL in all microservice .env files
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values (override with flags or prompts)
DB_USER="${DB_USER:-postgres}"
DB_PASS="${DB_PASS:-postgres}"

# Service configurations: name|port|database
SERVICES=(
    "auth-service|4462|auth"
    "users-service|4452|users"
    "outcomes-service|4442|outcomes"
)

# Base path to microservices (adjust if needed)
BASE_PATH="./backend/services/nestjs-services/apps"

# ============================================
# Functions
# ============================================

print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -u, --user      Database username (default: postgres)"
    echo "  -p, --password  Database password (default: postgres)"
    echo "  -h, --host      Database host (default: localhost for dev, service name for docker)"
    echo "  -e, --env       Environment: dev|docker|prod (default: dev)"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -u myuser -p mypass -e dev"
    echo "  $0 --env docker"
    echo "  DB_USER=admin DB_PASS=secret $0"
}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================
# Parse Arguments
# ============================================

ENV_TYPE="dev"
DB_HOST=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--user)
            DB_USER="$2"
            shift 2
            ;;
        -p|--password)
            DB_PASS="$2"
            shift 2
            ;;
        -h|--host)
            DB_HOST="$2"
            shift 2
            ;;
        -e|--env)
            ENV_TYPE="$2"
            shift 2
            ;;
        --help)
            print_usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            print_usage
            exit 1
            ;;
    esac
done

# ============================================
# Main Logic
# ============================================

log_info "Updating .env files for environment: $ENV_TYPE"
log_info "Database user: $DB_USER"

# Track updated files
updated_count=0
skipped_count=0

for service_config in "${SERVICES[@]}"; do
    # Parse service config
    IFS='|' read -r service_name port db_name <<< "$service_config"

    # Determine host based on environment
    case $ENV_TYPE in
        dev)
            host="${DB_HOST:-localhost}"
            ;;
        docker)
            # Use docker service names
            host="${DB_HOST:-pinnacle-${service_name}-db}"
            port="5432"  # Internal docker port
            ;;
        prod)
            host="${DB_HOST:-pinnacle-${service_name}-db}"
            port="5432"
            ;;
        *)
            log_error "Unknown environment: $ENV_TYPE"
            exit 1
            ;;
    esac

    # Build DATABASE_URL
    DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${host}:${port}/${db_name}"

    # Path to .env file
    ENV_FILE="${BASE_PATH}/${service_name}/.env"

    # Check if directory exists
    if [[ ! -d "${BASE_PATH}/${service_name}" ]]; then
        log_warn "Directory not found: ${BASE_PATH}/${service_name}, skipping..."
        ((skipped_count++))
        continue
    fi

    # Create or update .env file
    if [[ -f "$ENV_FILE" ]]; then
        # File exists - update or append DATABASE_URL
        if grep -q "^DATABASE_URL=" "$ENV_FILE"; then
            # Update existing line
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" "$ENV_FILE"
            else
                # Linux
                sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" "$ENV_FILE"
            fi
            log_info "Updated: $ENV_FILE"
        else
            # Append new line
            echo "DATABASE_URL=\"${DATABASE_URL}\"" >> "$ENV_FILE"
            log_info "Appended DATABASE_URL to: $ENV_FILE"
        fi
    else
        # Create new .env file
        echo "DATABASE_URL=\"${DATABASE_URL}\"" > "$ENV_FILE"
        log_info "Created: $ENV_FILE"
    fi

    ((updated_count++))
done

# ============================================
# Summary
# ============================================

echo ""
log_info "=========================================="
log_info "Summary:"
log_info "  Updated: $updated_count services"
log_info "  Skipped: $skipped_count services"
log_info "=========================================="

# Optionally show the generated URLs
echo ""
log_info "Generated DATABASE_URLs:"
for service_config in "${SERVICES[@]}"; do
    IFS='|' read -r service_name port db_name <<< "$service_config"

    case $ENV_TYPE in
        dev)
            host="${DB_HOST:-localhost}"
            ;;
        docker|prod)
            host="${DB_HOST:-pinnacle-${service_name}-db}"
            port="5432"
            ;;
    esac

    echo "  ${service_name}: postgresql://${DB_USER}:****@${host}:${port}/${db_name}"
done