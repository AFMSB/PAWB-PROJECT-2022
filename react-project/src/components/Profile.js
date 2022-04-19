import FollowersList from "./FollowersList";
import React, {Component} from "react";
import SearchUsers from "./SearchUsers";
import MapView from "./MapView";
import SendLocBtn from "./SendLocBtn";
import '../css/App.css';
import {getCentralGeoCoordinate} from "../services/utils";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/position/";


class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            markers: [],
            sos: false,
            alertTime: 1
        }
    }

    async getUserLocationsHistory() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"start": "0", "end": "0"})
        };
        const response = await fetch(API_URL + "history", requestOptions);
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

    async getFollowerLocationsHistory(followerID) {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"location":{"start": "0", "end": "0"}, "followerID":parseInt(followerID)})
        };
        const response = await fetch("http://localhost:3000/api/v1/follower/history", requestOptions);
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

    async getSOSState() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        const response = await fetch("http://localhost:3000/api/v1/user/info", requestOptions);
        const data = await response.json();
        if (data.status === 200) {
            this.setState({
                sos: data.user.sos
            }, () => {
                document.querySelector('input[name="sos-switch"]').checked = this.state.sos;
            })
        }
    }

    async changeSOSState() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
        const requestOptions = {
            method: 'POST',
            headers: headers
        };
        const response = await fetch("http://localhost:3000/api/v1/user/sos", requestOptions);
        const data = await response.json();
        if (data.status === 200) {
            this.setState({
                sos: data.sos
            }, () => {
                document.querySelector('input[name="sos-switch"]').checked = this.state.sos;
            })
        }
    }

    async getAlertTime() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        const response = await fetch("http://localhost:3000/api/v1/user/alert-time", requestOptions);
        const data = await response.json();
        if (data.status === 200) {
            this.setState({
                alertTime: data.AlertTime
            }, () => {
                document.querySelector('select[id="alertSelector"]').value = this.state.alertTime
            })
        }
    }

    async updateAlertTime() {
        const activities = document.querySelector("#alertSelector");
        const optionsAvailable = ["1", "6", "12", "24", "48"];
        if (optionsAvailable.indexOf(activities.value) !== -1) {

            const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
            const requestOptions = {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({"AlertTime": parseInt(activities.value)})
            };
            const response = await fetch("http://localhost:3000/api/v1/alert/time", requestOptions);
            const data = await response.json();
            if (data.status === 201) {
                this.setState({
                    alertTime: data.alertTime
                }, () => {
                    // Se descomentado -> alerTime fica vazio depois de updated -> corrigir
                    //document.querySelector('select[id="alertSelector"]').value = this.state.alertTime
                })
            }
        }
    }

    async getUserFollowers() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}

        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        const response = await fetch("http://localhost:3000/api/v1/follower/following", requestOptions);
        const data = await response.json();
        if (data.status === 200) {
            const select = document.getElementById('mapSelector');
            console.log(data.data)
            for (let i = 0; i<=data.data.length; i++){
                const opt = document.createElement('option');
                opt.value = 'followerLocs'
                opt.id = data.data[i].id;
                opt.innerHTML = data.data[i].username + ' Locations';
                select.appendChild(opt);
            }
        }
    }

    async updateMap() {
        const select = document.getElementById('mapSelector');
        const value = select.options[select.selectedIndex].value;
        const id = select.options[select.selectedIndex].id;
        if (value === "myLocs") {
            await this.getUserLocationsHistory()
        } else if (value === "followerLocs") {
            await this.getFollowerLocationsHistory(id)
        }
    }

    async componentDidMount() {
        await this.getUserLocationsHistory()
        await this.getSOSState()
        await this.getAlertTime()
        await this.getUserFollowers()
    }


    render() {
        return (
            <div className="container mt-3">

                <div className="d-flex flex-wrap justify-content-between">
                    <div className="col-12 col-md-3 card mb-2 mb-sm-2 mb-md-0">
                        <div className="card-header">
                            <div className="form-check form-switch d-flex align-items-center justify-content-between">
                                <div>
                                    <input className="form-check-input mb-1 me-2" name="sos-switch" type="checkbox"
                                           role="switch"
                                           id="flexSwitchCheckDefault"
                                           onClick={() => this.changeSOSState()}/>
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">SOS</label>
                                </div>
                                <div>
                                    <select className="text-center" id="alertSelector" defaultValue={'1'}
                                            onChange={() => this.updateAlertTime()}>
                                        <option value="1">1 hour</option>
                                        <option value="6">6 hours</option>
                                        <option value="12">12 hours</option>
                                        <option value="24">24 hours</option>
                                        <option value="48">48 hours</option>
                                    </select>
                                </div>

                            </div>

                        </div>
                        <div className="card-body">
                            <div className="d-flex flex-column align-items-center text-center">
                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin"
                                     className="rounded-circle" width="150"/>
                                <div className="mt-3">
                                    <h4>{localStorage.getItem("username").replaceAll('"', '')}</h4>
                                    <p className="text-secondary mb-1">UFP</p>
                                    <div>
                                        {<SendLocBtn/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-9 card profile-card">
                        <div className="card-body map-parent">
                            <MapView markers={this.state.markers} zoom={12}
                                     center={getCentralGeoCoordinate(this.state.markers)}/>
                            <div className="map-overlay d-flex">
                                <input className="custom-select map-overlay-input"
                                       type="date" id="start" name="trip-start"
                                       value="2018-07-22"
                                       min="2018-01-01" max="2018-12-31"/>
                                <input className="custom-select map-overlay-input"
                                       type="date" id="start" name="trip-start"
                                       value="2018-07-22"
                                       min="2018-01-01" max="2018-12-31"/>
                                <select className="custom-select bg-light map-overlay-input" id="mapSelector"
                                        defaultValue={"myLocs"}
                                        onChange={() => this.updateMap()}>
                                    <option value="myLocs">My Locations</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-12 card mt-2">
                    <div className="card-body">
                        <div className="d-flex justify-content-end">
                            {<SearchUsers/>}
                        </div>

                        <div className="d-flex flex-column align-items-center text-center">
                            <h4 className="mt-3 mt-sm-0">Followers</h4>
                            <FollowersList/>
                        </div>
                    </div>
                </div>
            </div>
        );

    }


}

export default Profile;
