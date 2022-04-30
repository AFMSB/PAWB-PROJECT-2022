package swaggermodel

type UserLocationHistoryUser struct {
	Start  string `json:"start" binding:"required" example:"2022-01-01"`
	End    string `json:"end" binding:"required" example:"2022-07-01"`
	UserID int    `json:"userID" binding:"required"`
}
