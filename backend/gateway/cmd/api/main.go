package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "gateway/gen/go"
)

func main() {
	router := gin.Default()

	ctx := context.Background()
	grpcMux := runtime.NewServeMux()

	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	err := pb.RegisterBoardsServiceHandlerFromEndpoint(
		ctx,
		grpcMux,
		"host.docker.internal:4011",
		opts,
	)
	if err != nil {
		log.Fatalf("Failed to register gateway: %v", err)
	}

	router.Any("/api/v1/boards/*any", gin.WrapH(grpcMux))
	router.Any("/api/v1/boards", gin.WrapH(grpcMux))

	log.Println("API Gateway running on :8080")
	router.Run(":8080")
}
