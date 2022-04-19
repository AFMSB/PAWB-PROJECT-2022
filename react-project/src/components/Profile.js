import React, {Component} from "react";
import SearchUsers from "./SearchUsers";
import MapView from "./MapView";
import '../css/App.css';
import {getCentralGeoCoordinate} from "../services/utils";
import {StackedToasts} from "./StackedToast";

const API_URL = "http://localhost:3000/api/v1/position/";


class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            markers: [],
            sos: false,
            alertTime: 1,
            Latitude: null,
            Longitude: null,
        }
    }

    async makePositionPost() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
        const lat = this.state.Latitude;
        const long = this.state.Longitude;
        if (lat != null && long != null) {

            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({"Latitude": lat, "Longitude": long})
            };
            const response = await fetch(API_URL, requestOptions);
            const data = await response.json();
            if (data.status === 200) {
                await this.getUserLocationsHistory();
            }
        }
    }

    async onClickHandler() {
        if (navigator.geolocation) {
            await navigator.geolocation.getCurrentPosition(
                position => this.setState({
                    Latitude: position.coords.latitude,
                    Longitude: position.coords.longitude
                }, () => {
                    this.makePositionPost()
                }),
                err => console.log(err)
            );
        } else {
            console.warn("Location Disabled");
        }
    };

    async getUserLocationsHistory() {
        const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
        const startDate = document.getElementById('start').value;
        const endDate = document.getElementById('end').value;
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"start": startDate, "end": endDate})
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
        const startDate = document.getElementById('start').value;
        const endDate = document.getElementById('end').value;
        const requestOptions = {
            method: 'POST',
            headers: headers,
            //body: JSON.stringify({"location":{"start": "0", "end": "0"}, "followerID":parseInt(followerID)})
            body: JSON.stringify({"location": {"start": startDate, "end": endDate}, "followerID": parseInt(followerID)})
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
            for (let i = 0; i <= data.data.length; i++) {
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
                <StackedToasts/>
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
                                        <button
                                            className="btn btn-outline-warning m-2 send-location-btn"
                                            onClick={e => this.onClickHandler(e)}
                                        >Send Location
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-pin-angle ms-1" viewBox="0 0 16 16">
                                                <path
                                                    d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"/>
                                            </svg>
                                        </button>
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
                                       type="date" id="start" name="start"
                                       defaultValue={new Date().toISOString().slice(0, 10)}
                                       min="2018-01-01" max={new Date().toISOString().slice(0, 10)}
                                       onChange={() => this.updateMap()}/>
                                <input className="custom-select map-overlay-input"
                                       type="date" id="end" name="end"
                                       defaultValue={new Date().toISOString().slice(0, 10)}
                                       min="2018-01-01" max={new Date().toISOString().slice(0, 10)}
                                       onChange={() => this.updateMap()}/>
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
                    {<SearchUsers/>}
                </div>
            </div>
        );

    }


}

export default Profile;
