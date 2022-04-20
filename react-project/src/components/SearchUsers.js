import React, {Component} from "react";

import {search, truncStr} from "../services/utils";


class SearchUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: "empty",
            loading: false,
            value: "",
            userFollowers: []
        }
    };

    async componentDidMount() {
        await this.fetchUserFollowers()
    }

    async fetchUserFollowers() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        const response = await fetch("http://localhost:3000/api/v1/follower", requestOptions);
        const data = await response.json();
        this.setState({
            userFollowers: data.data
        })
    }

    formatDate(date) {
        return date.split("T")[0];
    }

    async deassocFollowerHandler(e) {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
        const followerId = e.target.id;
        if (followerId) {
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({"FollowerUserID": parseInt(followerId)})
            };
            const response = await fetch("http://localhost:3000/api/v1/follower" + "/deassoc", requestOptions);
            const data = await response.json();
            if (data.status === 200) {
                await this.fetchUserFollowers()
            }
        } else {
            console.error("Invalid table line format");
        }
    };

    async search(val) {
        this.setState({loading: true});
        let results
        if (val.length > 0) {
            results = await search(
                `http://localhost:3000/api/v1/user/search?username=${val}`
            );
        } else {
            results = "empty"
        }

        const users = results;

        this.setState({users, loading: false});
    };

    async onChangeHandler(e) {
        this.search(e.target.value);
        this.setState({value: e.target.value});
    };


    async userLiClickHandler(e) {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
        const followerId = e.target.id;
        if (followerId) {
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({"FollowerUserID": parseInt(followerId)})
            };
            const response = await fetch("http://localhost:3000/api/v1/follower/assoc", requestOptions);
            const data = await response.json();
            if (data.status === 201) {
                await this.fetchUserFollowers()
            }
        } else {
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


            <div className="card-body">
                <div className="d-flex justify-content-end">
                    <div>
                        <div className="d-flex">
                            <input type="text" className="widgets-input" value={this.state.value}
                                   onChange={e => this.onChangeHandler(e)} placeholder="Search User to Add."/>
                        </div>
                        {this.renderUsers}
                    </div>
                </div>

                <div className="d-flex flex-column align-items-center text-center">
                    <h4 className="mt-3 mt-sm-0">Followers</h4>
                    <div className="assoc-user-list-div">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Username</th>
                                <th scope="col">Associated At</th>
                                <th scope="col">Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.userFollowers.map(follower =>
                                <tr key={follower.id}>
                                    <td>{follower.id}</td>
                                    <td>{truncStr(follower.username, 19)}</td>
                                    <td>{this.formatDate(follower.created_at)}</td>
                                    <td>
                                        <svg id={follower.id} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             className="bi bi-trash" viewBox="0 0 16 16"
                                             onClick={e => this.deassocFollowerHandler(e)}>
                                            <path
                                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path
                                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        );
    }
}

export default SearchUsers;
