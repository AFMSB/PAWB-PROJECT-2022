import React, {Component} from "react";
import UsersList from "./UsersList";
import UsersLastLocation from "./UsersLastLocation";
import '../css/App.css';
import MapView from "./MapView";

const API_URL = "http://localhost:3000/api/v1/user/";

class AdminDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            markers: []
        }
    }


    async getUsersLastLocation() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        const response = await fetch(API_URL + "last-positions", requestOptions);
        const data = await response.json();
        let markers = await Promise.all(data.userLocs.map(async (marker) => {
            return {
                user_id: marker.UserID,
                created_at: marker.CreatedAt.split("T")[0],
                geometry: [marker.Lat, marker.Long]
            }
        }));
        this.setState({
            markers: markers
        })
    }

    async getUserLocationsHistory(userID) {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
        const startDate = document.getElementById('start').value;
        const endDate = document.getElementById('end').value;
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"location": {"start": startDate, "end": endDate}, "userID": parseInt(userID)})
        };
        const response = await fetch("http://localhost:3000/api/v1/position/history/user",requestOptions);
        const data = await response.json();
        let markers = await Promise.all(data.locations.map(async (marker) => {
            return {
                user_id: marker.UserId,
                created_at: marker.CreatedAt.split("T")[0],
                geometry: [marker.Latitude, marker.Longitude]
            }
        }));
        this.setState({
            markers: markers
        })
    }

    async getAllUsers() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
        const currentUser = localStorage.getItem("username").replaceAll('"','');
        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        const response = await fetch("http://localhost:3000/api/v1/user", requestOptions);
        const data = await response.json();
        if (data.status === 200) {
            const select = document.getElementById('adminMapSelector');
            for (let i = 0; i <= data.users.length; i++) {
                if (currentUser !== data.users[i].username){
                    const opt = document.createElement('option');
                    opt.value = 'userLocs'
                    opt.id = data.users[i].ID;
                    opt.innerHTML = data.users[i].username + ' Locations';
                    select.appendChild(opt);
                }
            }
        }
    }


    async componentDidMount() {
        await this.getUsersLastLocation()
        await this.getAllUsers()

    }

    async updateAdminMap() {
        const select = document.getElementById('adminMapSelector');
        const value = select.options[select.selectedIndex].value;
        const id = select.options[select.selectedIndex].id;
        if (value === "usersLastLocs") {
            await this.getUsersLastLocation()
        } else if (value === "userLocs") {
            await this.getUserLocationsHistory(id)
        }
    }

    render() {
        return (
            <div className="container mt-3">

                <div className="col-12 col-md-12 card mt-2">
                    <div className="card-body map-parent map-admin">
                        <MapView markers={this.state.markers} zoom={5}/>
                        <div className="map-overlay d-flex">
                            <input className="custom-select map-overlay-input"
                                   type="date" id="start" name="start"
                                   defaultValue={new Date().toISOString().slice(0, 10)}
                                   min="2018-01-01" max={new Date().toISOString().slice(0, 10)}
                                   onChange={() => this.updateAdminMap()}/>
                            <input className="custom-select map-overlay-input"
                                   type="date" id="end" name="end"
                                   defaultValue={new Date().toISOString().slice(0, 10)}
                                   min="2018-01-01" max={new Date().toISOString().slice(0, 10)}
                                   onChange={() => this.updateAdminMap()}/>
                            <select className="custom-select bg-light map-overlay-input" id="adminMapSelector"
                                    defaultValue={"usersLastLocs"}
                                    onChange={() => this.updateAdminMap()}>
                                <option value="usersLastLocs">All Users Last Locations</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-12 card mt-2 d-flex flex-column">
                    <div className="accordion " id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="false"
                                        aria-controls="collapseOne">
                                    <strong>Users Information</strong>
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse"
                                 aria-labelledby="headingOne"
                                 data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <UsersList/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-12 card d-flex flex-column mt-2 ">
                    <div className="accordion  " id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo" aria-expanded="false"
                                        aria-controls="collapseTwo">
                                    <strong>Users Last Locations</strong>
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse"
                                 aria-labelledby="headingTwo"
                                 data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <UsersLastLocation/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

export default AdminDashboard;
