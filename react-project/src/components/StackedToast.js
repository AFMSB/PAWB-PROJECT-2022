import React from 'react';
import {Toast} from "./Toast";

const baseURL = 'ws://localhost:9090/ws';

export class StackedToasts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ws: undefined,
            username: '',
            message: '',
            messages: [],
        }
    }

    componentDidMount() {
        this.enterChat();
    }

    render() {
        const { ws, messages } = this.state;

        return (
            <div className="toast-container">
                {/*<Status status={ws ? 'connected' : 'disconnected'} />*/}
                {
                    ws && <Toast toasts={messages}/>
                }
            </div>
        )
    }

    enterChat() {
        this.state.username = localStorage.getItem("username").replaceAll('"', '');
        const { username } = this.state;

        let ws = new WebSocket(baseURL + `?username=${username}`);

        ws.onopen = (evt) => {
            console.log('Websocket opened!', {evt});
        }

        ws.onclose = (evt) => {
            console.log('Websocket closed!', {evt});
            this.setState({ws: undefined});
        }

        ws.onmessage = (msg) => {
            console.log('Websocket message:', {msg});
            this.setMessages(msg.data);
        }

        ws.onerror = (error) => {
            console.log('Websocket error:', {error});
        }

        this.setState({ws});
    }

    sendMessage() {
        const { ws, message } = this.state;

        ws.send(message);
        this.setMessage('');
    }

    setUsername(value) {
        this.setState({username: value});
    }

    setMessage(value) {
        this.setState({message: value});
    }

    setMessages(value) {
        let messages = this.state.messages.concat([JSON.parse(value)]);
        console.log("messages-1 ", messages)
        messages = this.filterReceivedMessage(value)
        console.log("messages-2 ", messages)
        this.setState({messages});
    }

    filterReceivedMessage(message){
        let username = this.state.username
        let parsedMsg = JSON.parse(message);
        let splitedMsg = parsedMsg.body.split("|*_*|");
        if (splitedMsg.length < 2){
            return this.state.messages.concat([JSON.parse(message)]);
        }
        let names = splitedMsg[0].split(",");
        var msg = splitedMsg[1];
        console.log(names[0], names[1], msg, username)

        if (this.existsInArray(names, username) !== undefined || this.existsInArray(names, 'All')){
            parsedMsg = {
                id: parsedMsg.id,
                body: msg,
                sender: parsedMsg.sender
            }
            return this.state.messages.concat([parsedMsg]);
        }else {
            return this.state.messages;
        }
    }

    existsInArray(names, username){
        const match = names.find(element => {
            if (element.toLowerCase().includes(username.toLowerCase())) {
                return true;
            }
        });
        return match
    }
}