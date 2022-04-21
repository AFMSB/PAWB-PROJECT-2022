import React from 'react';
import {Toast} from "./Toast";

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
                {
                    ws && <Toast toasts={messages}/>
                }
            </div>
        )
    }

    enterChat() {
        this.state.user_id = localStorage.getItem("uid").replaceAll('"', '');
        const { user_id } = this.state;

        let ws = new WebSocket(`ws://127.0.0.1:8081/socket/${user_id}`);

        ws.onopen = (evt) => {
            console.log('Websocket opened!', {evt});
        }

        ws.onclose = (evt) => {
            console.log('Websocket closed!', {evt});
            this.setState({ws: undefined});
        }

        ws.onmessage = (msg) => {
            msg = msg.data;
            console.log('Websocket message:', msg);
            this.setMessages(msg);
        }

        ws.onerror = (error) => {
            console.log('Websocket error:', {error});
        }

        this.setState({ws});
    }

    setMessage(value) {
        this.setState({message: value});
    }

    setMessages(value) {
        let messages = this.state.messages.concat(value);
        //messages = this.filterReceivedMessage(value)
        this.setState({messages});
    }
}