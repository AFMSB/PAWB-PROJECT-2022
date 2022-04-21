package services

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/repository"
	"fmt"
	"github.com/go-co-op/gocron"
	"log"
	"time"
)

func StartService() {
	cron := gocron.NewScheduler(time.UTC)
	cron.Every(1).Minute().Do(securityConcurrent)
	cron.StartAsync()
}

func securityConcurrent() {
	var results = make(map[string]interface{})
	var positions, errGetAllPositions = repository.NewCrudPositions().GetAllPositions()
	var users, errGetAllUsers = repository.NewCrudPositions().GetAllUsers()
	var auxUsers = make(map[uint]model.User)
	if errGetAllPositions != nil || errGetAllUsers != nil {
		panic("Error service SecurityConcurrent ")
		return
	}
	for _, user := range users {
		auxUsers[user.ID] = user
	}

	defer positions.Close()
	for positions.Next() {
		err := Db.ScanRows(positions, &results)
		if err != nil {
			log.Println("Error Scanning Row")
			continue
		}
		notifyUser := results["user_id"].(int64)
		timeLastUpdate := results["max"].(time.Time)
		currentUser, exist := auxUsers[uint(notifyUser)]

		if !exist {
			log.Println("User reject from Alert ", notifyUser)
			continue
		}

		if currentUser.SOS && int(time.Now().Sub(timeLastUpdate).Hours()) >= currentUser.AlertTime {
			alertUser(uint(notifyUser))
		}
	}
}

func FetchAllFollowers(userID uint) []model.User {
	var users []model.User
	Db.Table("users").Select("users.id, users.username, followers.created_at, followers.updated_at").Joins("JOIN followers on followers.follower_user_id = users.id").Where("followers.user_id = ?  and users.access_mode != -1 and followers.deleted_at is null", userID).Find(&users)
	return users
}

func alertUser(user uint) {
	var u model.User
	Db.First(&u, user)

	followers := FetchAllFollowers(user)
	fmt.Println(followers)

	for _, follower := range followers {
		Sender(follower.ID, fmt.Sprintf("%s has not updated his location for more than %d hours, so he may be in danger", u.Username, u.AlertTime))
	}
}
