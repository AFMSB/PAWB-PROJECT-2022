import React, {useState, useEffect} from 'react';
import axios from "axios";

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
        <li key={follower.id}>
            {follower.username} -> {formatDate(follower.created_at)}
        </li>
    );

    return (<ul>{listItems}</ul>);
}

export default FollowersList;

