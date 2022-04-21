import React, {useState, useEffect} from 'react';
import axios from "axios";
import {API_URL} from "../index";

function UsersLastLocation() {
    const [usersLastLocation, setUsersLastLocation] = useState([])
    useEffect(() => {
        fetchUsersLastLocation();
    }, [])
    useEffect(() => {
    }, [usersLastLocation])
    const fetchUsersLastLocation = async () => {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const response = await axios
            .get(API_URL + "/user/last-positions",{
                headers: headers
            })
            .catch(error => {
                console.log(error);
            });
        setUsersLastLocation(response.data.userLocs)
    }

    const formatDate = (date) =>{
        let dateSTR = date.split("T")
        return dateSTR[0] + " " + dateSTR[1];
    }


    const listItems = usersLastLocation.map(userLoc =>
        <tr key={userLoc.LocID}>
            <td>{userLoc.LocID}</td>
            <td>{userLoc.UserID}</td>
            <td>{formatDate(userLoc.CreatedAt)}</td>
            <td>{userLoc.Lat}</td>
            <td>{userLoc.Long}</td>
        </tr>
    );

    return (
        <div className="assoc-user-list-div">
            <table className="table table-striped">
                <thead>
                <tr>
                    <th scope="col">Loc. ID</th>
                    <th scope="col">User ID</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Latitude</th>
                    <th scope="col">Longitude</th>
                </tr>
                </thead>
                <tbody>
                {listItems}
                </tbody>
            </table>
        </div>
    );
}

export default UsersLastLocation;
