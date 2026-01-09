package config

import "os"

type ServiceURLs struct {
    AuthService     string
    UsersService    string
    OutcomesService string
    BoardsService   string
}

func GetServiceURLs() ServiceURLs {
    return ServiceURLs{
        AuthService:     getEnv("AUTH_SERVICE_URL", "pinnacle-auth-service:4460"),
        UsersService:    getEnv("USERS_SERVICE_URL", "pinnacle-users-service:4450"),
        OutcomesService: getEnv("OUTCOMES_SERVICE_URL", "pinnacle-outcomes-service:4440"),
    }
}

func getEnv(key, fallback string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return fallback
}