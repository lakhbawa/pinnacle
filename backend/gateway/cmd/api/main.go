package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

    outcomespb "gateway/gen/go/outcomesv1"
	boardspb "gateway/gen/go/boardsservice"
)

func main() {
	router := gin.Default()
	ctx := context.Background()
	grpcMux := runtime.NewServeMux()

	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	// Register Outcomes Service
	err := outcomespb.RegisterOutcomeServiceHandlerFromEndpoint(
		ctx,
		grpcMux,
		"host.docker.internal:4440",
		opts,
	)
	if err != nil {
		log.Fatalf("Failed to register outcomes gateway: %v", err)
	}

	// Register Boards Service
	err = boardspb.RegisterBoardsServiceHandlerFromEndpoint(
		ctx,
		grpcMux,
		"host.docker.internal:4012",
		opts,
	)
	if err != nil {
		log.Fatalf("Failed to register boards gateway: %v", err)
	}

	router.Any("/api/*any", gin.WrapH(grpcMux))

	log.Println("API Gateway running on :8080")
	router.Run(":8080")
}