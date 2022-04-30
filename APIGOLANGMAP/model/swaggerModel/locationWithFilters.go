package swaggermodel

type UserLocationWithFilters struct {
	Start   string `json:"start" binding:"required" example:"2022-01-01"`
	End     string `json:"end" binding:"required" example:"2022-07-01"`
	UsersId []int  `json:"UserId" binding:"required"`
}
