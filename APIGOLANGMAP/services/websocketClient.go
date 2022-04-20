package services

import (
	"APIGOLANGMAP/model"
	"fmt"
	"github.com/rgamba/evtwebsocket"
	"log"
	"os"
)

var conn evtwebsocket.Conn

func InitConnection() {
	conn = evtwebsocket.Conn{
		// Fires when the connection is established
		OnConnected: func(w *evtwebsocket.Conn) {
			fmt.Println("Connected!")
		},
		// Fires when a new message arrives from the server
		OnMessage: func(msg []byte, w *evtwebsocket.Conn) {
			fmt.Printf("New message: %s\n", msg)
		},
		// Fires when an error occurs and connection is closed
		OnError: func(err error) {
			fmt.Printf("Error: %s\n", err.Error())
			os.Exit(1)
		},
		//// Ping interval in secs (optional)
		//PingIntervalSecs: 5,
		//// Ping message to send (optional)
		//PingMsg: []byte("PING"),
	}

	err := conn.Dial("ws://127.0.0.1:9090/ws?username=Server", "")
	if err != nil {
		log.Fatal(err)
	}
}

func SendMessage(users []model.User, message string) {
	var usersStr string
	for i, user := range users {
		if i != 0 {
			usersStr += ","
		}
		usersStr += user.Username
	}

	msg := evtwebsocket.Msg{
		Body: []byte(usersStr + "|*_*|" + message),
	}
	conn.Send(msg)
}
