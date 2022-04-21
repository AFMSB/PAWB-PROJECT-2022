package websocket

import (
	"APIGOLANGMAP/utils"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

type Chat struct {
	Users    map[string]*UserChat
	Messages chan *Message
	Join     chan *UserChat
	Leave    chan *UserChat
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  512,
	WriteBufferSize: 512,
	CheckOrigin: func(r *http.Request) bool {
		log.Printf("%s %s%s %v\n", r.Method, r.Host, r.RequestURI, r.Proto)
		return r.Method == http.MethodGet
	},
}

var ChatSingleton Chat

func (c *Chat) Handler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalln("Error on websocketComponents connection:", err.Error())
	}

	keys := r.URL.Query()
	username := keys.Get("username")
	if strings.TrimSpace(username) == "" {
		username = fmt.Sprintf("anon-%d", utils.GetRandomI64())
	}

	user := &UserChat{
		Username: username,
		Conn:     conn,
		Global:   c,
	}

	c.Join <- user

	user.Read()
}

func (c *Chat) Run() {
	for {
		select {
		case user := <-c.Join:
			c.add(user)
		case message := <-c.Messages:
			c.broadcast(message)
		case user := <-c.Leave:
			c.disconnect(user)
		}
	}
}

func (c *Chat) add(user *UserChat) {
	if _, ok := c.Users[user.Username]; !ok {
		c.Users[user.Username] = user

		body := fmt.Sprintf("%s|*_*|Joined the Chat", user.Username)
		fmt.Println("body connected ->", body)
		//c.broadcast(NewMessage(body, "Server"))
	}
}

func (c *Chat) broadcast(message *Message) {
	log.Printf("Broadcast message: %v\n", message)
	for _, user := range c.Users {
		user.Write(message)
	}
}

func (c *Chat) disconnect(user *UserChat) {
	if _, ok := c.Users[user.Username]; ok {
		defer user.Conn.Close()
		delete(c.Users, user.Username)

		body := fmt.Sprintf("%s|*_*|Left the Chat", user.Username)
		fmt.Println("body disconnect ->", body)
		//c.broadcast(NewMessage(body, "Server"))
	}
}

func Start(port string) {

	log.Printf("Chat listening on http://localhost%s\n", port)

	chatSingleton := &Chat{
		Users:    make(map[string]*UserChat),
		Messages: make(chan *Message),
		Join:     make(chan *UserChat),
		Leave:    make(chan *UserChat),
	}

	http.HandleFunc("/ws", chatSingleton.Handler)

	go chatSingleton.Run()

	log.Fatal(http.ListenAndServe(port, nil))
}
