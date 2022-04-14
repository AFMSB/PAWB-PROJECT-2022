package services

import (
	"APIGOLANGMAP/model"
	"fmt"
	"github.com/jaswdr/faker"
	"golang.org/x/crypto/bcrypt"
	postgres "gorm.io/driver/postgres"
	"gorm.io/gorm"
	"io/ioutil"
	"log"
	"math"
	"math/rand"
	"strings"
	"time"
)

var username string
var password string
var dbHost string
var dbPort string
var dbName string

var Db *gorm.DB

func readProperties() {
	content, _ := ioutil.ReadFile("config/db.config")

	lines := strings.Split(string(content), "\n")

	if len(lines) >= 6 {
		username = lines[1]
		password = lines[2]
		dbHost = lines[3]
		dbPort = lines[4]
		dbName = lines[5]
	}

}

func OpenDatabase() {
	//open a db connection
	readProperties()
	var err error

	dsn := "host=" + dbHost + " user=" + username + " password=" + password + " dbname=" + dbName + " port=" + dbPort + " sslmode=disable TimeZone=Europe/Lisbon"
	Db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	sqlDB, _ := Db.DB()
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)
	if err != nil {
		panic("failed to connect database")
	}
}

func CloseDatabase() {
	psqlDB, err := Db.DB()
	psqlDB.Close()

	if err != nil {
		panic("failed to close database")
	}
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CreateAdmin() {
	var usr model.User
	if Db.Find(&usr, "username = ?", "admin"); usr.Username != "" {
		return
	}

	creds := model.User{
		Username:   "admin",
		Password:   "admin",
		AccessMode: model.AdminAccess,
	}

	hash, _ := HashPassword(creds.Password)

	creds.Password = hash
	result := Db.Save(&creds)
	if result.RowsAffected == 0 {
		panic("Admin could not be created")
	}
}

func CreateUsers() {
	UsersToGenerate := 10
	var users []model.User
	Db.Table("users").Find(&users)
	if len(users) <= UsersToGenerate {

		var userIDs []uint
		var usr model.User
		fakers := faker.New()
		for i := 0; i < UsersToGenerate; i++ {
			uname := fakers.Person().FirstName()
			if Db.Find(&usr, "username = ?", uname); usr.Username != "" {
				continue
			}
			accessMode := rand.Intn(model.UserAccess-model.AdminAccess) + model.AdminAccess
			if accessMode >= 0 {
				accessMode = model.UserAccess
			} else {
				accessMode = model.AdminAccess
			}
			creds := model.User{
				Username:   uname,
				Password:   "123",
				AccessMode: accessMode,
			}

			hash, _ := HashPassword(creds.Password)

			creds.Password = hash

			result := Db.Save(&creds)

			userIDs = append(userIDs, creds.ID)

			if result.RowsAffected == 0 {
				panic("User could not be created")
			}
		}
		AssocUserFollower(userIDs)
		AddPositionToUsers()
	}
}
func AssocUserFollower(userIDs []uint) {
	for i := 0; i < len(userIDs); i++ {
		var follower model.Follower
		if i == 0 {
			follower.UserID = userIDs[i]
			follower.FollowerUserID = 1 // Admin -> Always Created
		} else {
			follower.UserID = userIDs[i]
			follower.FollowerUserID = userIDs[i-1]
		}
		Db.Save(&follower)
	}
}

func AddPositionToUsers() {
	//var repo = repository.NewCrudPositions()
	var users []model.User
	Db.Where("access_mode != -1").Find(&users)
	PointsPerUser := 5
	if users != nil {
		for i := 0; i < len(users); i++ {
			for j := 0; j < PointsPerUser; j++ {
				lat := 41.1486 * math.Pi / 180
				lon := -8.611 * math.Pi / 180
				maxDistance := float64(200)
				minDistance := float64(10)
				earthRadius := float64(6371000)
				x := rand.Float64() + math.Pi
				distance := math.Sqrt(x*(math.Pow(maxDistance, 2)-math.Pow(minDistance, 2)) + math.Pow(minDistance, 2))

				deltaLat := math.Cos(x*math.Pi) * distance / earthRadius
				sign := rand.Float64()*2 - 1
				deltaLon := sign * math.Acos(
					((math.Cos(distance/earthRadius)-math.Cos(deltaLat))/
						(math.Cos(lat)*math.Cos(deltaLat+lat)))+1)

				var p model.Position
				p.UserID = users[i].ID
				p.Latitude = float32((lat + deltaLat) * 180 / math.Pi)
				p.Longitude = float32((lon + deltaLon) * 180 / math.Pi)
				fmt.Println(p)
				if errGeoLocation := Db.Exec("INSERT INTO positions (latitude, longitude, user_id, geolocation,created_at,updated_at) VALUES (?,?,?,ST_SetSRID(ST_Point(?,?),4326)::geography,current_timestamp,current_timestamp)",
					p.Latitude, p.Longitude, p.UserID, p.Latitude, p.Longitude).Error; errGeoLocation != nil {
					log.Println("ERROR Inserting Default Position")
				}
			}
		}
	}
}
