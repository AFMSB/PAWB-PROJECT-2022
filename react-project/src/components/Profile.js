import FollowersList from "./FollowersList";
import React from "react";
import {MapContainer, TileLayer, Marker, Popup, Tooltip, Circle} from 'react-leaflet'
import {Icon} from "leaflet";
import SearchUsers from "./SearchUsers";

const icon = new Icon({
    iconUrl: "assets/pin.png",
    iconSize: [35,35]
})

const center = [51.505, -0.09]

const Profile = () => {
    return (
        <div className="container mt-3">
            <div className="d-flex flex-wrap justify-content-between">
                <div className="col-12 col-md-3 card mb-2 mb-sm-0">
                    <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin"
                                 className="rounded-circle" width="150"/>
                            <div className="mt-3">
                                <h4>John Doe</h4>
                                <p className="text-secondary mb-1">Username</p>
                                <div>
                                    <button className="btn btn-outline-warning m-2 send-location-btn">Send Location</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-9 card profile-card">
                    <div className="card-body map-parent">
                        <MapContainer center={center} zoom={13}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={center} icon={icon}>
                                <Popup>Popup for Marker</Popup>
                                <Tooltip>Tooltip for Marker</Tooltip>
                            </Marker>
                        </MapContainer>
                        <div className="bg-light map-overlay">
                            History
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 card mt-2">
                <div className="card-body">
                    <div>
                        <label className="form-label">Search User</label>
                    </div>
                    {/*<SearchUsers/>*/}
                    <div className="d-flex flex-column align-items-center text-center">
                        <h4>Followers</h4>
                        <FollowersList/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
