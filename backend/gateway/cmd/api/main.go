package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/encoding/protojson"

	boardspb "gateway/gen/go/boardsservice"
	outcomespb "gateway/gen/go/outcomesv1"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

type APIError struct {
	Message string              `json:"message"`
	Code    string              `json:"code,omitempty"`
	Errors  map[string][]string `json:"errors,omitempty"`
}

type Meta struct {
	Total       int    `json:"total,omitempty"`
	PerPage     int    `json:"per_page,omitempty"`
	CurrentPage int    `json:"current_page,omitempty"`
	TotalPages  int    `json:"total_pages,omitempty"`
	NextPage    string `json:"next_page,omitempty"`
}

type LaravelStyleMarshaler struct {
	jsonpb *runtime.JSONPb
}

func NewLaravelStyleMarshaler() *LaravelStyleMarshaler {
	return &LaravelStyleMarshaler{
		jsonpb: &runtime.JSONPb{
			MarshalOptions: protojson.MarshalOptions{
				EmitUnpopulated: true,
				UseProtoNames:   true,
			},
			UnmarshalOptions: protojson.UnmarshalOptions{
				DiscardUnknown: true,
			},
		},
	}
}

func (m *LaravelStyleMarshaler) ContentType(_ interface{}) string {
	return "application/json"
}

func (m *LaravelStyleMarshaler) Marshal(v interface{}) ([]byte, error) {
	protoBytes, err := m.jsonpb.Marshal(v)
	if err != nil {
		return nil, err
	}

	var protoData interface{}
	if err := json.Unmarshal(protoBytes, &protoData); err != nil {
		return nil, err
	}

	response := m.wrapResponse(protoData)
	return json.Marshal(response)
}

func (m *LaravelStyleMarshaler) wrapResponse(data interface{}) APIResponse {
	dataMap, ok := data.(map[string]interface{})
	if !ok {
		return APIResponse{Success: true, Data: data}
	}

	// Check if it's a list response (has "data" array)
	if listData, hasData := dataMap["data"]; hasData {
		if _, isArray := listData.([]interface{}); isArray {
			meta := m.extractMeta(dataMap)
			return APIResponse{Success: true, Data: listData, Meta: meta}
		}
	}

	// Single resource response
	return APIResponse{Success: true, Data: data}
}

func (m *LaravelStyleMarshaler) extractMeta(dataMap map[string]interface{}) *Meta {
	meta := &Meta{}
	hasMeta := false

	if total, ok := dataMap["total_count"].(float64); ok {
		meta.Total = int(total)
		hasMeta = true
	}

	if perPage, ok := dataMap["page_size"].(float64); ok {
		meta.PerPage = int(perPage)
		hasMeta = true
	}

	if currentPage, ok := dataMap["current_page"].(float64); ok {
		meta.CurrentPage = int(currentPage)
		hasMeta = true
	}

	if totalPages, ok := dataMap["total_pages"].(float64); ok {
		meta.TotalPages = int(totalPages)
		hasMeta = true
	}

	if nextPage, ok := dataMap["next_page_token"].(string); ok && nextPage != "" {
		meta.NextPage = nextPage
		hasMeta = true
	}

	if hasMeta {
		return meta
	}
	return nil
}

func (m *LaravelStyleMarshaler) Unmarshal(data []byte, v interface{}) error {
	return m.jsonpb.Unmarshal(data, v)
}

func (m *LaravelStyleMarshaler) NewDecoder(r io.Reader) runtime.Decoder {
	return m.jsonpb.NewDecoder(r)
}

func (m *LaravelStyleMarshaler) NewEncoder(w io.Writer) runtime.Encoder {
	return &laravelEncoder{w: w, marshaler: m}
}

type laravelEncoder struct {
	w         io.Writer
	marshaler *LaravelStyleMarshaler
}

func (e *laravelEncoder) Encode(v interface{}) error {
	data, err := e.marshaler.Marshal(v)
	if err != nil {
		return err
	}
	_, err = e.w.Write(data)
	return err
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
			var arrayErrors map[string][]string
			if json.Unmarshal([]byte(message), &arrayErrors) == nil {
				httpStatus = http.StatusUnprocessableEntity
				apiError.Message = "The given data was invalid."
				apiError.Code = "VALIDATION_ERROR"
				apiError.Errors = arrayErrors
			} else {
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
		runtime.WithMarshalerOption(runtime.MIMEWildcard, NewLaravelStyleMarshaler()),
	)

	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	err := outcomespb.RegisterOutcomeServiceHandlerFromEndpoint(
		ctx,
		grpcMux,
		"host.docker.internal:4440",
		opts,
	)
	if err != nil {
		log.Fatalf("Failed to register outcomes gateway: %v", err)
	}

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