import React, {useState, useEffect} from 'react';
import axios from "axios";
import {truncStr} from "../services/utils";

function FollowersList() {
    const [userFollowers, setUserFollowers] = useState([])
    useEffect(() => {
        fetchUserFollowers();
    }, [])
    useEffect(() => {
    }, [userFollowers])
    const fetchUserFollowers = async () => {
        const API_URL = "http://localhost:3000/api/v1/follower/";

        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const response = await axios
            .get(API_URL + "", {
                headers: headers
            })
            .catch(error => {
                console.log(error);
            });

        setUserFollowers(response.data.data)
    }

    const formatDate = (date) =>{
        return date.split("T")[0];
    }

    const listItems = userFollowers.map(follower =>
        <tr>
            <td>{follower.id}</td>
            <td>{truncStr(follower.username, 19)}</td>
            <td>{formatDate(follower.created_at)}</td>
            <td>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     className="bi bi-trash" viewBox="0 0 16 16">
                    <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </td>
        </tr>
    );

    return (
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
                {listItems}
                </tbody>
            </table>
        </div>
    );
}

export default FollowersList;

