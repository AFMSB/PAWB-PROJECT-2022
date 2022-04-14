import React, { Component } from "react";

import { search, truncStr } from "../services/utils";

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

    get renderUsers() {
        let movies = <li className="sugestion-searchbar">Didnt find any users with that username</li>;

        if (this.state.users === "empty") {
            movies = '';
        } else if (this.state.users) {
            movies = <li className="sugestion-searchbar">Loading...</li>;
            movies = this.state.users.map((m, i) =>
                <li key={m.ID} data-user-id={m.ID} className="sugestion-searchbar">
                    {truncStr(m.username, 22)}
                </li>
            );
        }

        return (
            <ul className="sugestions-searchbar">
                {movies}
            </ul>
        );
    }

    render() {
        return (
            <div>
                <div className="d-flex">
                    <input type="text" className="widgets-input" value={this.state.value} onChange={e => this.onChangeHandler(e)} placeholder="Type something to search"/>
                        <div id="search-icon"
                             className="submit-search-btn align-items-center justify-content-center d-flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                 className="bi bi-search" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                            </svg>
                        </div>
                </div>
                {this.renderUsers}
            </div>
        );
    }
}

export default SearchUsers;
