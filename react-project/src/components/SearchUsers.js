import React, {useState} from 'react'
import axios from "axios";


const SearchUsers = async () => {
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };
    if (searchInput.length > 0) {
        const API_URL = "http://localhost:3000/api/v1/user/search?username=" + searchInput;

        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const response = await axios
            .get(API_URL + "", {
                headers: headers
            })
            .catch(error => {
                console.log(error);
            });

        return response.data.users;
    }

/*
    const listUsers = userFollowers.map(follower =>
        <li key={follower.id}>
            {follower.username} -> {formatDate(follower.created_at)}
        </li>
    );
*/

    return <div>
        <input
            type="search"
            placeholder="Search here"
            onChange={handleChange}
            value={searchInput}
        />
    </div>
};
export default SearchUsers;

