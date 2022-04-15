import React, { Component } from "react";

import { search, truncStr } from "../services/utils";
import axios from "axios";
import fetchUserFollowers from "./FollowersList"
import {win} from "leaflet/src/core/Browser";

const API_URL = "http://localhost:3000/api/v1/follower";

class SearchUsers extends Component {
    state = {
        users: "empty",
        loading: false,
        value: ""
    };

    search = async val => {
        this.setState({ loading: true });
        let results
        if (val.length > 0){
            results = await search(
                `http://localhost:3000/api/v1/user/search?username=${val}`
            );
        }else {
            results = "empty"
        }

        const users = results;

        this.setState({ users, loading: false });
    };

    onChangeHandler = async e => {
        this.search(e.target.value);
        this.setState({ value: e.target.value });
    };

    userLiClickHandler = async e => {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"','')}`}
        const followerId = e.target.id;
        if (followerId){
            axios.post(API_URL+"/assoc", {
                "FollowerUserID": parseInt(followerId),
            }, {
                headers: headers
            }).catch(error => {
                console.log(error);
            })
            window.location.reload();
        }else{
            console.error("Invalid table line format");
        }
    };

    get renderUsers() {
        let users = <li className="sugestion-searchbar">Didnt find any users with that username</li>;

        if (this.state.users === "empty") {
            users = '';
        } else if (this.state.users) {
            users = <li className="sugestion-searchbar">Loading...</li>;
            users = this.state.users.map((m, i) =>
                <li key={m.ID} id={m.ID} className="sugestion-searchbar" onClick={e => this.userLiClickHandler(e)}>
                    {truncStr(m.username, 22)}
                </li>
            );
        }

        return (
            <ul className="sugestions-searchbar">
                {users}
            </ul>
        );
    }

    render() {
        return (
            <div>
                <div className="d-flex">
                    <input type="text" className="widgets-input" value={this.state.value} onChange={e => this.onChangeHandler(e)} placeholder="Type something to search"/>
                </div>
                {this.renderUsers}
            </div>
        );
    }
}

export default SearchUsers;
