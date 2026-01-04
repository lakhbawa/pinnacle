package main

import (
	"context"
	"encoding/json"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
	"io"
	"log"
	"net/http"
	"strings"

	boardspb "gateway/gen/go/boardsservice"
	outcomespb "gateway/gen/go/outcomesv1"
)

type WrappedMarshaler struct {
	runtime.Marshaler
}

func (m *WrappedMarshaler) Marshal(v interface{}) ([]byte, error) {
	// Wrap in success response
	wrapped := APIResponse{
		Success: true,
		Data:    v,
	}
	return json.Marshal(wrapped)
}

func (m *WrappedMarshaler) NewEncoder(w io.Writer) runtime.Encoder {
	return &wrappedEncoder{w: w}
}

type wrappedEncoder struct {
	w io.Writer
}

func (e *wrappedEncoder) Encode(v interface{}) error {
	wrapped := APIResponse{
		Success: true,
		Data:    v,
	}
	return json.NewEncoder(e.w).Encode(wrapped)
}

func customMarshaler(ctx context.Context, w http.ResponseWriter, resp proto.Message) error {
	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    resp,
	})
}

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
}

type APIError struct {
	Message string              `json:"message"`
	Code    string              `json:"code,omitempty"`
	Errors  map[string][]string `json:"errors,omitempty"` // Arrays like Laravel
}

func customHTTPError(
	ctx context.Context,
	mux *runtime.ServeMux,
	marshaler runtime.Marshaler,
	w http.ResponseWriter,
	r *http.Request,
	err error,
) {
	st, ok := status.FromError(err)

	httpStatus := http.StatusInternalServerError
	apiError := &APIError{
		Message: "Internal server error",
		Code:    "INTERNAL_ERROR",
	}

	if ok {
		httpStatus = runtime.HTTPStatusFromCode(st.Code())
		message := st.Message()

		if strings.HasPrefix(message, "{") {
			// Try parsing as array format first (new Laravel-style)
			var arrayErrors map[string][]string
			if json.Unmarshal([]byte(message), &arrayErrors) == nil {
				httpStatus = http.StatusUnprocessableEntity
				apiError.Message = "The given data was invalid."
				apiError.Code = "VALIDATION_ERROR"
				apiError.Errors = arrayErrors
			} else {
				// Fallback: parse as single-string format and convert
				var stringErrors map[string]string
				if json.Unmarshal([]byte(message), &stringErrors) == nil {
					httpStatus = http.StatusUnprocessableEntity
					apiError.Message = "The given data was invalid."
					apiError.Code = "VALIDATION_ERROR"
					apiError.Errors = convertToArrayFormat(stringErrors)
				}
			}
		} else if strings.Contains(message, "google.protobuf.Timestamp") {
			httpStatus = http.StatusUnprocessableEntity
			apiError.Message = "The given data was invalid."
			apiError.Code = "VALIDATION_ERROR"
			apiError.Errors = map[string][]string{
				"deadline": {"The deadline must be a valid ISO-8601 date format."},
			}
		} else {
			apiError.Message = message
			apiError.Code = st.Code().String()
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)
	json.NewEncoder(w).Encode(APIResponse{
		Success: false,
		Error:   apiError,
	})
}
func convertToArrayFormat(errors map[string]string) map[string][]string {
	result := make(map[string][]string)
	for field, msg := range errors {
		result[field] = []string{msg}
	}
	return result
}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://127.0.0.1:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	ctx := context.Background()
	grpcMux := runtime.NewServeMux(
		runtime.WithErrorHandler(customHTTPError),
		runtime.WithMarshalerOption(runtime.MIMEWildcard, &WrappedMarshaler{
			Marshaler: &runtime.JSONPb{
				MarshalOptions: protojson.MarshalOptions{
					EmitUnpopulated: true,
					UseProtoNames:   false, // Use camelCase
				},
			},
		}),
	)

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
