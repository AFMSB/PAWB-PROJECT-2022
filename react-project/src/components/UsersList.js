import React, {useState, useEffect} from 'react';
import axios from "axios";
import {truncStr} from "../services/utils";
import {API_URL} from "../index";

function UsersList() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        fetchUsers();
    }, [])
    useEffect(() => {
    }, [users])
    const fetchUsers = async () => {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const response = await axios
            .get(API_URL + "/user", {
                headers: headers
            })
            .catch(error => {
                console.log(error);
            });
        setUsers(response.data.users)
    }

    const formatDate = (date) =>{
        return date.split("T")[0];
    }


    const listItems = users.map(user => {
            if(user.access_mode === -1){
                return <tr key={user.ID}>
                    <td>{user.ID}</td>
                    <td>{truncStr(user.username, 19)}</td>
                    <td>{formatDate(user.CreatedAt)}</td>
                    <td>
                        <svg id={user.ID} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFC107"
                             className="bi bi-bookmark-star " viewBox="0 0 16 16">
                            <path
                                d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.178.178 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.178.178 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.178.178 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.178.178 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.178.178 0 0 0 .134-.098L7.84 4.1z"/>
                            <path
                                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                        </svg>
                    </td>
                </tr>
            }else {
                return <tr key={user.ID}>
                    <td>{user.ID}</td>
                    <td>{truncStr(user.username, 19)}</td>
                    <td>{formatDate(user.CreatedAt)}</td>
                    <td> </td>
                </tr>
            }
    });

    return (
        <div className="assoc-user-list-div">
            <table className="table table-striped">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Access</th>
                </tr>
                </thead>
                <tbody>
                {listItems}
                </tbody>
            </table>
        </div>
    );
}

export default UsersList;

