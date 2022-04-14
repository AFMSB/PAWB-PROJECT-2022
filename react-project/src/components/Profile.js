import FollowersList from "./FollowersList";
import React from "react";
import SearchUsers from "./SearchUsers";
import MapView from "./MapView";
import data from "../assets/data.json";
import SendLocBtn from "./SendLocBtn";

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
                        <MapView markers={data.markers}/>
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
