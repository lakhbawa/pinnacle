package main

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "github.com/lakhbawa/pinnacle/backend/gateway/proto/boardsservice"
)

func main() {

	router := gin.Default()

	ctx := context.Background()

	grpcMux := runtime.NewServeMux()

	// connecting to our boardsservice grpc microservice
	opts := grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	err := pb.Register
}
