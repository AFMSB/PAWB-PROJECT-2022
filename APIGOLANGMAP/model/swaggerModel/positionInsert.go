package swaggermodel

// center of portugal
type PositionAddSwagger struct {
	Latitude  float32 `json:"Latitude" binding:"required" example:"39.557191"`
	Longitude float32 `json:"Longitude" binding:"required" example:"-7.8536599"`
}
