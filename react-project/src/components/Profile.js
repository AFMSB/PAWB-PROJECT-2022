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
                                    <button className="btn btn-outline-warning m-2 send-location-btn">
                                        Send Location
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-pin-angle ms-1" viewBox="0 0 16 16">
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
};

export default Profile;
